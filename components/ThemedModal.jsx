import {
  View,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";

import { ThemedView } from "./ThemedView";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default ThemedModal = ({
  children,
  transparent = true,
  animationType = "slide",
  style,
  visible,
  backdropDismiss = () => {},
  ...rest
}) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <Modal
        {...rest}
        visible={visible}
        transparent={transparent}
        animationType={animationType}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable style={{ flex: 1 }} onPress={backdropDismiss}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: insets.top + 20,
                paddingBottom: insets.bottom + 20,
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              <ThemedView
                style={[
                  {
                    padding: 20,
                    borderRadius: 20,
                    gap: 20,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    maxWidth: 600,
                    width: "100%",
                  },
                  { ...style },
                ]}
              >
                <Pressable style={style}>{children}</Pressable>
              </ThemedView>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};
