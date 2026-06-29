import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert, Animated, Platform, Modal } from "react-native";
import { useState, useRef, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../theme/ColorScheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const API_URL = "http://192.168.100.77:5009";
const steps = ["Basic Info", "Body Stats", "Lifestyle"];

const SPORTS_CATEGORIES = [
  { label: "Football", icon: "soccer" },
  { label: "Basketball", icon: "basketball" },
  { label: "Swimming", icon: "swim" },
  { label: "Running", icon: "run" },
  { label: "Cycling", icon: "bike" },
  { label: "Tennis", icon: "tennis" },
  { label: "Cricket", icon: "cricket" },
  { label: "Gym", icon: "dumbbell" },
  { label: "Yoga", icon: "yoga" },
  { label: "Boxing", icon: "boxing-glove" },
  { label: "Volleyball", icon: "volleyball" },
  { label: "Badminton", icon: "badminton" },
];

const WEIGHT_SUGGESTIONS = ["50", "55", "60", "65", "70", "75", "80", "85", "90", "95", "100"];
const HEIGHT_SUGGESTIONS = ["150", "155", "160", "165", "170", "175", "180", "185", "190"];
const SLEEP_OPTIONS = ["5", "6", "7", "8", "9", "10"];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => String(currentYear - 10 - i));
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

