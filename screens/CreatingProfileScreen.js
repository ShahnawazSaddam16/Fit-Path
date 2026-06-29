import { View } from "react-native";
import { StatusBar } from "react-native";
import { Colors } from "../theme/ColorScheme";
import { useState, useEffect } from "react";
import WelcomeProfile from "../components/Profile/WelcomeProfile";
import CreateProfile from "../components/Profile/CreateProfile";
import * as SecureStore from "expo-secure-store";

const API_URL = "http://192.168.100.77:5009";

export default function CreatingProfileScreen({ navigation }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const res = await fetch(`${API_URL}/api/user-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success && data.userprofile) {
        navigation.replace("HomeScreen");
      }
    } catch (_) {}
  };

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