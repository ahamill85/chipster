import { TouchableOpacity, View } from "react-native";
import ThemedModal from "../ThemedModal";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { ThemedView } from "../ThemedView";

export default InGameMenu = ({
  navigation,
  handleDismiss,
  handleUndo,
  handleRedo,
  handleReset,
  disableUndo,
  disableRedo,
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
        >
          Reset Game
        </ThemedButton>
        <ThemedButton
          onPress={() => {
            handleDismiss();
            navigation.navigate("options", { inGame: true });
          }}
        >
          Change Rules
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
