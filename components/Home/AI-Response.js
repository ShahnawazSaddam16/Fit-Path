import { View, Text } from "react-native";
import { Colors, Gradients, FontSizes, FontWeights, Spacing, Radius, Shadows } from "../../theme/ColorScheme";
import { LinearGradient } from "expo-linear-gradient";

export default function AIResponse({ data }) {
  const parseSections = (text) => {
    if (!text) return [];

    const regex = /\n?(\d+)\.\s+([A-Za-z /&]+)\n/g;
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

  const sections = parseSections(data);

  return (
    <View style={{ marginTop: Spacing.xl }}>
      <View className="flex-row items-center" style={{ marginBottom: Spacing.md }}>
        <View
          style={{
            width: 6,
            height: 20,
            borderRadius: Radius.full,
            backgroundColor: Colors.teal,
            marginRight: Spacing.sm,
          }}
        />
        <Text
          style={{
            color: Colors.textPrimary,
            fontSize: FontSizes.lg,
            fontWeight: FontWeights.bold,
          }}
        >
          Your Personalized Plan
        </Text>
      </View>

      {sections.map((section, index) => (
        <View
          key={index}
          style={{
            backgroundColor: Colors.card,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
            borderRadius: Radius.lg,
            padding: Spacing.lg,
            marginBottom: Spacing.md,
            ...Shadows.card,
          }}
        >
          <View className="flex-row items-center" style={{ marginBottom: Spacing.sm }}>
            <LinearGradient
              colors={Gradients.purpleTeal}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 28,
                height: 28,
                borderRadius: Radius.sm,
                justifyContent: "center",
                alignItems: "center",
                marginRight: Spacing.sm,
              }}
            >
              <Text
                style={{
                  color: Colors.white,
                  fontSize: FontSizes.xs,
                  fontWeight: FontWeights.bold,
                }}
              >
                {section.number}
              </Text>
            </LinearGradient>
            <Text
              style={{
                color: Colors.textPrimary,
                fontSize: FontSizes.md,
                fontWeight: FontWeights.semibold,
              }}
            >
              {section.title}
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
      ))}
    </View>
  );
}