import {
  View,
  Modal,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { ThemedView } from "./ThemedView";

export default ThemedModal = ({ children, style, ...rest }) => {
  return (
    <Modal {...rest}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.3)",
          paddingHorizontal: 20,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={20}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
            <ThemedView
              style={[{
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
              }, {...style}]}
            >
              {children}
            </ThemedView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};
