import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Gradients, FontSizes, FontWeights, Spacing, Radius, Shadows } from "../../theme/ColorScheme";
import * as SecureStore from "expo-secure-store";

export default function WelcomeUser() {
  const API_URL = "http://192.168.100.77:5009";
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

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
    <View style={{ paddingHorizontal: Spacing.lg, marginTop: Spacing.xl }}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <LinearGradient
            colors={Gradients.purpleTeal}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 52,
              height: 52,
              borderRadius: Radius.full,
              justifyContent: "center",
              alignItems: "center",
              marginRight: Spacing.md,
            }}
          >
            <Text
              style={{
                color: Colors.white,
                fontSize: FontSizes.lg,
                fontWeight: FontWeights.bold,
              }}
            >
              {userInitials()}
            </Text>
          </LinearGradient>

          <View>
            <Text
              style={{
                color: Colors.textSecondary,
                fontSize: FontSizes.sm,
                fontWeight: FontWeights.medium,
              }}
            >
              {getGreeting()}
            </Text>
            <Text
              style={{
                color: Colors.textPrimary,
                fontSize: FontSizes.xl,
                fontWeight: FontWeights.bold,
              }}
            >
              {user?.name || "Loading..."}
            </Text>
          </View>
        </View>

        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: Radius.full,
            backgroundColor: Colors.card,
            borderWidth: 1,
            marginLeft: 8,
            borderColor: Colors.cardBorder,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: FontSizes.lg }}>🔔</Text>
        </View>
      </View>

      <View
        style={{
          marginTop: Spacing.xl,
          borderRadius: Radius.lg,
          backgroundColor: Colors.card,
          borderWidth: 1,
          borderColor: Colors.cardBorder,
          padding: Spacing.lg,
          ...Shadows.purple,
        }}
      >
        <View className="flex-row items-center">
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: Radius.md,
              backgroundColor: "rgba(108,99,255,0.15)",
              justifyContent: "center",
              alignItems: "center",
              marginRight: Spacing.sm,
            }}
          >
            <Text style={{ fontSize: FontSizes.md }}>✨</Text>
          </View>
          <Text
            style={{
              color: Colors.textPrimary,
              fontSize: FontSizes.md,
              fontWeight: FontWeights.semibold,
            }}
          >
            AI Health Analysis
          </Text>
        </View>

        <Text
          style={{
            color: Colors.textSecondary,
            fontSize: FontSizes.sm,
            marginTop: Spacing.sm,
            lineHeight: 20,
          }}
        >
          Our AI model analyzes your profile, activity, and goals to build a personalized fitness routine, then suggests healthy changes based on your results.
        </Text>

        <LinearGradient
          colors={Gradients.purpleTeal}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            marginTop: Spacing.lg,
            borderRadius: Radius.md,
            paddingVertical: Spacing.sm,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: Colors.white,
              fontSize: FontSizes.sm,
              fontWeight: FontWeights.semibold,
            }}
          >
            Analyze My Profile
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
}