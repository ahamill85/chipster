import React, { useEffect, useState } from "react";
import { View, KeyboardAvoidingView, Platform, Keyboard } from "react-native";

import { ThemedText } from "../ThemedText";

import { ThemedButton } from "../ThemedButton";
import { TextInput } from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default BettingControls = ({
  activePlayerBalance,
  callAmount,
  handleBet,
  promptWinnerSelection,
  maxRaiseReached,
  activePlayerIndex,
  increment,
  potAmount,
  ...rest
}) => {
  const { limitType, smallBlind, bigBlind, ante } = useSelector(
    (state) => state.options
  );

  const [betAmount, setBetAmount] = useState(null);

  const headerHeight = useHeaderHeight();

  const BetText = (betAmount, callAmount) => {
    if (betAmount === callAmount) return "call";
    if (betAmount > callAmount) return `raise (${betAmount - callAmount})`;
    return "bet";
  };

  useEffect(() => {
    setBetAmount(callAmount);
  }, [callAmount]);

  const limit = () => {
    let limit = activePlayerBalance;

    switch (limitType) {
      case "fixed":
        limit = bigBlind;
      case "pot":
        limit = callAmount + potAmount;
    }

    return limit > activePlayerBalance ? activePlayerBalance : limit;
  };

  console.log(limit())

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={headerHeight + 40}
      {...rest}
    >
      <View
        style={{
          padding: 20,
          gap: 20,
          opacity: promptWinnerSelection ? 0.2 : 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <ThemedButton
            type="circle"
            disabled={betAmount === callAmount}
            style={{ opacity: betAmount === callAmount ? 0.5 : 1 }}
            onPress={() => {
              setBetAmount(callAmount);
            }}
          >
            MIN
          </ThemedButton>
          <ThemedButton
            type="circle"
            onPress={() => setBetAmount((count) => count - increment)}
            style={{ opacity: betAmount <= callAmount ? 0.5 : 1 }}
            disabled={betAmount <= callAmount}
          >
            <FontAwesome6
              name="minus"
              color={useThemeColor({}, "buttonText")}
              size={20}
            />
          </ThemedButton>
          <TextInput
            style={{
              flexGrow: 1,
              color: useThemeColor({}, "text"),
              fontSize: 40,
              textAlign: "center",
              minWidth: 0,
            }}
            keyboardType="numeric"
            value={`${betAmount}`}
            textAlign="center"
            onChangeText={(text) => {
              let newText = parseInt(text.replace(/[^0-9]/, ""));

              if (!text) newText = 0;
              if (newText > limit()) newText = limit();

              newText = Math.floor(newText / increment) * increment;

              setBetAmount(newText);
            }}
            textContentType="none"
            maxLength={3}
            inputMode="numeric"
          />
          <ThemedButton
            type="circle"
            style={{
              opacity: maxRaiseReached || betAmount >= limit() ? 0.5 : 1,
            }}
            disabled={maxRaiseReached || betAmount >= limit()}
            onPress={(event) =>
              setBetAmount((count) => {
                return count + increment;
              })
            }
          >
            <FontAwesome6
              name="plus"
              color={useThemeColor({}, "buttonText")}
              size={20}
            />
          </ThemedButton>
          <ThemedButton
            disabled={betAmount === limit()}
            style={{
              opacity: betAmount === limit() ? 0.5 : 1,
            }}
            type="circle"
            onPress={() => {
              setBetAmount(limit());
            }}
          >
            MAX
          </ThemedButton>
        </View>
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: "row" }}>
            <ThemedButton
              style={{
                flex: 1,
                opacity:
                  betAmount < callAmount || (!callAmount && !betAmount)
                    ? 0.5
                    : 1,
              }}
              onPress={() => handleBet("bet", betAmount)}
              disabled={betAmount < callAmount || (!callAmount && !betAmount)}
            >
              {BetText(betAmount, callAmount).toUpperCase()}
            </ThemedButton>
          </View>
          <View style={{ flexDirection: "row" }}>
            {callAmount ? (
              <ThemedButton
                type="danger"
                style={{
                  flex: 1,
                }}
                onPress={() => handleBet("fold", 0)}
              >
                FOLD
              </ThemedButton>
            ) : (
              <ThemedButton
                disabled={betAmount > callAmount}
                style={{
                  flex: 1,
                  opacity: betAmount > callAmount ? 0.5 : 1,
                }}
                onPress={() => handleBet("check", betAmount)}
              >
                CHECK
              </ThemedButton>
            )}
          </View>
        </View>
      </View>
      {promptWinnerSelection && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemedText
            style={{ fontSize: 40, lineHeight: 40, textAlign: "center" }}
          >
            Select Winner
          </ThemedText>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
