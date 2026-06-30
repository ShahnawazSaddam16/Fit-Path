import { View, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../theme/ColorScheme";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export default function Topbar() {
  const API_URL = "http://192.168.100.77:5009";
  const [user, setUser] = useState("Guest");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (!token) return;

        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

const userInitials = () => {
  return user?.name
    ? user.name.split(" ").map(word => word[0]).join("").toUpperCase()
    : "G";
};

  return (
    <>
      <View className="flex-1 justify-between items-start mt-10">
        <TouchableOpacity
          className="ml-3"
          style={{ backgroundColor: Colors.surface }}
        >
          <Text className="text-white">{userInitials()}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
