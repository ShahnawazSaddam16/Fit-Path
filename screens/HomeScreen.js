import { View } from "react-native";
import { StatusBar } from "react-native";
import { Colors } from "../theme/ColorScheme";

export default function ProfileScreen() {

  return (
    <View className="flex-1" style={{ backgroundColor: Colors.bg }}>
      <StatusBar style="light" />
      <Text className="text-white">Hello</Text>
    </View>
  );
}