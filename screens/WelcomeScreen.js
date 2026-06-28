import { StatusBar } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../theme/ColorScheme";

export default function WelcomeScreen({ navigation }) {

  const handlePress = () => {
    navigation.navigate("AuthScreen");
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <StatusBar style="light" />

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28 }}>

        <View style={{ alignItems: "center", marginBottom: 48 }}>

          <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
            <View
              style={{
                position: "absolute",
                width: 140,
                height: 140,
                borderRadius: 70,
                borderWidth: 1.5,
                borderColor: Colors.purple,
              }}
            />
            <View
              style={{
                position: "absolute",
                width: 160,
                height: 160,
                borderRadius: 80,
                borderWidth: 1,
                borderColor: Colors.teal,
              }}
            />

            <View
              style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                backgroundColor: Colors.card,
                borderWidth: 1.5,
                borderColor: Colors.cardBorder,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons name="weight-lifter" size={58} color={Colors.purple} />
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <View style={{ width: 24, height: 1.5, backgroundColor: Colors.teal, borderRadius: 1 }} />
            <Text style={{ color: Colors.teal, fontSize: 11, fontWeight: "600", letterSpacing: 3, textTransform: "uppercase" }}>
              AI Fitness Coach
            </Text>
            <View style={{ width: 24, height: 1.5, backgroundColor: Colors.teal, borderRadius: 1 }} />
          </View>

          <Text style={{ color: Colors.textPrimary, fontSize: 36, fontWeight: "700", textAlign: "center", lineHeight: 44, marginBottom: 12 }}>
            Your path to{"\n"}
            <Text style={{ color: Colors.purple }}>peak fitness</Text>
          </Text>

          <Text style={{ color: Colors.textSecondary, fontSize: 14, lineHeight: 24, textAlign: "center", paddingHorizontal: 8 }}>
            AI-powered roadmaps built around your age, routine, and goals — not someone else's.
          </Text>
        </View>

        <View style={{ width: "100%" }}>

          <View style={{ flexDirection: "row", justifyContent: "center", gap: 20, marginBottom: 28 }}>
            {[
              { icon: "fire", label: "Goal-based" },
              { icon: "brain", label: "AI-powered" },
              { icon: "calendar-check", label: "Personalized" },
            ].map((item) => (
              <View key={item.label} style={{ alignItems: "center", gap: 6 }}>
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: Colors.card,
                  borderWidth: 1,
                  borderColor: Colors.cardBorder,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <MaterialCommunityIcons name={item.icon} size={22} color={Colors.teal} />
                </View>
                <Text style={{ color: Colors.textMuted, fontSize: 10, fontWeight: "500" }}>{item.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.85}
            style={{
              backgroundColor: Colors.purple,
              borderRadius: 16,
              paddingVertical: 17,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <MaterialCommunityIcons name="lightning-bolt" size={20} color={Colors.white} />
            <Text style={{ color: Colors.white, fontSize: 16, fontWeight: "700", letterSpacing: 0.5 }}>
              Get Started
            </Text>
          </TouchableOpacity>

          <Text style={{ color: Colors.textMuted, fontSize: 12, textAlign: "center", marginTop: 16 }}>
            Free to use · Powered by Butt Networks
          </Text>
        </View>

      </View>
    </View>
  );
}