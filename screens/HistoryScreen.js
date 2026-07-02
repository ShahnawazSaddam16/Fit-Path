import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { Colors } from "../theme/ColorScheme";
import Topbar from "../components/App-Shell/Topbar";
import SearchBar from "../components/History/SearchBar";
import HistoryList from "../components/History/HistoryList";

export default function HistoryScreen() {
  const [search, setSearch] = useState("");

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: Colors.bg }}>
        <Topbar />
        <StatusBar style="light" />
        <SearchBar value={search} onChangeText={setSearch} />
        <HistoryList search={search} />
      </View>
    </>
  );
}