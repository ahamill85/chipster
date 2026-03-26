import { TouchableOpacity, View } from "react-native";
import ThemedModal from "../ThemedModal";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { ThemedView } from "../ThemedView";
import { useEffect } from "react";

export default InGameMenu = ({
  navigation,
  handleDismiss,
  handleUndo,
  handleRedo,
  handleReset,
  disableUndo,
  disableRedo,
  disableReset,
  activeHand,
  ...rest
}) => {

  return (
    <ThemedModal {...rest}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 30,
        }}
      >
        <ThemedText type="subtitle">Options</ThemedText>
        <TouchableOpacity onPress={() => handleDismiss()}>
          <FontAwesome5
            name="times"
            size={30}
            style={{ color: useThemeColor({}, "tint1") }}
          />
        </TouchableOpacity>
      </View>
      <ThemedView style={{ gap: 20 }}>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <ThemedButton
            disabled={disableUndo}
            icon={
              <FontAwesome6
                name="arrow-rotate-left"
                size={22}
                style={{ color: useThemeColor({}, "buttonText") }}
              />
            }
            onPress={handleUndo}
            style={{ opacity: disableUndo ? 0.5 : 1, flex: 1 }}
          >
            Undo Hand
          </ThemedButton>
          <ThemedButton
            disabled={disableRedo}
            icon={
              <FontAwesome6
                name="arrow-rotate-right"
                size={22}
                style={{ color: useThemeColor({}, "buttonText") }}
              />
            }
            iconPosition="right"
            onPress={handleRedo}
            style={{ opacity: disableRedo ? 0.5 : 1, flex: 1 }}
          >
            Redo Hand
          </ThemedButton>
        </View>
        <ThemedButton
          onPress={handleReset}
          disableReset={disableReset}
          style={{ opacity: disableReset ? 0.5 : 1 }}
        >
          Reset Game
        </ThemedButton>
        <ThemedButton
          disabled={activeHand}
          style={{ opacity: activeHand ? 0.5 : 1 }}
          onPress={() => {
            handleDismiss();
            navigation.navigate("options", { inGame: true });
          }}
        >
          Edit Rules
        </ThemedButton>
        <ThemedButton
          disabled={activeHand}
          style={{ opacity: activeHand ? 0.5 : 1 }}
          onPress={() => {
            handleDismiss();
            navigation.navigate("players", { inGame: true });
          }}
        >
          Edit Players
        </ThemedButton>
        <ThemedButton
          type="danger"
          onPress={() => {
            handleDismiss();
            navigation.navigate("welcome");
          }}
        >
          Exit Game
        </ThemedButton>
      </ThemedView>
    </ThemedModal>
  );
};
