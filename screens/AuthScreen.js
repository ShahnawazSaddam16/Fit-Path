import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "react-native";
import { Colors } from "../theme/ColorScheme";
import { useState, useRef, useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

const API_URL = "http://192.168.100.77:5009";

export default function AuthScreen({ navigation }) {
  const [signin, setSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const switchAnim = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastSlide = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    checkSession();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  const checkSession = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();
      if (data.success) {
        if (data.user?.hasProfile) {
          navigation.replace("HomeScreen");
        } else {
          navigation.replace("CreatingProfileScreen");
        }
      } else {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
      }
    } catch (_) {}
  };

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    toastAnim.setValue(0);
    toastSlide.setValue(-80);
    Animated.parallel([
      Animated.timing(toastAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(toastSlide, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.timing(toastSlide, { toValue: -80, duration: 300, useNativeDriver: true }),
        ]).start(() => setToast({ visible: false, message: "", type: "" }));
      }, 3000);
    });
  };

  const handleSwitch = (isSignIn) => {
    Animated.sequence([
      Animated.timing(switchAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(switchAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
    setSignIn(isSignIn);
  };

  const handleSubmit = async () => {
    if (!email || !password || (!signin && !name)) {
      showToast("Please fill all fields", "error");
      return;
    }
    setLoading(true);
    try {
      const endpoint = signin ? "/api/auth/login" : "/api/auth/signup";
      const body = signin ? { email, password } : { name, email, password };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Something went wrong", "error");
        return;
      }

      await SecureStore.setItemAsync("token", data.token);
      await SecureStore.setItemAsync("user", JSON.stringify(data.user));

      showToast(signin ? "Welcome back!" : "Account created successfully!", "success");

      setTimeout(() => {
        if (data.user?.hasProfile) {
          navigation.replace("HomeScreen");
        } else {
          navigation.replace("CreatingProfileScreen");
        }
      }, 1200);
    } catch (err) {
      if (err.name === "AbortError") {
        showToast("Request timed out. Try again.", "error");
      } else {
        showToast(err.message || "Network error. Check your connection.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (value) => {
    if (!value) return { score: 0, label: "", color: Colors.cardBorder, width: "0%" };

    let score = 0;
    if (value.length >= 6) score++;
    if (value.length >= 10) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    if (score <= 2) {
      return { score, label: "Weak", color: "#f87171", width: "33%" };
    } else if (score <= 3) {
      return { score, label: "Medium", color: "#facc15", width: "66%" };
    } else {
      return { score, label: "Strong", color: "#4ade80", width: "100%" };
    }
  };

  const passwordStrength = getPasswordStrength(password);

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

      {toast.visible && (
        <Animated.View
          style={{
            position: "absolute",
            top: Platform.OS === "ios" ? 60 : 40,
            left: 20,
            right: 20,
            zIndex: 999,
            opacity: toastAnim,
            transform: [{ translateY: toastSlide }],
            backgroundColor: toast.type === "success" ? "#1a3a2a" : "#3a1a1a",
            borderRadius: 16,
            paddingHorizontal: 18,
            paddingVertical: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            borderWidth: 1,
            borderColor: toast.type === "success" ? "#2d6a4a" : "#6a2d2d",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: toast.type === "success" ? "#2d6a4a" : "#6a2d2d",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name={toast.type === "success" ? "check-circle-outline" : "alert-circle-outline"}
              size={20}
              color={toast.type === "success" ? "#4ade80" : "#f87171"}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: toast.type === "success" ? "#4ade80" : "#f87171",
                fontSize: 13,
                fontWeight: "700",
                marginBottom: 2,
                fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
              }}
            >
              {toast.type === "success" ? "Success" : "Error"}
            </Text>
            <Text
              style={{
                color: toast.type === "success" ? "#86efac" : "#fca5a5",
                fontSize: 13,
                fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
              }}
            >
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      )}

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

              {!signin && password.length > 0 && (
                <View style={{ marginTop: 10, paddingLeft: 58 }}>
                  <View style={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: Colors.surface,
                    borderWidth: 1,
                    borderColor: Colors.cardBorder,
                    overflow: "hidden",
                  }}>
                    <View style={{
                      height: "100%",
                      width: passwordStrength.width,
                      borderRadius: 3,
                      backgroundColor: passwordStrength.color,
                    }} />
                  </View>
                  <Text style={{
                    marginTop: 6,
                    fontSize: 12,
                    fontWeight: "600",
                    color: passwordStrength.color,
                    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
                  }}>
                    {passwordStrength.label}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
              style={{
                backgroundColor: loading ? Colors.cardBorder : Colors.purple,
                borderRadius: 16,
                paddingVertical: 17,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <>
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
                </>
              )}
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