import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../theme/ColorScheme";
import { useEffect, useState } from "react";
import WelcomeProfile from "../components/Profile/WelcomeProfile";
import CreateProfile from "../components/Profile/CreateProfile";
import * as SecureStore from "expo-secure-store";

export default function CreatingProfileScreen({ navigation }) {
  const API_URL = "http://192.168.100.77:5009";
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");

        const res = await fetch(`${API_URL}/api/user-profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.success && data.userprofile) {
          navigation.replace("HomeScreen");
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <View className="flex-1" style={{ backgroundColor: Colors.bg }} />;
  }

  return (
    <View className="flex-1" style={{ backgroundColor: Colors.bg }}>
      <StatusBar style="light" />
      {open ? (
        <WelcomeProfile open={open} setOpen={setOpen} />
      ) : (
        <CreateProfile />
      )}
    </View>
  );
}