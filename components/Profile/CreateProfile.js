import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../theme/ColorScheme";

const API_URL = "";

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

  const pickImage = async (type) => {
    if (type === "camera") {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return Alert.alert("Permission needed", "Camera access is required.");
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
      if (!result.canceled) setImage(result.assets[0].uri);
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return Alert.alert("Permission needed", "Gallery access is required.");
      const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
      if (!result.canceled) setImage(result.assets[0].uri);
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
    if (step === 0 && !image) return Alert.alert("Required", "Please add a profile photo.");
    if (step === 0 && !age) return Alert.alert("Required", "Please enter your age.");
    if (step === 1 && (!weight || !height)) return Alert.alert("Required", "Please fill weight and height.");
    if (step < 2) { setStep(step + 1); return; }
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!sports || !sleep) return Alert.alert("Required", "Please fill all fields.");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Image: image, age, weight, height, sports, sleep }),
      });
      const data = await res.json();
      if (!data.success) return Alert.alert("Error", data.message);
      navigation.replace("HomeScreen");
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: Colors.bg }} contentContainerStyle={{ flexGrow: 1 }}>
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
  );
}