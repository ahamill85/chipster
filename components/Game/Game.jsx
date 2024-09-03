import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Alert,
} from "react-native";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

import { ThemedButton } from "../ThemedButton";
import { TextInput } from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSelector, useDispatch } from "react-redux";
import { newGame } from "@/features/slices/gameSlice";
import {
  updateActivePlayer,
  updateCallAmount,
  updatePotAmount,
  incrementcurrentRound,
} from "@/features/slices/handSlice";

import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { updatePlayer } from "@/features/slices/playersSlice";
import PlayerRow from "./PlayerRow";
import WinnerConfirmModal from "./WinnerConfirmModal";

const maxReraise = 1;
const maxRoundCount = 5;

const HorizontalRule = () => (
  <View
    style={{
      width: StyleSheet.hairlineWidth,
      backgroundColor: useThemeColor({}, "tint"),
    }}
  />
);

export default Game = () => {
  const players = useSelector((state) => state.players);
  const game = useSelector((state) => state.game);
  const hand = useSelector((state) => state.hand);

  const dispatch = useDispatch();

  const [betAmount, setBetAmount] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentHand, setCurrentHand] = useState(1);
  const [activePlayerIndex, setActivePlayerIndex] = useState(1);
  const [pacePlayerIndex, setPacePlayerIndex] = useState(null);
  const [potAmount, setPotAmount] = useState(0);

  const [winnerModalVisible, setWinnerModalVisible] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(null);

  const headerHeight = useHeaderHeight();

  const [bets, setBets] = useState([players.map(() => 0)]);
  const [reraise, setReraise] = useState(players.map(() => 0));

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const [promptWinner, setPromptWinner] = useState(false);

  const paceAmount = useMemo(() => Math.max(...bets[currentRound - 1]), [bets]);

  const callAmount = useMemo(() => {
    const currentBet = bets[currentRound - 1][activePlayerIndex];
    return paceAmount - currentBet;
  }, [activePlayerIndex]);

  const calculateWinnings = () => {
    console.log(bets);
  };

  const handleHandEnd = () => {
    calculateWinnings();

    dispatch(
      updatePlayer({
        ...players[winnerIndex],
        balance: (players[winnerIndex].balance += potAmount),
      })
    );
    console.log(`BOOM HAND WON BY ${players[winnerIndex].name}`);
    console.log(`bet array ${bets}`);

    dispatch(
      updatePlayer(
        //reset all folded status except those who are bankrupt
        players.map((player) =>
          player.balance ? { ...player, folded: false } : player
        )
      )
    );
    setPromptWinner(false);
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardWillShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardWillHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    setBetAmount(callAmount);
  }, [callAmount, activePlayerIndex]);

  useEffect(() => {
    console.log(activePlayerIndex === hand.startingPlayerIndex && !callAmount)

    if (activePlayerIndex === pacePlayerIndex ) {
      setBets((bets) => [...bets, players.map(() => 0)]);
      setPacePlayerIndex(null);
      setCurrentRound((round) => (round += 1));
      setReraise(players.map(() => 0));
    }

    //if all players but one have folded
    if (players.filter(({ folded }) => !folded).length === 1) handleHandEnd();

    //if all players have gone all-in prompt for winner selection
    if (
      players.filter(({ balance, folded }) => !!balance && !folded).length === 0
    )
      setPromptWinner(true);


  }, [activePlayerIndex]);

  const handleBet = (type) => {
    Keyboard.dismiss();

    if (type === "fold") {
      dispatch(updatePlayer({ index: activePlayerIndex, folded: true }));
    } else {
      setBets((bets) => {
        bets[currentRound - 1][activePlayerIndex] += betAmount;
        return [...bets];
      });

      setPotAmount((amount) => (amount += betAmount));

      if (betAmount > callAmount) {
        setReraise((state) => {
          state[activePlayerIndex] += 1;
          return [...state];
        });
        setPacePlayerIndex(activePlayerIndex);
      }

      dispatch(
        updatePlayer({
          index: activePlayerIndex,
          currentBet: players[activePlayerIndex].currentBet + betAmount,
          balance: players[activePlayerIndex].balance - betAmount,
        })
      );
    }

    setActivePlayerIndex((index) => {
      let nextIndex = null;

      for (var i = 0; i < players.length; i++) {
        var pointer =
          (i + index === players.length - 1 ? 0 : index + 1) % players.length;

        if (pointer === pacePlayerIndex) {
          nextIndex = hand.startingPlayerIndex;
          break;
        }

        if (!players[pointer].folded) {
          nextIndex = pointer;
          break;
        }
      }

      return nextIndex;
    });
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              columnGap: 10,
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <View style={{ width: 20 }}></View>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 12 }}>
                NAME
              </ThemedText>
            </View>
            <View style={{ width: 60 }}>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 12 }}>
                BET
              </ThemedText>
            </View>
            <View style={{ width: 60 }}>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 12 }}>
                BALANCE
              </ThemedText>
            </View>
          </View>
          <ScrollView
            style={{
              flex: 1,
              paddingHorizontal: 20,
              flexBasis: "auto",
              backgroundColor: useThemeColor({}, "background"),
              zIndex: 1,
            }}
          >
            {players.map((player, index) => (
              <PlayerRow
                disabled={player.folded || !promptWinner}
                isTurn={activePlayerIndex === index}
                player={player}
                key={player.id}
                isDealer={hand.dealerIndex === index}
                onPress={() => {
                  setWinnerIndex(index);
                  setWinnerModalVisible(true);
                }}
                isLast={index === players.length - 1}
              />
            ))}
          </ScrollView>
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
                {currentRound}
              </ThemedText>
              <ThemedText>Round</ThemedText>
            </View>
            <HorizontalRule />
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
            <HorizontalRule />
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
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={headerHeight + 40}
          >
            <View
              style={{ padding: 20, gap: 20, opacity: promptWinner ? 0.2 : 1 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 10,
                  // paddingVertical: 20,
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
                  onPress={() => setBetAmount((count) => count - 1)}
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
                    if (newText > players[activePlayerIndex].balance)
                      newText = players[activePlayerIndex].balance;

                    setBetAmount(newText);
                  }}
                  textContentType="none"
                  maxLength={3}
                  inputMode="numeric"
                />
                <ThemedButton
                  type="circle"
                  style={{
                    opacity:
                      reraise[activePlayerIndex] >= maxReraise ||
                      betAmount >= players[activePlayerIndex].balance
                        ? 0.5
                        : 1,
                  }}
                  disabled={
                    reraise[activePlayerIndex] >= maxReraise ||
                    betAmount >= players[activePlayerIndex].balance
                  }
                  onPress={(event) =>
                    setBetAmount((count) => {
                      return count + 1;
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
                  disabled={betAmount === players[activePlayerIndex].balance}
                  style={{
                    opacity:
                      betAmount === players[activePlayerIndex].balance
                        ? 0.5
                        : 1,
                  }}
                  type="circle"
                  onPress={() => {
                    setBetAmount(players[activePlayerIndex].balance);
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
                    onPress={() => handleBet("bet")}
                    disabled={
                      betAmount < callAmount || (!callAmount && !betAmount)
                    }
                  >
                    {betAmount === callAmount && callAmount ? "CALL" : ""}
                    {betAmount > callAmount && callAmount ? "RAISE" : ""}
                    {!callAmount ? "BET" : ""}
                  </ThemedButton>
                </View>
                <View style={{ flexDirection: "row" }}>
                  {callAmount ? (
                    <ThemedButton
                      type="danger"
                      style={{
                        flex: 1,
                      }}
                      onPress={() => handleBet("fold")}
                    >
                      FOLD
                    </ThemedButton>
                  ) : (
                    <ThemedButton
                      disabled={callAmount}
                      style={{
                        flex: 1,
                        opacity: callAmount ? 0.5 : 1,
                      }}
                      onPress={() => handleBet("bet")}
                    >
                      CHECK
                    </ThemedButton>
                  )}
                </View>
              </View>
            </View>
            {promptWinner && (
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
        </View>
      </SafeAreaView>
      <WinnerConfirmModal
        player={players[winnerIndex]}
        animationType="fade"
        transparent={true}
        visible={winnerModalVisible}
        handleCancel={() => setWinnerModalVisible(false)}
        handleConfirm={() => {
          handleHandEnd();
          setWinnerModalVisible(false);
        }}
        onRequestClose={() => {
          setWinnerModalVisible(false);
        }}
        onDismiss={() => {
          console.log("modal closed");
        }}
      />
    </ThemedView>
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
    backgroundColor: "rgba(0,0,0,0.2)",
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
