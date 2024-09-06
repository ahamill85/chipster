import { View, Modal, StyleSheet } from "react-native";

import { ThemedView } from "./ThemedView";

export default ThemedModal = ({ children, ...rest }, ) => {
  return (
    <Modal {...rest}>
      <View style={styles.backdrop}>
        <ThemedView style={styles.modal}>{children}</ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 20,
  },
  modal: {
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
  },
});
