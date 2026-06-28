import { View, Text, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { StatusBar } from "react-native";
import { Colors } from "../theme/ColorScheme";
import { useState, useRef, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AuthScreen({ navigation }) {
  const [signin, setSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const switchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSwitch = (isSignIn) => {
    Animated.sequence([
      Animated.timing(switchAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(switchAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
    setSignIn(isSignIn);
  };

  const inputStyle = (field) => ({
    backgroundColor: focusedField === field ? Colors.card : Colors.surface,
    borderWidth: 1.5,
    borderColor: focusedField === field ? Colors.purple : Colors.cardBorder,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 15,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    flex: 1,
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          <View style={{ alignItems: "center", marginBottom: 36 }}>
            <View style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: Colors.card,
              borderWidth: 1.5,
              borderColor: Colors.cardBorder,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 18,
            }}>
              <MaterialCommunityIcons name="weight-lifter" size={36} color={Colors.purple} />
            </View>
            <Text style={{
              color: Colors.textPrimary,
              fontSize: 28,
              fontWeight: "700",
              letterSpacing: 0.3,
              fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
              marginBottom: 6,
            }}>
              {signin ? "Welcome back" : "Create account"}
            </Text>
            <Text style={{
              color: Colors.textSecondary,
              fontSize: 14,
              fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
            }}>
              {signin ? "Sign in to continue your journey" : "Start your fitness roadmap today"}
            </Text>
          </View>

          <View style={{
            flexDirection: "row",
            backgroundColor: Colors.surface,
            borderRadius: 14,
            padding: 4,
            marginBottom: 28,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
          }}>
            <TouchableOpacity
              onPress={() => handleSwitch(false)}
              activeOpacity={0.8}
              style={{
                flex: 1,
                paddingVertical: 11,
                borderRadius: 11,
                alignItems: "center",
                backgroundColor: !signin ? Colors.purple : "transparent",
              }}
            >
              <Text style={{
                color: !signin ? Colors.white : Colors.textSecondary,
                fontSize: 14,
                fontWeight: "600",
                fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
              }}>
                Sign Up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSwitch(true)}
              activeOpacity={0.8}
              style={{
                flex: 1,
                paddingVertical: 11,
                borderRadius: 11,
                alignItems: "center",
                backgroundColor: signin ? Colors.purple : "transparent",
              }}
            >
              <Text style={{
                color: signin ? Colors.white : Colors.textSecondary,
                fontSize: 14,
                fontWeight: "600",
                fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
              }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={{ opacity: switchAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }}>

            {!signin && (
              <View style={{ marginBottom: 14 }}>
                <Text style={{
                  color: Colors.textSecondary,
                  fontSize: 12,
                  fontWeight: "600",
                  letterSpacing: 0.5,
                  marginBottom: 8,
                  fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
                }}>
                  FULL NAME
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    backgroundColor: Colors.card,
                    borderWidth: 1,
                    borderColor: Colors.cardBorder,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <MaterialCommunityIcons name="account-outline" size={22} color={Colors.textSecondary} />
                  </View>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="John Doe"
                    placeholderTextColor={Colors.textMuted}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle("name")}
                  />
                </View>
              </View>
            )}

            <View style={{ marginBottom: 14 }}>
              <Text style={{
                color: Colors.textSecondary,
                fontSize: 12,
                fontWeight: "600",
                letterSpacing: 0.5,
                marginBottom: 8,
                fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
              }}>
                EMAIL ADDRESS
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  backgroundColor: Colors.card,
                  borderWidth: 1,
                  borderColor: Colors.cardBorder,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <MaterialCommunityIcons name="email-outline" size={22} color={Colors.textSecondary} />
                </View>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle("email")}
                />
              </View>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{
                color: Colors.textSecondary,
                fontSize: 12,
                fontWeight: "600",
                letterSpacing: 0.5,
                marginBottom: 8,
                fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
              }}>
                PASSWORD
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  backgroundColor: Colors.card,
                  borderWidth: 1,
                  borderColor: Colors.cardBorder,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <MaterialCommunityIcons name="lock-outline" size={22} color={Colors.textSecondary} />
                </View>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", position: "relative" }}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={!showPass}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    style={[inputStyle("password"), { paddingRight: 48 }]}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 14 }}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name={showPass ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={Colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {signin && (
              <TouchableOpacity activeOpacity={0.7} style={{ alignSelf: "flex-end", marginTop: -16, marginBottom: 24 }}>
                <Text style={{ color: Colors.purple, fontSize: 13, fontWeight: "600" }}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                backgroundColor: Colors.purple,
                borderRadius: 16,
                paddingVertical: 17,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <MaterialCommunityIcons name="lightning-bolt" size={20} color={Colors.white} />
              <Text style={{
                color: Colors.white,
                fontSize: 16,
                fontWeight: "700",
                letterSpacing: 0.5,
                fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
              }}>
                {signin ? "Login" : "Create Account"}
              </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}>
              <Text style={{ color: Colors.textSecondary, fontSize: 13 }}>
                {signin ? "Don't have an account?" : "Already have an account?"}
              </Text>
              <TouchableOpacity onPress={() => handleSwitch(!signin)} activeOpacity={0.7}>
                <Text style={{ color: Colors.purple, fontSize: 13, fontWeight: "700" }}>
                  {signin ? "Sign Up" : "Login"}
                </Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}