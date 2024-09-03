import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

export default PlayerRow = ({ player, isTurn, isDealer, isLast, ...rest }) => {
  const color = useThemeColor({}, "buttonBackground");

  return (
    <>
      <TouchableOpacity
        style={{ opacity: player.folded ? 0.5 : 1 }}
        {...rest}
      >
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 15,
            gap: 10,
          }}
        >
          <View
            style={{
              width: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isTurn && <FontAwesome name="star" size={20} style={{ color }} />}
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <ThemedText type="subtitle">{player.name}</ThemedText>
            {isDealer && (
              <FontAwesome6
                name="crown"
                size={20}
                style={{
                  marginLeft: 10,
                  color,
                }}
              />
            )}
          </View>
          <ThemedText type="defaultSemiBold" style={{ width: 60 }}>
            {player.currentBet}
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={{ width: 60 }}>
            {player.balance}
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

const styles = StyleSheet.create({
  playerRow: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    columnGap: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 0,
    flexBasis: 40,
  },
  itemLabel: {
    opacity: 0.5,
  },
  position: {},
  name: {
    flex: 1,
  },
  balance: {
    width: 100,
    flex: 0,
  },
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  inputRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "flex-start",
    columnGap: 16,
    height: 60,
  },
  input: {
    height: "100%",
    backgroundColor: "#fff",
    color: "#000",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 20,
    flex: 1,
    width: "100%",
    fontSize: 20,
  },
});
