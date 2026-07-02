import { View } from "react-native";
import ScaledText from "../../theme/ScaledText";
const Text = ScaledText;
import { Colors, Gradients, FontSizes, FontWeights, Spacing, Radius, Shadows } from "../../theme/ColorScheme";
import { LinearGradient } from "expo-linear-gradient";

export default function AIResponse({ data }) {
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

  const sections = parseSections(data);

  return (
    <View style={{ marginTop: Spacing.xl }}>
      <View className="flex-row items-center" style={{ marginBottom: Spacing.lg }}>
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
                STEP {section.number} OF {sections.length}
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
              backgroundColor: Colors.card,
              borderWidth: 1,
              borderColor: Colors.cardBorder,
              borderRadius: Radius.lg,
              padding: Spacing.lg,
              ...Shadows.card,
            }}
          >
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
          </View>

          {index < sections.length - 1 && (
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
    </View>
  );
}