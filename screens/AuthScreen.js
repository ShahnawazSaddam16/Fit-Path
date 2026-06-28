import {View, Text} from "react-native";
import { StatusBar } from "react-native";
import {Colors} from "../theme/ColorScheme";

export default function AuthScreen(){
    return(
        <View className="flex-1 justify-center items-center" style={{backgroundColor: Colors.bg}}>
            <StatusBar style="light"/>
            <Text className="text-[#F0F0FF]">Login</Text>
        </View>
    )
}