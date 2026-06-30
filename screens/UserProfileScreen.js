import {View, Text} from "react-native";
import {Colors} from "../theme/ColorScheme";

export default function UserProfileScreen(){
    return(
        <>
        <View className="flex-1 justify-center items-center" style={{backgroundColor: Colors.bg}}>
            <Text className="text-white">Profile Screen</Text>
        </View>
        </>
    )
}