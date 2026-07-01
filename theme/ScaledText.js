import { StyleSheet, Text } from "react-native";
import { styled } from "nativewind";
import { useFontScale } from "./FontScaleContext";

const StyledText = styled(Text);

export default function ScaledText({ style, children, ...props }) {
  const { largeFontEnabled } = useFontScale();
  const flattenedStyle = StyleSheet.flatten(style) || {};
  const scaledStyle = largeFontEnabled && typeof flattenedStyle.fontSize === "number"
    ? { ...flattenedStyle, fontSize: Math.round(flattenedStyle.fontSize * 1.25) }
    : flattenedStyle;

  return (
    <StyledText {...props} style={scaledStyle}>
      {children}
    </StyledText>
  );
}
