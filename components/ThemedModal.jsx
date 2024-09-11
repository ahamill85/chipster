import {
  View,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { ThemedView } from "./ThemedView";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default ThemedModal = ({ children, style, ...rest }) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal {...rest}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "flex-end",
            paddingTop: insets.top,
          }}
        >
          <ThemedView
            style={[
              {
                padding: 20,
                paddingBottom: insets.bottom,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                gap: 20,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
              },
              { ...style },
            ]}
          >
            {children}
          </ThemedView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
