import "react-native-gesture-handler";
import "./global.css";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./screens/WelcomeScreen";
import AuthScreen from "./screens/AuthScreen";
import CreatingProfileScreen from "./screens/Profile/CreatingProfileScreen";
import HomeScreen from "./screens/HomeScreen";
import UserProfileScreen from "./screens/Profile/UserProfileScreen";
import SettingScreen from "./screens/SettingScreen";
import { FontScaleProvider } from "./theme/FontScaleContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <FontScaleProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}/>
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
          <Stack.Screen name="CreatingProfileScreen" component={CreatingProfileScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
          <Stack.Screen name="SettingScreen" component={SettingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FontScaleProvider>
  );
}