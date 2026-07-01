import { View, Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Gradients, FontSizes, FontWeights, Spacing, Radius, Shadows } from "../../theme/ColorScheme";

export default function Topbar() {
  const API_URL = "http://192.168.100.77:5009";
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

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
    <View
      className="flex-row justify-between items-center mb-6 pb-2 border-b-2 border-[#6C63FF]"
      style={{
        marginTop: Spacing.xxl,
        paddingHorizontal: Spacing.lg,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("UserProfileScreen")}
      >
        <LinearGradient
          colors={Gradients.purpleTeal}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 44,
            height: 44,
            borderRadius: Radius.full,
            alignItems: "center",
            justifyContent: "center",
            ...Shadows.purple,
          }}
        >
          <Text
            style={{
              color: Colors.white,
              fontSize: FontSizes.md,
              fontWeight: FontWeights.bold,
            }}
          >
            {userInitials()}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View className="flex-row items-center">
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: Radius.full,
            backgroundColor: Colors.teal,
            marginRight: Spacing.xs,
          }}
        />
        <Text
          style={{
            color: Colors.textSecondary,
            fontSize: FontSizes.sm,
            fontWeight: FontWeights.medium,
          }}
        >
          Fit Path
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          width: 44,
          height: 44,
          borderRadius: Radius.full,
          backgroundColor: Colors.card,
          borderWidth: 1,
          borderColor: Colors.cardBorder,
          alignItems: "center",
          justifyContent: "center",
        }}
      onPress={()=>{navigation.navigate("SettingScreen")}}>
        <Ionicons name="settings-outline" size={20} color={Colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}