import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView, View, ScrollView, Keyboard } from "react-native";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

import { ThemedButton } from "../ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSelector, useDispatch } from "react-redux";
import {
  updatePlayer,
  resetPlayers,
  nextDealer,
  bet,
  startGame,
} from "@/features/slices/playersSlice";
import PlayerRow from "./PlayerRow";
import WinnerConfirmModal from "./WinnerConfirmModal";
import ThemedModal from "../ThemedModal";
import Avatar from "../Avatar";
import BettingControls from "./BettingControls";
import Stats from "./Stats";

const maxReraise = 1;
const maxRounds = 5;
const rotatingDealer = true;
const startingDealer = 0;

export default Game = () => {
  const players = useSelector((state) => state.players);

  const dispatch = useDispatch();

  //game state vars
  const [currentHand, setCurrentHand] = useState(1);
  const [bets, setBets] = useState([players.map(() => null)]);
  const [reraise, setReraise] = useState(players.map(() => 0));

  const activePlayerIndex = players.findIndex(({ inTheGun }) =>
    inTheGun ? inTheGun : 0
  );
  const currentRound = bets.length - 1;
  const paceAmount = Math.max(...bets[currentRound]);
  const potAmount = bets.reduce(
    (totalSum, round) =>
      totalSum + round.reduce((roundSum, bet) => roundSum + bet, 0),
    0
  );

  const callAmount = useMemo(() => {
    if (activePlayerIndex < 0) return 0;
    const currentBet = bets[currentRound][activePlayerIndex];
    const playerBalance = players[activePlayerIndex].balance;
    const newCallAmount = paceAmount - currentBet;

    return newCallAmount > playerBalance ? playerBalance : newCallAmount;
  }, [bets, players]);

  const pacePlayerIndex = useMemo(
    () => bets[currentRound].indexOf(paceAmount),
    [paceAmount]
  );

  //end game state vars

  //ux state variables
  const [playerSelected, setPlayerSelected] = useState(null);
  const [promptWinnerSelection, setPrompWinnerSelection] = useState(false);
  const [winnerModalVisible, setWinnerModalVisible] = useState(false);
  const [winningPlayer, setWinningPlayer] = useState(null);
  const [winnerAlertVisible, setWinnerAlertVisible] = useState(false);

  const handleStartGame = () => {
    dispatch(startGame(startingDealer));
  };

  const calculatedWinnings = () => {
    const playerCredits = players.reduce(
      (array, player) => [
        ...array,
        Math.max(0, player.currentBet - winningPlayer.currentBet),
      ],
      []
    );

    return [
      potAmount - playerCredits.reduce((total, credits) => total + credits, 0),
      playerCredits,
    ];
  };

  const handleNewHand = () => {
    const [winnings, playerCredits] = calculatedWinnings();

    players.forEach((player, index) => {
      const credit =
        player.id === winningPlayer.id ? winnings : playerCredits[index];

      dispatch(
        updatePlayer({
          ...player,
          balance: player.balance + credit, //calculateWinnings();
        })
      );
    });

    setWinnerAlertVisible(false); //close winner alert
    setBets([players.map(() => null)]); //reset bets
    setReraise(players.map(() => 0)); //reset reraise counts
    setCurrentHand((state) => (state += 1)); // up hand count

    dispatch(resetPlayers(rotatingDealer));
    dispatch(nextDealer());
  };

  const handleNewRound = () => {
    if (currentRound === maxRounds - 1) {
      setPrompWinnerSelection(true);
      return;
    }

    setBets((bets) => [...bets, players.map(() => null)]);
    setReraise(players.map(() => 0));
    players.map((player) => {
      if (
        (player.status === "check" || player.status === "bet") &&
        player.balance
      )
        dispatch(updatePlayer({ ...player, status: "ready" }));
    });
  };

  const handleHandEnd = (player) => {
    setPrompWinnerSelection(false);
    setWinnerModalVisible(false);

    setWinningPlayer(player);
    setWinnerAlertVisible(true);
  };

  useEffect(() => {
    const remainingPlayers = players.filter(
      ({ status }) => status !== "fold" && status !== "out"
    );

    //everyone but 1 person folded
    if (remainingPlayers.length === 1) {
      //console.log("everyone is out or folded but 1 person");
      handleHandEnd(remainingPlayers[0]);
    } else if (remainingPlayers.every(({ status }) => status === "check")) {
      //console.log("all players checked");
      handleNewRound();
      return;
    } else if (
      !remainingPlayers.some(
        ({ status }) => status === "ready" || status === "check"
      )
    ) {
      //console.log("everyone has made an action");

      const awaitingPlayers = players.filter(
        ({ balance, status }, index) =>
          bets[currentRound][index] < paceAmount &&
          status !== "fold" &&
          status !== "out" &&
          balance
      );

      if (!awaitingPlayers.length) {
        //console.log("no more betting in this round");

        if (remainingPlayers.filter(({ balance }) => !!balance).length === 1) {
          console.log("everyone is all-in except 1 person");
          setPrompWinnerSelection(true);
          return;
        }

        //console.log("betting continues");
        handleNewRound();
      }
    }
  }, [bets]);

  const handleBet = (type, amount) => {
    Keyboard.dismiss();

    dispatch(bet({ amount, type }));

    setBets((bets) => {
      bets[currentRound][activePlayerIndex] += amount;
      return [...bets];
    });

    if (amount > callAmount) {
      setReraise((state) => {
        state[activePlayerIndex] += 1;
        return [...state];
      });
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              columnGap: 20,
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <View style={{ width: 30 }}></View>
            <View style={{ flex: 1 }}>
              <ThemedText type="defaultSemiBold" style={{ fontSize: 12 }}>
                NAME
              </ThemedText>
            </View>
            <View style={{ width: 50 }}>
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
              flexBasis: "auto",
              backgroundColor: useThemeColor({}, "background"),
              zIndex: 1,
            }}
          >
            {players.map((player, index) => (
              <PlayerRow
                promptWinner={promptWinnerSelection}
                isTurn={player.inTheGun && !promptWinnerSelection}
                player={player}
                key={player.id}
                onPress={() => {
                  setPlayerSelected(players[index]);
                  setWinnerModalVisible(true);
                }}
                isLast={index === players.length - 1}
              />
            ))}
          </ScrollView>
          {activePlayerIndex < 0 ? (
            <View style={{ flex: 1, padding: 20, justifyContent: "flex-end" }}>
              <ThemedButton onPress={handleStartGame}>Start Game</ThemedButton>
            </View>
          ) : (
            <>
              <Stats
                currentHand={currentHand}
                currentRound={currentRound}
                potAmount={potAmount}
              />
              <BettingControls
                activePlayerBalance={players[activePlayerIndex].balance}
                callAmount={callAmount}
                handleBet={handleBet}
                promptWinnerSelection={promptWinnerSelection}
                maxRaiseReached={reraise[activePlayerIndex] >= maxReraise}
                activePlayerIndex={activePlayerIndex}
              />
            </>
          )}
        </View>
      </SafeAreaView>
      <WinnerConfirmModal
        player={playerSelected}
        animationType="fade"
        transparent={true}
        visible={winnerModalVisible}
        handleCancel={() => setWinnerModalVisible(false)}
        handleConfirm={() => {
          setPrompWinnerSelection(false);
          handleHandEnd(playerSelected);
        }}
        onRequestClose={() => {
          setWinnerModalVisible(false);
        }}
        onDismiss={() => {
          //console.log("modal closed");
        }}
      />
      <ThemedModal
        animationType="fade"
        transparent={true}
        visible={winnerAlertVisible}
      >
        {winningPlayer && (
          <ThemedView style={{ gap: 20 }}>
            <View style={{ alignItems: "center", gap: 10 }}>
              <Avatar source={winningPlayer.avatar} size={160} />
              <ThemedText type="title">{winningPlayer.name} Wins</ThemedText>
              <ThemedText type="subtitle">
                Total Win - {calculatedWinnings()[0]}
              </ThemedText>
            </View>
            <ThemedButton onPress={handleNewHand}>New Hand</ThemedButton>
          </ThemedView>
        )}
      </ThemedModal>
    </ThemedView>
  );
};
