import { useState, useEffect, useCallback } from "react";
import { View, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import ScaledText from "../../theme/ScaledText";
const Text = ScaledText;
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSizes, FontWeights, Spacing } from "../../theme/ColorScheme";

const API_URL = "http://192.168.100.77:5009";

export default function HistoryList({ search }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");
      const res = await fetch(`${API_URL}/api/user-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setHistory(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = async (id) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      await fetch(`${API_URL}/api/delete-history/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const filteredHistory = history.filter((item) =>
    item.prompt.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View
      className="mx-4 mb-3 p-4 rounded-2xl"
      style={{ backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder }}
    >
      <View className="flex-row justify-between items-start">
        <Text
          className="flex-1 mr-2"
          style={{ color: Colors.textPrimary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold }}
        >
          {item.prompt}
        </Text>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <Ionicons name="trash-outline" size={18} color={Colors.coral} />
        </TouchableOpacity>
      </View>
      <Text
        className="mt-2"
        style={{ color: Colors.textSecondary, fontSize: FontSizes.sm }}
        numberOfLines={3}
      >
        {item.response}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={Colors.purple} />
      </View>
    );
  }

  return (
    <FlatList
      data={filteredHistory}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingTop: Spacing.lg, paddingBottom: Spacing.xxl }}
      ListEmptyComponent={
        <View className="items-center mt-20">
          <Text style={{ color: Colors.textMuted, fontSize: FontSizes.md }}>
            No history found
          </Text>
        </View>
      }
    />
  );
}