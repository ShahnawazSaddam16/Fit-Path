import { View, Text, ScrollView } from "react-native";
import { StatusBar } from "react-native";
import { Colors } from "../theme/ColorScheme";
import Topbar from "../components/App-Shell/Topbar";
import WelcomeUser from "../components/Home/WelcomeUser";

export default function HomeScreen() {

  return (
    <View className="flex-1" style={{ backgroundColor: Colors.bg }}>
      <StatusBar style="light" />
     <Topbar />
      <WelcomeUser/>
    </View>
  );
}