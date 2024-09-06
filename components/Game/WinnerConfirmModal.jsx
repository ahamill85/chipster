import React from "react";
import { View } from "react-native";

import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";
import ThemedModal from "../ThemedModal";

export default WinnerConfirmModal = ({
  player,
  handleCancel,
  handleConfirm,
  ...rest
}) => {
  return (
    <ThemedModal {...rest}>
      <View style={{gap: 20}}>
        <ThemedText type="subtitle">{`Did ${player?.name} win this hand?`}</ThemedText>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <ThemedButton type="danger" style={{flex: 1}} onPress={handleCancel}>Cancel</ThemedButton>
          <ThemedButton style={{flex: 1}} onPress={handleConfirm}>Confirm</ThemedButton>
        </View>
      </View>
    </ThemedModal>
  );
};
