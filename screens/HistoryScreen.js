import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import {Colors} from "../theme/ColorScheme";
import Topbar from "../components/App-Shell/Topbar";
import SearchBar from "../components/History/SearchBar";

export default function HistoryScreen(){
    return(
        <>
        <View className="flex-1" style={{backgroundColor: Colors.bg}}>
            <Topbar />
            <StatusBar style="light"/>
            <SearchBar />
        </View>
        </>
    )
}