import { View, Text, ScrollView, Image, TextInput, Pressable, Animated, ActivityIndicator, Modal } from "react-native";
import { Colors, FontSizes, FontWeights, Spacing, Shadows } from "../../theme/ColorScheme";
import { useEffect, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://192.168.100.77:5009";

const SPORT_OPTIONS = ["Football", "Cricket", "Basketball", "Tennis", "Gym", "Running", "Swimming", "Cycling"];

const FieldInput = ({ icon, label, value, onChangeText, keyboardType, unit }) => (
    <View className="mb-4">
        <Text style={{ color: Colors.textSecondary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, marginBottom: Spacing.sm }}>
            {label}
        </Text>
        <View
            className="flex-row items-center rounded-2xl px-4"
            style={{ backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder }}
        >
            <Ionicons name={icon} size={18} color={Colors.purple} />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType || "default"}
                placeholder={`Enter ${label.toLowerCase()}`}
                placeholderTextColor={Colors.textMuted}
                className="flex-1 py-4 px-3"
                style={{ color: Colors.textPrimary, fontSize: FontSizes.md }}
            />
            {unit ? (
                <Text style={{ color: Colors.textMuted, fontSize: FontSizes.sm }}>{unit}</Text>
            ) : null}
        </View>
    </View>
);

