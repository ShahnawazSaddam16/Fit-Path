import { View } from "react-native";
import { StatusBar } from "react-native";
import { Colors } from "../theme/ColorScheme";
import { useState } from "react";
import WelcomeProfile from "../components/Profile/WelcomeProfile";
import CreateProfile from "../components/Profile/CreateProfile";

export default function CreatingProfileScreen() {
  const [open, setOpen] = useState(true);

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