import { View, Text, TouchableOpacity } from "react-native";

export default function WelcomeProfile({ open, setOpen }) {
  if (!open) return null;

  return (
    <View className="absolute inset-0 bg-[#0D0D1A]/90 justify-center items-center z-[999] px-6">
      <View className="w-full bg-[#1A1A35] rounded-3xl border border-[#252545] p-8 items-center">

        <View className="relative w-20 h-20 items-center justify-center mb-4">
          <View className="w-20 h-20 rounded-full bg-[#13132B] border-2 border-[#6C63FF] items-center justify-center">
            <View className="w-14 h-14 rounded-full bg-[#6C63FF] items-center justify-center">
              <Text className="text-2xl">⚡</Text>
            </View>
          </View>
          <View className="absolute -bottom-0.5 -right-0.5 bg-[#00D4AA] rounded-full px-1.5 py-0.5">
            <Text className="text-[#0D0D1A] text-[10px] font-bold tracking-widest">FP</Text>
          </View>
        </View>

        <Text className="text-[#6C63FF] text-[22px] font-bold tracking-widest mb-1">
          Fit-Path
        </Text>
        <Text className="text-[#9090B8] text-[13px] text-center mb-4">
          Your personal journey to a stronger you
        </Text>

        <View className="w-2/5 h-px bg-[#252545] mb-4" />

        <Text className="text-[#F0F0FF] text-[17px] font-semibold text-center mb-2">
          Welcome aboard 👋
        </Text>
        <Text className="text-[#9090B8] text-[13px] text-center leading-5 mb-5">
          Before we map your path, let's set up your profile. We'll personalize
          your fitness journey based on your goals, level, and lifestyle.
        </Text>

        <View className="flex-row flex-wrap gap-2 justify-center mb-6">
          {["🏋️ Strength", "🧘 Flexibility", "🏃 Cardio"].map((label) => (
            <View
              key={label}
              className="bg-[#13132B] border border-[#252545] rounded-full px-3 py-1"
            >
              <Text className="text-[#9090B8] text-[11px] font-medium">{label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          className="w-full bg-[#6C63FF] rounded-2xl py-3.5 items-center"
          activeOpacity={0.85}
          onPress={() => setOpen(false)}
        >
          <Text className="text-white text-[15px] font-bold tracking-wide">
            Make Profile
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}