export default function CreateProfile() {
  const navigation = useNavigation();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarField, setCalendarField] = useState("day");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [selectedSports, setSelectedSports] = useState([]);
  const [sleep, setSleep] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });

  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastSlide = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    fetchUserName();
  }, []);

  const fetchUserName = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.user?.name) {
        setUserName(data.user.name);
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

  const toggleSport = (label) => {
    setSelectedSports((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const computeAge = (day, month, monthName, year) => {
    const monthIndex = MONTHS.indexOf(monthName);
    if (monthIndex === -1 || !day || !year) return "";
    const birth = new Date(parseInt(year), monthIndex, parseInt(day));
    const today = new Date();
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return String(a);
  };

  const handleDobSelect = (value) => {
    const updated = { ...dob, [calendarField]: value };
    setDob(updated);
    if (calendarField === "day") setCalendarField("month");
    else if (calendarField === "month") setCalendarField("year");
    else {
      setShowCalendar(false);
      setCalendarField("day");
      const computed = computeAge(updated.day, updated.month, updated.month, updated.year);
      setAge(computed);
    }
  };

  const dobDisplay = dob.day && dob.month && dob.year
    ? `${dob.day} ${dob.month} ${dob.year}`
    : "Select Date of Birth";

  const handleNext = () => {
    if (step === 0 && !image) return showToast("Please add a profile photo.", "error");
    if (step === 0 && !age) return showToast("Please select your date of birth.", "error");
    if (step === 1 && (!weight || !height)) return showToast("Please fill weight and height.", "error");
    if (step === 2 && selectedSports.length === 0) return showToast("Please select at least one sport.", "error");
    if (step < 2) { setStep(step + 1); return; }
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!sleep) return showToast("Please select sleep hours.", "error");
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
      formData.append("sports", selectedSports.join(", "));
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

  const calendarData = calendarField === "day" ? DAYS : calendarField === "month" ? MONTHS : YEARS;
  const calendarTitle = calendarField === "day" ? "Select Day" : calendarField === "month" ? "Select Month" : "Select Year";

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
            <Text style={{ color: toast.type === "success" ? "#4ade80" : "#f87171", fontSize: 13, fontWeight: "700", marginBottom: 2 }}>
              {toast.type === "success" ? "Success" : "Error"}
            </Text>
            <Text style={{ color: toast.type === "success" ? "#86efac" : "#fca5a5", fontSize: 13 }}>
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      )}

      <Modal visible={showCalendar} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#12122A", borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 32 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#252545" }}>
              <Text style={{ color: "#9090B8", fontSize: 12, fontWeight: "600", letterSpacing: 1 }}>{calendarTitle}</Text>
              <TouchableOpacity onPress={() => { setShowCalendar(false); setCalendarField("day"); }}>
                <MaterialCommunityIcons name="close" size={20} color="#9090B8" />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 16, gap: 10 }}>
              {calendarData.map((val) => {
                const isSelected = dob[calendarField] === val;
                return (
                  <TouchableOpacity
                    key={val}
                    onPress={() => handleDobSelect(val)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 12,
                      backgroundColor: isSelected ? "#6C63FF" : "#1A1A35",
                      borderWidth: 1,
                      borderColor: isSelected ? "#6C63FF" : "#252545",
                      minWidth: 52,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: isSelected ? "#fff" : "#9090B8", fontSize: 14, fontWeight: isSelected ? "700" : "400" }}>{val}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 pt-14 pb-10">

          <Text className="text-[#6C63FF] text-[28px] font-bold tracking-widest mb-1">Fit-Path</Text>
          <Text className="text-[#9090B8] text-[13px] mb-8">
            {userName ? `Hey ${userName}, set up your profile` : "Set up your profile to get started"}
          </Text>

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
                  <View style={{ position: "relative" }}>
                    <Image source={{ uri: image }} className="w-28 h-28 rounded-full border-2 border-[#6C63FF]" />
                    <View style={{ position: "absolute", bottom: 2, right: 2, backgroundColor: "#6C63FF", borderRadius: 12, padding: 4 }}>
                      <MaterialCommunityIcons name="pencil" size={12} color="#fff" />
                    </View>
                  </View>
                ) : (
                  <View className="w-28 h-28 rounded-full bg-[#1A1A35] border-2 border-dashed border-[#6C63FF] items-center justify-center">
                    <Text className="text-3xl">📷</Text>
                    <Text className="text-[#9090B8] text-[11px] mt-1">Add Photo</Text>
                  </View>
                )}
              </TouchableOpacity>

              {userName ? (
                <Text style={{ color: "#F0F0FF", fontSize: 16, fontWeight: "700", letterSpacing: 0.3 }}>
                  {userName}
                </Text>
              ) : null}

              <View className="w-full">
                <Text className="text-[#9090B8] text-[12px] font-medium mb-2 ml-1">Date of Birth</Text>
                <TouchableOpacity
                  onPress={() => { setCalendarField("day"); setShowCalendar(true); }}
                  style={{
                    backgroundColor: "#1A1A35",
                    borderWidth: 1,
                    borderColor: "#252545",
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: dob.day ? "#F0F0FF" : "#555578", fontSize: 15 }}>{dobDisplay}</Text>
                  <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#6C63FF" />
                </TouchableOpacity>
                {age ? (
                  <Text style={{ color: "#6C63FF", fontSize: 12, marginTop: 6, marginLeft: 4 }}>
                    Age: {age} years
                  </Text>
                ) : null}
              </View>
            </View>
          )}

          {step === 1 && (
            <View className="gap-6">
              <View>
                <Text className="text-[#9090B8] text-[12px] font-medium mb-2 ml-1">Weight (kg)</Text>
                <View style={{ backgroundColor: "#1A1A35", borderWidth: 1, borderColor: "#252545", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <MaterialCommunityIcons name="weight-kilogram" size={20} color="#6C63FF" />
                  <TextInput
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    placeholder="e.g. 70"
                    placeholderTextColor={Colors.textMuted}
                    style={{ flex: 1, color: "#F0F0FF", fontSize: 15 }}
                  />
                  <Text style={{ color: "#555578", fontSize: 13 }}>kg</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {WEIGHT_SUGGESTIONS.map((w) => (
                      <TouchableOpacity
                        key={w}
                        onPress={() => setWeight(w)}
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 7,
                          borderRadius: 10,
                          backgroundColor: weight === w ? "#6C63FF" : "#1A1A35",
                          borderWidth: 1,
                          borderColor: weight === w ? "#6C63FF" : "#252545",
                        }}
                      >
                        <Text style={{ color: weight === w ? "#fff" : "#9090B8", fontSize: 13 }}>{w}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View>
                <Text className="text-[#9090B8] text-[12px] font-medium mb-2 ml-1">Height (cm)</Text>
                <View style={{ backgroundColor: "#1A1A35", borderWidth: 1, borderColor: "#252545", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <MaterialCommunityIcons name="human-male-height" size={20} color="#6C63FF" />
                  <TextInput
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                    placeholder="e.g. 175"
                    placeholderTextColor={Colors.textMuted}
                    style={{ flex: 1, color: "#F0F0FF", fontSize: 15 }}
                  />
                  <Text style={{ color: "#555578", fontSize: 13 }}>cm</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {HEIGHT_SUGGESTIONS.map((h) => (
                      <TouchableOpacity
                        key={h}
                        onPress={() => setHeight(h)}
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 7,
                          borderRadius: 10,
                          backgroundColor: height === h ? "#6C63FF" : "#1A1A35",
                          borderWidth: 1,
                          borderColor: height === h ? "#6C63FF" : "#252545",
                        }}
                      >
                        <Text style={{ color: height === h ? "#fff" : "#9090B8", fontSize: 13 }}>{h}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>
          )}

          {step === 2 && (
            <View className="gap-6">
              <View>
                <Text className="text-[#9090B8] text-[12px] font-medium mb-3 ml-1">Favourite Sports</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                  {SPORTS_CATEGORIES.map((sport) => {
                    const isSelected = selectedSports.includes(sport.label);
                    return (
                      <TouchableOpacity
                        key={sport.label}
                        onPress={() => toggleSport(sport.label)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          paddingHorizontal: 14,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: isSelected ? "#6C63FF" : "#1A1A35",
                          borderWidth: 1,
                          borderColor: isSelected ? "#6C63FF" : "#252545",
                        }}
                      >
                        <MaterialCommunityIcons name={sport.icon} size={16} color={isSelected ? "#fff" : "#9090B8"} />
                        <Text style={{ color: isSelected ? "#fff" : "#9090B8", fontSize: 13, fontWeight: isSelected ? "700" : "400" }}>
                          {sport.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {selectedSports.length > 0 && (
                  <Text style={{ color: "#6C63FF", fontSize: 11, marginTop: 8, marginLeft: 2 }}>
                    {selectedSports.length} selected
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-[#9090B8] text-[12px] font-medium mb-3 ml-1">Sleep Hours (per night)</Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {SLEEP_OPTIONS.map((s) => {
                    const isSelected = sleep === s;
                    return (
                      <TouchableOpacity
                        key={s}
                        onPress={() => setSleep(s)}
                        style={{
                          flex: 1,
                          paddingVertical: 14,
                          borderRadius: 14,
                          backgroundColor: isSelected ? "#6C63FF" : "#1A1A35",
                          borderWidth: 1,
                          borderColor: isSelected ? "#6C63FF" : "#252545",
                          alignItems: "center",
                        }}
                      >
                        <MaterialCommunityIcons name="moon-waning-crescent" size={16} color={isSelected ? "#fff" : "#9090B8"} />
                        <Text style={{ color: isSelected ? "#fff" : "#9090B8", fontSize: 14, fontWeight: isSelected ? "700" : "400", marginTop: 4 }}>{s}h</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
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