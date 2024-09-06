import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Avatar from "../Avatar";

export default PlayerRow = ({
  player: { avatar, name, balance, isDealer, status, currentBet },
  isTurn,
  isLast,
  promptWinner,
  ...rest
}) => {
  const disabled = status === "fold" || status === "out";
  const shouldPrompt = !disabled && promptWinner 

  const background = useThemeColor({}, "buttonBackground");
  const color = useThemeColor({}, shouldPrompt ? "buttonText" : "text");
  const highlight = useThemeColor({}, "highlight");  

  const balanceText = () => {
    if (status === "out") {
      return "OUT";
    } else if (balance === 0) {
      return "ALL IN";
    } else {
      return balance;
    }
  };

  return (
    <>
      <TouchableOpacity
        style={{
          opacity: disabled ? 0.3 : 1,
          backgroundColor: isTurn ? highlight : "transparent",
        }}
        disabled={disabled || !shouldPrompt}
        {...rest}
      >
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 10,
            gap: 20,
            paddingHorizontal: 15,
            marginVertical: 5,
            marginHorizontal: 5,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: shouldPrompt ? background : "transparent",
          }}
        >
          <Avatar size={30} source={avatar} color={color} />
          <View style={{ flex: 1, flexDirection: "row" }}>
            <ThemedText type="default" style={{ color }}>
              {name}
            </ThemedText>
            {isDealer && (
              <MaterialCommunityIcons
                name="cards"
                size={20}
                style={{
                  marginLeft: 10,
                  color,
                }}
              />
            )}
          </View>
          <ThemedText type="defaultSemiBold" style={{ width: 50, color }}>
            {currentBet}
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={{ width: 60, color }}>
            {balanceText()}
          </ThemedText>
        </View>
      </TouchableOpacity>
      {!isLast && (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: useThemeColor({}, "tint"),
          }}
        />
      )}
    </>
  );
};