export default function EditProfile({ visible, profile, onClose, onSaved }) {
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [sleep, setSleep] = useState("");
    const [selectedSports, setSelectedSports] = useState([]);
    const [newImage, setNewImage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;

    // Populate the form fields every time the modal opens with the latest profile.
    useEffect(() => {
        if (!visible) return;

        if (profile) {
            setAge(profile?.age !== undefined && profile?.age !== null ? String(profile.age) : "");
            setWeight(profile?.weight !== undefined && profile?.weight !== null ? String(profile.weight) : "");
            setHeight(profile?.height !== undefined && profile?.height !== null ? String(profile.height) : "");
            setSleep(profile?.sleep !== undefined && profile?.sleep !== null ? String(profile.sleep) : "");
            setSelectedSports(
                Array.isArray(profile?.sports)
                    ? profile.sports
                    : typeof profile?.sports === "string" && profile.sports.length > 0
                    ? profile.sports.split(",").map((s) => s.trim())
                    : []
            );
        }

        setNewImage(null);
        setError("");

        fadeAnim.setValue(0);
        slideAnim.setValue(24);
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 60, useNativeDriver: true }),
        ]).start();
        // Re-run whenever the modal is opened or the underlying profile object changes
        // (profile.userId is a stable identity check, but we also want this to react
        // to a brand-new profile object being passed in after a save/refresh).
    }, [visible, profile]);

    const toggleSport = (sport) => {
        setSelectedSports((prev) =>
            prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
        );
    };

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            setError("Permission to access gallery is required");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setNewImage(result.assets[0]);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");

            if (!age || !weight || !height || !sleep || selectedSports.length === 0) {
                setError("Please fill all fields and select at least one sport");
                setSaving(false);
                return;
            }

            const token = await SecureStore.getItemAsync("token");
            if (!token) {
                setError("No session found, please login again");
                setSaving(false);
                return;
            }

            const formData = new FormData();
            formData.append("age", age);
            formData.append("weight", weight);
            formData.append("height", height);
            formData.append("sleep", sleep);
            formData.append("sports", selectedSports.join(","));

            if (newImage) {
                // NOTE: previously this object had two "type" keys
                // ("image/jpeg" then "image/png") which silently collided.
                // Derive a single correct mime type/extension from the picked asset.
                const uriParts = newImage.uri.split(".");
                const fileExt = uriParts[uriParts.length - 1]?.toLowerCase() || "jpg";
                const mimeType = fileExt === "png" ? "image/png" : "image/jpeg";

                formData.append("image", {
                    uri: newImage.uri,
                    name: `profile.${fileExt}`,
                    type: mimeType,
                });
            }

            const res = await fetch(`${API_URL}/api/edit-profile`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to update profile");
            }

            // Don't fully trust the PUT response body to contain the complete,
            // fresh profile (some backends return partial objects). Let the
            // parent re-fetch from the server so the UI always reflects what
            // is actually persisted.
            onSaved?.(data.userprofile);
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    const imageUri = newImage?.uri
        ? newImage.uri
        : profile?.userId
        ? `${API_URL}/api/profile-image/${profile.userId}`
        : null;

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <ScrollView
                className="flex-1"
                style={{ backgroundColor: Colors.bg }}
                contentContainerStyle={{ paddingBottom: Spacing.xxl }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                        paddingTop: Spacing.xxl,
                        paddingHorizontal: Spacing.lg,
                    }}
                >
                    <View className="flex-row items-center justify-between mb-6">
                        <Text style={{ color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: FontWeights.bold }}>
                            Edit Profile
                        </Text>
                        <Pressable
                            onPress={onClose}
                            className="w-9 h-9 rounded-full items-center justify-center"
                            style={{ backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder }}
                        >
                            <Ionicons name="close" size={18} color={Colors.textSecondary} />
                        </Pressable>
                    </View>

                    <View className="items-center mb-6">
                        <Pressable onPress={pickImage}>
                            <View
                                className="w-28 h-28 rounded-full items-center justify-center overflow-hidden"
                                style={{ backgroundColor: Colors.card, borderWidth: 2, borderColor: Colors.teal, ...Shadows.teal }}
                            >
                                {imageUri ? (
                                    <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
                                ) : (
                                    <Ionicons name="person" size={48} color={Colors.textMuted} />
                                )}
                            </View>
                            <View
                                className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center"
                                style={{ backgroundColor: Colors.teal, borderWidth: 2, borderColor: Colors.bg }}
                            >
                                <Ionicons name="camera" size={14} color={Colors.white} />
                            </View>
                        </Pressable>
                        <Text style={{ color: Colors.textMuted, fontSize: FontSizes.xs, marginTop: Spacing.sm }}>
                            Tap to change photo
                        </Text>
                    </View>

                    <FieldInput icon="calendar-outline" label="Age" value={age} onChangeText={setAge} keyboardType="numeric" unit="yrs" />
                    <FieldInput icon="barbell-outline" label="Weight" value={weight} onChangeText={setWeight} keyboardType="numeric" unit="kg" />
                    <FieldInput icon="resize-outline" label="Height" value={height} onChangeText={setHeight} keyboardType="numeric" unit="cm" />
                    <FieldInput icon="moon-outline" label="Sleep" value={sleep} onChangeText={setSleep} keyboardType="numeric" unit="hrs" />

                    <View className="mb-6">
                        <Text style={{ color: Colors.textSecondary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, marginBottom: Spacing.sm }}>
                            Sports
                        </Text>
                        <View className="flex-row flex-wrap">
                            {SPORT_OPTIONS.map((sport) => {
                                const active = selectedSports.includes(sport);
                                return (
                                    <Pressable
                                        key={sport}
                                        onPress={() => toggleSport(sport)}
                                        className="px-4 py-2 rounded-full mr-2 mb-2"
                                        style={{
                                            backgroundColor: active ? Colors.purple : Colors.surface,
                                            borderWidth: 1,
                                            borderColor: Colors.purple,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: active ? Colors.white : Colors.purple,
                                                fontSize: FontSizes.sm,
                                                fontWeight: FontWeights.semibold,
                                            }}
                                        >
                                            {sport}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {error ? (
                        <Text style={{ color: Colors.danger, fontSize: FontSizes.sm, marginBottom: Spacing.md, textAlign: "center" }}>
                            {error}
                        </Text>
                    ) : null}

                    <Pressable
                        onPress={handleSave}
                        disabled={saving}
                        className="flex-row items-center justify-center py-4 rounded-2xl mb-3"
                        style={{ backgroundColor: Colors.teal, ...Shadows.teal, opacity: saving ? 0.7 : 1 }}
                    >
                        {saving ? (
                            <ActivityIndicator color={Colors.white} />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle-outline" size={18} color={Colors.white} />
                                <Text style={{ color: Colors.white, fontWeight: FontWeights.semibold, fontSize: FontSizes.md, marginLeft: Spacing.sm }}>
                                    Save Changes
                                </Text>
                            </>
                        )}
                    </Pressable>

                    <Pressable onPress={onClose} className="items-center py-3">
                        <Text style={{ color: Colors.textSecondary, fontSize: FontSizes.sm }}>Cancel</Text>
                    </Pressable>
                </Animated.View>
            </ScrollView>
        </Modal>
    );
}