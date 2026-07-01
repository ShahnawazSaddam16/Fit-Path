import { StyleSheet, Text } from "react-native";
import { useFontScale } from "./FontScaleContext";

export default function ScaledText({ style, children, ...props }) {
  const { largeFontEnabled } = useFontScale();
  const flattenedStyle = StyleSheet.flatten(style) || {};
  const scaledStyle = largeFontEnabled && typeof flattenedStyle.fontSize === "number"
    ? { ...flattenedStyle, fontSize: Math.round(flattenedStyle.fontSize * 1.25) }
    : flattenedStyle;

  return (
    <Text {...props} style={scaledStyle}>
      {children}
    </Text>
  );
}
