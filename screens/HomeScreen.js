import { View, Text, ScrollView, StatusBar } from "react-native";
import { Colors } from "../theme/ColorScheme";
import Topbar from "../components/App-Shell/Topbar";
import WelcomeUser from "../components/Home/WelcomeUser";
import AI_Input from "../components/Home/AI-Input";

export default function HomeScreen() {
  return (
    <View className="flex-1" style={{ backgroundColor: Colors.bg }}>
      <StatusBar barStyle="light-content" />
      <Topbar />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeUser />
        <AI_Input />
      </ScrollView>
    </View>
  );
}