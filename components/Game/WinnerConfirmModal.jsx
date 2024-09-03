import React from "react";
import { StyleSheet, View, Modal } from "react-native";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { ThemedButton } from "../ThemedButton";

export default WinnerConfirmModal = ({
  player,
  handleCancel,
  handleConfirm,
  ...rest
}) => {
  return (
    <Modal {...rest}>
      <View style={styles.backdrop}>
        <ThemedView style={styles.modal}>
          <ThemedText type="subtitle">{`Did ${player?.name} win this hand?`}</ThemedText>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <ThemedButton onPress={handleCancel}>Cancel</ThemedButton>
            <ThemedButton onPress={handleConfirm}>Confirm</ThemedButton>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
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
