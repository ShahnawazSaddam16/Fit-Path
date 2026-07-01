import { useState } from "react";
import { View, ScrollView, Pressable, Modal, StatusBar, Switch } from "react-native";
import { Colors, FontSizes, FontWeights, Spacing, Radius, Shadows } from "../theme/ColorScheme";
import { useFontScale } from "../theme/FontScaleContext";
import ScaledText from "../theme/ScaledText";
import Topbar from "../components/App-Shell/Topbar";

const Text = ScaledText;

export default function SettingScreen() {
  const { largeFontEnabled, setLargeFontEnabled } = useFontScale();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType(null);
  };

  const handleConfirm = () => {
    closeModal();
  };

  const toggleLargeFont = (value) => {
    setLargeFontEnabled(value);
  };

  return (
    <>
      <View className="flex-1" style={{ backgroundColor: Colors.bg }}>
        <StatusBar barStyle="light-content" />
        <Topbar />

        <View className="px-5 pt-4 pb-2">
          <Text
            style={{
              color: Colors.textPrimary,
              fontSize: FontSizes.xxl,
              fontWeight: FontWeights.bold,
            }}
          >
            Settings
          </Text>
          <Text
            className="mt-1"
            style={{
              color: Colors.textMuted,
              fontSize: FontSizes.sm,
              fontWeight: FontWeights.regular,
            }}
          >
            Manage your preferences and account
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: Spacing.xxl }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            className="mt-6 mb-3"
            style={{
              color: Colors.textSecondary,
              fontSize: FontSizes.sm,
              fontWeight: FontWeights.semibold,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            Appearance
          </Text>

          <View
            className="rounded-2xl p-4 mb-6"
            style={{
              backgroundColor: Colors.card,
              borderWidth: 1,
              borderColor: Colors.cardBorder,
              borderRadius: Radius.lg,
              ...Shadows.card,
            }}
          >
            <View
              className="flex-row items-center justify-between py-2 px-4"
              style={{
                borderRadius: Radius.md,
                backgroundColor: largeFontEnabled ? Colors.purple : Colors.surface,
                borderWidth: 1,
                borderColor: largeFontEnabled ? Colors.purple : Colors.cardBorder,
                ...(largeFontEnabled ? Shadows.purple : {}),
              }}
            >
              <View className="flex-row items-center flex-1" style={{ gap: Spacing.sm }}>
                <View
                  className="items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: Radius.full,
                    backgroundColor: largeFontEnabled ? "rgba(255,255,255,0.15)" : "rgba(108,99,255,0.15)",
                  }}
                >
                  <Text style={{ fontSize: FontSizes.md }}>🔤</Text>
                </View>

                <View className="flex-1">
                  <Text
                    style={{
                      color: largeFontEnabled ? Colors.white : Colors.textPrimary,
                      fontSize: FontSizes.sm,
                      fontWeight: FontWeights.semibold,
                    }}
                  >
                    Large Fonts
                  </Text>
                  <Text
                    style={{
                      color: largeFontEnabled ? "rgba(255,255,255,0.8)" : Colors.textMuted,
                      fontSize: FontSizes.xs,
                    }}
                  >
                    {largeFontEnabled ? "Text size is enlarged" : "Using default text size"}
                  </Text>
                </View>
              </View>

              <Switch
                value={largeFontEnabled}
                onValueChange={toggleLargeFont}
                trackColor={{ false: Colors.cardBorder, true: "rgba(255,255,255,0.35)" }}
                thumbColor={largeFontEnabled ? Colors.white : Colors.textMuted}
                ios_backgroundColor={Colors.cardBorder}
              />
            </View>
          </View>

          <Text
            className="mb-3"
            style={{
              color: Colors.textSecondary,
              fontSize: FontSizes.sm,
              fontWeight: FontWeights.semibold,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            About
          </Text>

          <View
            className="rounded-2xl p-4 mb-6 flex-row items-center justify-between"
            style={{
              backgroundColor: Colors.card,
              borderWidth: 1,
              borderColor: Colors.cardBorder,
              borderRadius: Radius.lg,
              ...Shadows.card,
            }}
          >
            <Text
              style={{
                color: Colors.textPrimary,
                fontSize: FontSizes.md,
                fontWeight: FontWeights.medium,
              }}
            >
              App Version
            </Text>
            <Text
              style={{
                color: Colors.textMuted,
                fontSize: FontSizes.sm,
                fontWeight: FontWeights.regular,
              }}
            >
              1.0.0
            </Text>
          </View>

          <Text
            className="mb-3"
            style={{
              color: Colors.danger,
              fontSize: FontSizes.sm,
              fontWeight: FontWeights.semibold,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            Danger Zone
          </Text>

          <View
            className="rounded-2xl p-2 mb-6"
            style={{
              backgroundColor: Colors.card,
              borderWidth: 1,
              borderColor: Colors.coral,
              borderRadius: Radius.lg,
              ...Shadows.card,
            }}
          >
            <Pressable
              onPress={() => openModal("logout")}
              className="p-4"
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.cardBorder,
              }}
            >
              <Text
                style={{
                  color: Colors.textPrimary,
                  fontSize: FontSizes.md,
                  fontWeight: FontWeights.semibold,
                }}
              >
                Log Out
              </Text>
              <Text
                className="mt-1"
                style={{
                  color: Colors.textMuted,
                  fontSize: FontSizes.xs,
                }}
              >
                Sign out of your current session
              </Text>
            </Pressable>

            <Pressable onPress={() => openModal("delete")} className="p-4">
              <Text
                style={{
                  color: Colors.coral,
                  fontSize: FontSizes.md,
                  fontWeight: FontWeights.semibold,
                }}
              >
                Delete Account
              </Text>
              <Text
                className="mt-1"
                style={{
                  color: Colors.textMuted,
                  fontSize: FontSizes.xs,
                }}
              >
                Permanently remove your account and data
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: "rgba(13,13,26,0.85)" }}
        >
          <View
            className="w-full p-6"
            style={{
              backgroundColor: Colors.surface,
              borderRadius: Radius.xl,
              borderWidth: 1,
              borderColor: Colors.cardBorder,
              ...Shadows.purple,
            }}
          >
            <View
              className="items-center justify-center mb-4 self-center"
              style={{
                width: 56,
                height: 56,
                borderRadius: Radius.full,
                backgroundColor: modalType === "delete" ? "rgba(255,107,107,0.15)" : "rgba(108,99,255,0.15)",
              }}
            >
              <Text style={{ fontSize: FontSizes.xxl }}>
                {modalType === "delete" ? "⚠️" : "👋"}
              </Text>
            </View>

            <Text
              className="text-center mb-2"
              style={{
                color: Colors.textPrimary,
                fontSize: FontSizes.xl,
                fontWeight: FontWeights.bold,
              }}
            >
              {modalType === "delete" ? "Delete Account?" : "Log Out?"}
            </Text>

            <Text
              className="text-center mb-6"
              style={{
                color: Colors.textSecondary,
                fontSize: FontSizes.sm,
                lineHeight: 20,
              }}
            >
              {modalType === "delete"
                ? "This action is permanent and cannot be undone. All your data will be erased."
                : "You will need to sign in again to access your account."}
            </Text>

            <View className="flex-row" style={{ gap: Spacing.md }}>
              <Pressable
                onPress={closeModal}
                className="flex-1 items-center justify-center py-3"
                style={{
                  borderRadius: Radius.md,
                  backgroundColor: Colors.card,
                  borderWidth: 1,
                  borderColor: Colors.cardBorder,
                }}
              >
                <Text
                  style={{
                    color: Colors.textPrimary,
                    fontSize: FontSizes.sm,
                    fontWeight: FontWeights.semibold,
                  }}
                >
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleConfirm}
                className="flex-1 items-center justify-center py-3"
                style={{
                  borderRadius: Radius.md,
                  backgroundColor: modalType === "delete" ? Colors.coral : Colors.purple,
                }}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: FontSizes.sm,
                    fontWeight: FontWeights.semibold,
                  }}
                >
                  {modalType === "delete" ? "Delete" : "Log Out"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}