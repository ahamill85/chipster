import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

const VerticalRule = () => (
  <View
    style={{
      width: StyleSheet.hairlineWidth,
      backgroundColor: useThemeColor({}, "tint"),
    }}
  />
);

export default Stats = ({currentHand, currentRound, potAmount}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 20,
        gap: 10,
      }}
    >
      <View
        style={{
          flex: 3,
          alignItems: "center",
          gap: 10,
          justifyContent: "flex-end",
        }}
      >
        <ThemedText
          style={{
            fontSize: 80,
            lineHeight: 80,
          }}
        >
          {currentRound + 1}
        </ThemedText>
        <ThemedText>Round</ThemedText>
      </View>
      <VerticalRule />
      <View
        style={{
          flex: 6,
          alignItems: "center",
          gap: 10,
          justifyContent: "flex-end",
        }}
      >
        <ThemedText
          style={{
            fontSize: 80,
            lineHeight: 80,
          }}
        >
          {potAmount}
        </ThemedText>
        <ThemedText>Pot</ThemedText>
      </View>
      <VerticalRule />
      <View
        style={{
          flex: 3,
          alignItems: "center",
          gap: 10,
          justifyContent: "flex-end",
        }}
      >
        <ThemedText
          style={{
            fontSize: 80,
            lineHeight: 80,
          }}
        >
          {currentHand}
        </ThemedText>
        <ThemedText>Hand</ThemedText>
      </View>
    </View>
  );
};
