import { View, ScrollView, Image, ActivityIndicator, Animated, Pressable } from "react-native";
import ScaledText from "../../theme/ScaledText";
const Text = ScaledText;
import { Colors, FontSizes, FontWeights, Spacing, Shadows } from "../../theme/ColorScheme";
import { useEffect, useRef, useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Topbar from "../../components/App-Shell/Topbar";
import EditProfile from "../../components/Profile/EditProfile";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://192.168.100.77:5009";

const StatCard = ({ icon, label, value, unit, color }) => (
    <View
        className="flex-1 rounded-2xl p-4 mx-1"
        style={{ backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder, ...Shadows.card }}
    >
        <View
            className="w-9 h-9 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: `${color}22` }}
        >
            <Ionicons name={icon} size={18} color={color} />
        </View>
        <Text style={{ color: Colors.textMuted, fontSize: FontSizes.xs, fontWeight: FontWeights.medium }}>
            {label}
        </Text>
        <Text style={{ color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: FontWeights.bold, marginTop: 2 }}>
            {value}
            <Text style={{ color: Colors.textSecondary, fontSize: FontSizes.xs }}> {unit}</Text>
        </Text>
    </View>
);

const SportChip = ({ label }) => (
    <View
        className="px-4 py-2 rounded-full mr-2 mb-2"
        style={{ backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.purple }}
    >
        <Text style={{ color: Colors.purple, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold }}>
            {label}
        </Text>
    </View>
);

export default function UserProfileScreen() {
    const navigation = useNavigation();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editVisible, setEditVisible] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;
    const scaleAnim = useRef(new Animated.Value(0.92)).current;

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    const animateIn = () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(24);
        scaleAnim.setValue(0.92);
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 60, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }),
        ]).start();
    };

    const fetchProfile = async ({ silent = false } = {}) => {
        try {
            if (!silent) setLoading(true);
            setError("");

            const token = await SecureStore.getItemAsync("token");
            if (!token) {
                setError("No session found, please login again");
                setLoading(false);
                return;
            }

            const res = await fetch(`${API_URL}/api/user-profile`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to fetch profile");
            }

            const data = await res.json();

            if (data.success && data.userprofile) {
                setProfile(data.userprofile);
                if (!silent) animateIn();
            } else {
                setError(data.message || "Profile not found");
            }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const sportsList = Array.isArray(profile?.sports)
        ? profile.sports
        : typeof profile?.sports === "string"
        ? profile.sports.split(",").map((s) => s.trim())
        : [];

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center" style={{ backgroundColor: Colors.bg }}>
                <ActivityIndicator size="large" color={Colors.purple} />
                <Text style={{ color: Colors.textSecondary, marginTop: Spacing.md, fontSize: FontSizes.sm }}>
                    Loading your profile
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: Colors.bg }}>
                <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-4"
                    style={{ backgroundColor: `${Colors.danger}22` }}
                >
                    <Ionicons name="alert-circle-outline" size={32} color={Colors.danger} />
                </View>
                <Text style={{ color: Colors.textPrimary, fontSize: FontSizes.md, fontWeight: FontWeights.semibold, textAlign: "center" }}>
                    {error}
                </Text>
                <Pressable
                    onPress={() => fetchProfile()}
                    className="mt-6 px-6 py-3 rounded-full"
                    style={{ backgroundColor: Colors.purple, ...Shadows.purple }}
                >
                    <Text style={{ color: Colors.white, fontWeight: FontWeights.semibold }}>Try Again</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("HomeScreen")} className="mt-4">
                    <Text style={{ color: Colors.textSecondary, fontSize: FontSizes.sm }}>Go back to HomeScreen</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View className="flex-1" style={{ backgroundColor: Colors.bg }}>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: Spacing.xxl }}
                showsVerticalScrollIndicator={false}
            >
                <Topbar />
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                        paddingTop: Spacing.xxl,
                        paddingHorizontal: Spacing.lg,
                    }}
                >
                    <View className="items-center mb-6">
                        <View
                            className="w-28 h-28 rounded-full items-center justify-center overflow-hidden"
                            style={{ backgroundColor: Colors.card, borderWidth: 2, borderColor: Colors.purple, ...Shadows.purple }}
                        >
                            {profile?.imageBase64 ? (
                                <Image source={{ uri: profile.imageBase64 }} className="w-full h-full" resizeMode="cover" />
                            ) : (
                                <Ionicons name="person" size={48} color={Colors.textMuted} />
                            )}
                        </View>
                        <Text style={{ color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: FontWeights.bold, marginTop: Spacing.md }}>
                            {profile?.email}
                        </Text>
                        <Text style={{ color: Colors.textMuted, fontSize: FontSizes.sm, marginTop: 2 }}>
                            Your Fitness Profile
                        </Text>
                    </View>

                    <View className="flex-row mb-3">
                        <StatCard icon="calendar-outline" label="AGE" value={profile?.age} unit="yrs" color={Colors.purple} />
                        <StatCard icon="barbell-outline" label="WEIGHT" value={profile?.weight} unit="kg" color={Colors.teal} />
                    </View>
                    <View className="flex-row mb-6">
                        <StatCard icon="resize-outline" label="HEIGHT" value={profile?.height} unit="cm" color={Colors.coral} />
                        <StatCard icon="moon-outline" label="SLEEP" value={profile?.sleep} unit="hrs" color={Colors.amber} />
                    </View>

                    <View
                        className="rounded-2xl p-4 mb-8"
                        style={{ backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder, ...Shadows.card }}
                    >
                        <Text style={{ color: Colors.textSecondary, fontSize: FontSizes.sm, fontWeight: FontWeights.semibold, marginBottom: Spacing.sm }}>
                            SPORTS
                        </Text>
                        <View className="flex-row flex-wrap">
                            {sportsList.length > 0 ? (
                                sportsList.map((sport, idx) => <SportChip key={idx} label={sport} />)
                            ) : (
                                <Text style={{ color: Colors.textMuted, fontSize: FontSizes.sm }}>No sports added</Text>
                            )}
                        </View>
                    </View>

                    <Pressable
                        onPress={() => setEditVisible(true)}
                        className="flex-row items-center justify-center py-4 rounded-2xl mb-3"
                        style={{ backgroundColor: Colors.teal, ...Shadows.teal }}
                    >
                        <Ionicons name="create-outline" size={18} color={Colors.white} />
                        <Text style={{ color: Colors.white, fontWeight: FontWeights.semibold, fontSize: FontSizes.md, marginLeft: Spacing.sm }}>
                            Edit Profile
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => navigation.navigate("HomeScreen")}
                        className="flex-row items-center justify-center py-4 rounded-2xl"
                        style={{ backgroundColor: Colors.purple, ...Shadows.purple }}
                    >
                        <Ionicons name="home-outline" size={18} color={Colors.white} />
                        <Text style={{ color: Colors.white, fontWeight: FontWeights.semibold, fontSize: FontSizes.md, marginLeft: Spacing.sm }}>
                            Go back to HomeScreen
                        </Text>
                    </Pressable>
                </Animated.View>
            </ScrollView>

            <EditProfile
                visible={editVisible}
                profile={profile}
                onClose={() => setEditVisible(false)}
                onSaved={async () => {
                    setEditVisible(false);
                    await fetchProfile({ silent: true });
                }}
            />
        </View>
    );
}