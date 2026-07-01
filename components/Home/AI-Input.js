import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import { Colors, Gradients, FontSizes, FontWeights, Spacing, Radius, Shadows } from "../../theme/ColorScheme";
import AIResponse from "./AI-Response";

export default function AI_Input() {
  const API_URL = "http://192.168.100.77:5009";
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");

  const handleGenerate = async () => {
    setError("");
    const cleaned = prompt.trim();

    if (cleaned.length < 15) {
      setError("Prompt must be at least 15 characters long.");
      return;
    }

    if (cleaned.length > 1000) {
      setError("Prompt cannot exceed 1000 characters.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const token = await SecureStore.getItemAsync("token");

      const res = await fetch(`${API_URL}/api/ai-model`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: cleaned }),
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.response);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: Colors.bg }}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxl, paddingBottom: Spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            color: Colors.textPrimary,
            fontSize: FontSizes.xxl,
            fontWeight: FontWeights.bold,
          }}
        >
          AI Fitness Coach
        </Text>
        <Text
          style={{
            color: Colors.textSecondary,
            fontSize: FontSizes.sm,
            marginTop: Spacing.xs,
          }}
        >
          Describe your goal and let our AI build your personalized plan.
        </Text>

        <View
          style={{
            marginTop: Spacing.xl,
            backgroundColor: Colors.card,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
            borderRadius: Radius.lg,
            padding: Spacing.lg,
            ...Shadows.card,
          }}
        >
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder="e.g. I want to lose 5kg in 2 months, I'm 24, mostly sedentary, no gym access..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={6}
            style={{
              color: Colors.textPrimary,
              fontSize: FontSizes.sm,
              minHeight: 120,
              textAlignVertical: "top",
            }}
          />

          <View className="flex-row justify-between items-center" style={{ marginTop: Spacing.sm }}>
            <Text style={{ color: Colors.textMuted, fontSize: FontSizes.xs }}>
              {prompt.trim().length}/1000
            </Text>
            {error ? (
              <Text style={{ color: Colors.danger, fontSize: FontSizes.xs }}>{error}</Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.85} onPress={handleGenerate} disabled={loading}>
          <LinearGradient
            colors={Gradients.purpleTeal}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              marginTop: Spacing.lg,
              borderRadius: Radius.md,
              paddingVertical: Spacing.md,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              opacity: loading ? 0.7 : 1,
              ...Shadows.purple,
            }}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text
                style={{
                  color: Colors.white,
                  fontSize: FontSizes.md,
                  fontWeight: FontWeights.semibold,
                }}
              >
                Generate My Plan
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {response ? <AIResponse data={response} /> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}