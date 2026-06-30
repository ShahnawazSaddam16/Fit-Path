import { View, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../theme/ColorScheme";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Topbar() {
  const API_URL = "http://192.168.100.77:5009";
  const navigation = useNavigation();
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
      ? user.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase()
      : "G";
  };

  return (
    <View className="flex-row justify-between items-center mt-12 px-3">
      <TouchableOpacity
        className="items-center justify-center"
        style={{
          backgroundColor: Colors.card,
          width: 40,
          height: 40,
          borderRadius: 20,
        }}
        onPress={() => navigation.navigate("UserProfileScreen")}
      >
        <Text className="text-white font-bold text-[18px]">
          {userInitials()}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center justify-center"
        style={{
          backgroundColor: Colors.card,
          width: 40,
          height: 40,
          borderRadius: 20,
        }}
      >
        <Ionicons name="settings-outline" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );
}