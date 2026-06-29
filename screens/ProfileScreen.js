import {View, Text} from "react-native";
import { StatusBar } from "react-native";

export default function ProfileScreen(){
    return(
        <>
        <View className="flex-1 justify-center items-center">
            <StatusBar style="light"/>
            <Text className="text-white">Profile Screen</Text>
        </View>
        </>
    )
}