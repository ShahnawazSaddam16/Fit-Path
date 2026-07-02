import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSizes } from "../../theme/ColorScheme";

export default function SearchBar({ value, onChangeText, placeholder = "Search history..." }) {
  return (
    <View
      className="flex-row items-center mt-10 mx-4 px-4 py-3 rounded-2xl"
      style={{ backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder }}
    >
      <Ionicons name="search" size={18} color={Colors.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        className="flex-1 ml-2"
        style={{ color: Colors.textPrimary, fontSize: FontSizes.md }}
      />
    </View>
  );
}