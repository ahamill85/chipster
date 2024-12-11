import { TouchableOpacity, View } from "react-native";
import ThemedModal from "../ThemedModal";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { ThemedView } from "../ThemedView";

export default InGameMenu = ({ navigation, handleDismiss, handleReset, ...rest }) => {
  return (
    <ThemedModal {...rest}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
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
        <ThemedButton
          icon={
            <FontAwesome6
              name="arrow-rotate-left"
              size={22}
              style={{ color: useThemeColor({}, "buttonText") }}
            />
          }
          onPress={handleReset}
        >
          Reset Current Hand
        </ThemedButton>
        <ThemedButton
          onPress={() => {
            handleDismiss();
            navigation.navigate("options");
          }}
        >
          Update Options
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
