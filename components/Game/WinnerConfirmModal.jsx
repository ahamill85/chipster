import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";

import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";
import ThemedModal from "../ThemedModal";
import { useHeaderHeight } from "@react-navigation/elements";

export default WinnerConfirmModal = ({
  player,
  handleCancel,
  handleConfirm,
  ...rest
}) => {

    const headerHeight = useHeaderHeight();
  

  return (
    <ThemedModal {...rest}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={headerHeight + 40}>
        <View style={{gap: 20}}>
          <ThemedText type="subtitle" style={{textAlign: "center"}}>{`Confirm ${player?.name} won the the hand.`}</ThemedText>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <ThemedButton type="danger" style={{flex: 1}} onPress={handleCancel}>Cancel</ThemedButton>
            <ThemedButton style={{flex: 1}} onPress={handleConfirm}>Confirm</ThemedButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ThemedModal>
  );
};
