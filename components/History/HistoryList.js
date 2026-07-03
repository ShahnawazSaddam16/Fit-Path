import { useState, useEffect, useCallback } from "react";
import { View, FlatList, ActivityIndicator, TouchableOpacity, Modal, ScrollView } from "react-native";
import ScaledText from "../../theme/ScaledText";
const Text = ScaledText;
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Gradients, FontSizes, FontWeights, Spacing, Radius, Shadows } from "../../theme/ColorScheme";
import { LinearGradient } from "expo-linear-gradient";

const API_URL = "http://192.168.100.77:5009";

export default function HistoryList({ search }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

  useEffect(() => {
    setVisibleCount(6);
  }, [search, history]);

  const confirmDelete = (id) => setDeleteTarget(id);
  const cancelDelete = () => setDeleteTarget(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const token = await SecureStore.getItemAsync("token");
      await fetch(`${API_URL}/api/delete-history/${deleteTarget}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory((prev) => prev.filter((item) => item._id !== deleteTarget));
    } catch (err) {
      console.log(err);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filteredHistory = history.filter((item) =>
    item.prompt.toLowerCase().includes(search.toLowerCase())
  );

  const visibleHistory = filteredHistory.slice(0, visibleCount);

  const loadMore = () => {
    if (visibleCount < filteredHistory.length) {
      setVisibleCount((count) => Math.min(count + 6, filteredHistory.length));
    }
  };

  const parseSections = (text) => {
    if (!text) return [];

    const regex = /\n?(\d{1,2})\.\s*\*{0,2}([A-Za-z0-9 /&\-]+?)\*{0,2}:?\s*\n/g;
    const matches = [...text.matchAll(regex)];

    if (matches.length === 0) {
      return [{ number: "1", title: "Result", content: text.trim() }];
    }

    const sections = [];

    matches.forEach((match, i) => {
      const start = match.index + match[0].length;
      const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
      const content = text.slice(start, end).trim();

      sections.push({
        number: match[1],
        title: match[2].trim(),
        content,
      });
    });

    return sections;
  };

  const renderItem = ({ item }) => {
    const isLong = item.response?.length > 140;
    return (
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
          <TouchableOpacity
            onPress={() => confirmDelete(item._id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
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

        {isLong && (
          <TouchableOpacity onPress={() => setSelectedItem(item)} className="mt-2 self-start">
            <Text style={{ color: Colors.purple, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold }}>
              Read more
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={Colors.purple} />
      </View>
    );
  }

  const selectedSections = parseSections(selectedItem?.response);

  return (
    <>
      <FlatList
        data={visibleHistory}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        contentContainerStyle={{ paddingTop: Spacing.lg, paddingBottom: Spacing.xxl }}
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Text style={{ color: Colors.textMuted, fontSize: FontSizes.md }}>
              No history found
            </Text>
          </View>
        }
        ListFooterComponent={
          visibleCount < filteredHistory.length ? (
            <TouchableOpacity onPress={loadMore} className="items-center justify-center mt-4 pb-8">
              <Text style={{ color: Colors.purple, fontSize: FontSizes.md }}>
                Search more
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <Modal visible={!!deleteTarget} transparent animationType="fade" onRequestClose={cancelDelete}>
        <View className="flex-1 items-center justify-center px-8" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
          <View
            className="w-full p-5 rounded-2xl"
            style={{ backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder }}
          >
            <View className="items-center mb-4">
              <View
                className="items-center justify-center mb-3"
                style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: `${Colors.coral}20` }}
              >
                <Ionicons name="trash-outline" size={22} color={Colors.coral} />
              </View>
              <Text style={{ color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: FontWeights.semibold }}>
                Delete this entry?
              </Text>
              <Text
                className="mt-1 text-center"
                style={{ color: Colors.textSecondary, fontSize: FontSizes.sm }}
              >
                This action can't be undone.
              </Text>
            </View>

            <View className="flex-row" style={{ gap: Spacing.sm }}>
              <TouchableOpacity
                onPress={cancelDelete}
                className="flex-1 items-center justify-center py-3 rounded-xl"
                style={{ backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.cardBorder }}
              >
                <Text style={{ color: Colors.textPrimary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                disabled={deleting}
                className="flex-1 items-center justify-center py-3 rounded-xl"
                style={{ backgroundColor: Colors.coral, opacity: deleting ? 0.7 : 1 }}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ color: "#fff", fontSize: FontSizes.md, fontWeight: FontWeights.semibold }}>
                    Delete
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={!!selectedItem} transparent animationType="fade" onRequestClose={() => setSelectedItem(null)}>
        <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
          <View
            className="w-full p-5 rounded-2xl"
            style={{ backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder, maxHeight: "80%" }}
          >
            <View className="flex-row justify-between items-start mb-4">
              <Text
                className="flex-1 mr-2"
                style={{ color: Colors.textPrimary, fontSize: FontSizes.md, fontWeight: FontWeights.bold }}
              >
                {selectedItem?.prompt}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedItem(null)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedSections.map((section, index) => (
                <View key={index} style={{ marginBottom: Spacing.xl }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: Spacing.sm,
                      paddingHorizontal: Spacing.xs,
                    }}
                  >
                    <LinearGradient
                      colors={Gradients.purpleTeal}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: Radius.full,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: Spacing.md,
                        ...Shadows.card,
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.white,
                          fontSize: FontSizes.md,
                          fontWeight: FontWeights.bold,
                        }}
                      >
                        {section.number}
                      </Text>
                    </LinearGradient>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: Colors.textMuted,
                          fontSize: FontSizes.xs,
                          fontWeight: FontWeights.semibold,
                          letterSpacing: 0.5,
                        }}
                      >
                        STEP {section.number} OF {selectedSections.length}
                      </Text>
                      <Text
                        style={{
                          color: Colors.textPrimary,
                          fontSize: FontSizes.md,
                          fontWeight: FontWeights.bold,
                        }}
                      >
                        {section.title}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      backgroundColor: Colors.surface,
                      borderWidth: 1,
                      borderColor: Colors.cardBorder,
                      borderRadius: Radius.md,
                      padding: Spacing.md,
                    }}
                  >
                    <View className="flex-row items-center" style={{ marginBottom: Spacing.xs }}>
                      <View
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: Radius.full,
                          backgroundColor: Colors.teal,
                          marginRight: Spacing.xs,
                        }}
                      />
                      <Text
                        style={{
                          color: Colors.teal,
                          fontSize: FontSizes.xs,
                          fontWeight: FontWeights.semibold,
                          letterSpacing: 0.5,
                        }}
                      >
                        ANALYSIS
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: Colors.textSecondary,
                        fontSize: FontSizes.sm,
                        lineHeight: 21,
                      }}
                    >
                      {section.content}
                    </Text>
                  </View>

                  {index < selectedSections.length - 1 && (
                    <View
                      style={{
                        width: 2,
                        height: Spacing.lg,
                        backgroundColor: Colors.cardBorder,
                        alignSelf: "flex-start",
                        marginLeft: Spacing.xl,
                        marginTop: Spacing.sm,
                      }}
                    />
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}