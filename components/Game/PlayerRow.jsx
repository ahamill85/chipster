import React, { useEffect } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Avatar from "../Avatar";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default PlayerRow = ({
  player: { avatar, name, balance, isDealer, status, bets },
  isTurn,
  isLast,
  promptWinner,
  currentRound,
  ...rest
}) => {
  const disabled = status === "fold" || status === "out";
  const shouldPrompt = !disabled && promptWinner;

  const background = useThemeColor({}, "buttonBackground");
  const color = useThemeColor({}, shouldPrompt ? "buttonText" : "text");
  const highlight = useThemeColor({}, "highlight");
  const rules = useThemeColor({}, "rules");

  const currentBet = bets.reduce((round, total) => total + round, 0);

  const rowOpacity = () => {
    if (status === "fold") return 0.4;
    if (status === "out") return 0.1;
    return 1;
  };

  const balanceText = () => {
    if (status === "out") return "OUT";
    if (status === "fold") return "FOLD";
    if (balance === 0) return "ALL IN";
    return balance;
  };

  const rowBackground = useSharedValue("transparent");

  const backgroundTransition = useAnimatedStyle(() => ({
    backgroundColor: rowBackground.value,
  }));

  useEffect(() => {
    rowBackground.value = withTiming(isTurn ? highlight : "transparent");
  }, [isTurn]);

  if (disabled && promptWinner) return <></>;

  //console.log(name, '---', status);

  return (
    <>
      <TouchableOpacity
        style={{
          opacity: rowOpacity(),
        }}
        disabled={disabled || !shouldPrompt}
        {...rest}
      >
        <Animated.View style={backgroundTransition}>
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
            <Avatar
              name={name}
              size={50}
              source={avatar}
              color={color}
              //style={{ borderWidth: 5, borderColor: color }}
            />
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
        </Animated.View>
      </TouchableOpacity>
      <View
        style={{
          height: StyleSheet.hairlineWidth,
          backgroundColor: rules,
          opacity: isLast || promptWinner ? 0 : 1,
        }}
      />
    </>
  );
};
