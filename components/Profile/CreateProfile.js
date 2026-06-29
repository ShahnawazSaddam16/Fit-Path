import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert, Animated, Platform } from "react-native";
import { useState, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../theme/ColorScheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const API_URL = "http://192.168.100.77:5009";
const steps = ["Basic Info", "Body Stats", "Lifestyle"];

export default function CreateProfile() {
  const navigation = useNavigation();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [sports, setSports] = useState("");
  const [sleep, setSleep] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastSlide = useRef(new Animated.Value(-80)).current;

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

  const pickImage = async (type) => {
    try {
      let result;
      if (type === "camera") {
        result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
      }
      if (!result.canceled) setImage(result.assets[0].uri);
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const showImageOptions = () => {
    Alert.alert("Profile Photo", "Choose a source", [
      { text: "Camera", onPress: () => pickImage("camera") },
      { text: "Gallery", onPress: () => pickImage("gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleNext = () => {
    if (step === 0 && !image) return showToast("Please add a profile photo.", "error");
    if (step === 0 && !age) return showToast("Please enter your age.", "error");
    if (step === 1 && (!weight || !height)) return showToast("Please fill weight and height.", "error");
    if (step < 2) { setStep(step + 1); return; }
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!sports || !sleep) return showToast("Please fill all fields.", "error");
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        setLoading(false);
        return showToast("Session expired. Please login again.", "error");
      }

      const formData = new FormData();
      formData.append("Image", {
        uri: Platform.OS === "android" ? image : image.replace("file://", ""),
        type: "image/jpeg",
        name: "profile.jpg",
      });
      formData.append("age", age);
      formData.append("weight", weight);
      formData.append("height", height);
      formData.append("sports", sports);
      formData.append("sleep", sleep);

      const res = await fetch(`${API_URL}/api/create-profile`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      let data = null;
      try {
        const text = await res.text();
        data = JSON.parse(text);
      } catch {
        setLoading(false);
        return showToast("Invalid response from server.", "error");
      }

      if (!data || !data.success) {
        setLoading(false);
        return showToast((data && data.message) ? data.message : "Something went wrong.", "error");
      }

      showToast("Profile created successfully!", "success");
      setTimeout(() => navigation.replace("HomeScreen"), 1500);
    } catch (e) {
      showToast(e.message || "Network error.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>

      {toast.visible && (
        <Animated.View style={{
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
        }}>
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: toast.type === "success" ? "#2d6a4a" : "#6a2d2d",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <MaterialCommunityIcons
              name={toast.type === "success" ? "check-circle-outline" : "alert-circle-outline"}
              size={20}
              color={toast.type === "success" ? "#4ade80" : "#f87171"}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              color: toast.type === "success" ? "#4ade80" : "#f87171",
              fontSize: 13,
              fontWeight: "700",
              marginBottom: 2,
            }}>
              {toast.type === "success" ? "Success" : "Error"}
            </Text>
            <Text style={{
              color: toast.type === "success" ? "#86efac" : "#fca5a5",
              fontSize: 13,
            }}>
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      )}

      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 pt-14 pb-10">

          <Text className="text-[#6C63FF] text-[28px] font-bold tracking-widest mb-1">Fit-Path</Text>
          <Text className="text-[#9090B8] text-[13px] mb-8">Set up your profile to get started</Text>

          <View className="flex-row items-center mb-10 gap-2">
            {steps.map((label, i) => (
              <View key={i} className="flex-1 items-center">
                <View className={`w-8 h-8 rounded-full items-center justify-center mb-1 ${i <= step ? "bg-[#6C63FF]" : "bg-[#1A1A35] border border-[#252545]"}`}>
                  <Text className={`text-[12px] font-bold ${i <= step ? "text-white" : "text-[#555578]"}`}>{i + 1}</Text>
                </View>
                <Text className={`text-[10px] font-medium ${i <= step ? "text-[#6C63FF]" : "text-[#555578]"}`}>{label}</Text>
                {i < steps.length - 1 && (
                  <View className={`absolute top-4 left-[58%] right-0 h-px ${i < step ? "bg-[#6C63FF]" : "bg-[#252545]"}`} />
                )}
              </View>
            ))}
          </View>

          {step === 0 && (
            <View className="items-center gap-6">
              <TouchableOpacity onPress={showImageOptions} className="items-center">
                {image ? (
                  <Image source={{ uri: image }} className="w-28 h-28 rounded-full border-2 border-[#6C63FF]" />
                ) : (
                  <View className="w-28 h-28 rounded-full bg-[#1A1A35] border-2 border-dashed border-[#6C63FF] items-center justify-center">
                    <Text className="text-3xl">📷</Text>
                    <Text className="text-[#9090B8] text-[11px] mt-1">Add Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
              <View className="w-full">
                <Text className="text-[#9090B8] text-[12px] font-medium mb-2 ml-1">Age</Text>
                <TextInput
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholder="Enter your age"
                  placeholderTextColor={Colors.textMuted}
                  className="w-full bg-[#1A1A35] border border-[#252545] rounded-2xl px-4 py-3.5 text-[#F0F0FF] text-[15px]"
                />
              </View>
            </View>
          )}

          {step === 1 && (
            <View className="gap-5">
              <View>
                <Text className="text-[#9090B8] text-[12px] font-medium mb-2 ml-1">Weight (kg)</Text>
                <TextInput
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholder="e.g. 70"
                  placeholderTextColor={Colors.textMuted}
                  className="w-full bg-[#1A1A35] border border-[#252545] rounded-2xl px-4 py-3.5 text-[#F0F0FF] text-[15px]"
                />
              </View>
              <View>
                <Text className="text-[#9090B8] text-[12px] font-medium mb-2 ml-1">Height (cm)</Text>
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                  placeholder="e.g. 175"
                  placeholderTextColor={Colors.textMuted}
                  className="w-full bg-[#1A1A35] border border-[#252545] rounded-2xl px-4 py-3.5 text-[#F0F0FF] text-[15px]"
                />
              </View>
            </View>
          )}

          {step === 2 && (
            <View className="gap-5">
              <View>
                <Text className="text-[#9090B8] text-[12px] font-medium mb-2 ml-1">Favourite Sports</Text>
                <TextInput
                  value={sports}
                  onChangeText={setSports}
                  placeholder="e.g. Football, Swimming"
                  placeholderTextColor={Colors.textMuted}
                  className="w-full bg-[#1A1A35] border border-[#252545] rounded-2xl px-4 py-3.5 text-[#F0F0FF] text-[15px]"
                />
              </View>
              <View>
                <Text className="text-[#9090B8] text-[12px] font-medium mb-2 ml-1">Sleep Hours (per night)</Text>
                <TextInput
                  value={sleep}
                  onChangeText={setSleep}
                  keyboardType="numeric"
                  placeholder="e.g. 8"
                  placeholderTextColor={Colors.textMuted}
                  className="w-full bg-[#1A1A35] border border-[#252545] rounded-2xl px-4 py-3.5 text-[#F0F0FF] text-[15px]"
                />
              </View>
            </View>
          )}

          <View className="flex-1 justify-end mt-10 gap-3">
            {step > 0 && (
              <TouchableOpacity
                className="w-full bg-[#1A1A35] border border-[#252545] rounded-2xl py-3.5 items-center"
                activeOpacity={0.7}
                onPress={() => setStep(step - 1)}
              >
                <Text className="text-[#9090B8] text-[15px] font-semibold">Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="w-full bg-[#6C63FF] rounded-2xl py-3.5 items-center"
              activeOpacity={0.85}
              onPress={handleNext}
              disabled={loading}
            >
              <Text className="text-white text-[15px] font-bold tracking-wide">
                {loading ? "Creating..." : step === 2 ? "Create Profile" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}