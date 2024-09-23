import React, { useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView, View, Keyboard, Text } from "react-native";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

import { ThemedButton } from "../ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSelector, useDispatch } from "react-redux";
import {
  updatePlayer,
  resetPlayers,
  nextHand,
  bet,
  startGame,
} from "@/features/slices/playersSlice";
import PlayerRow from "./PlayerRow";
import WinnerConfirmModal from "./WinnerConfirmModal";
import ThemedModal from "../ThemedModal";
import Avatar from "../Avatar";
import BettingControls from "./BettingControls";
import Stats from "./Stats";
import { FlatList } from "react-native-gesture-handler";

import ActionSheet from "react-native-actions-sheet";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const maxReraise = 1;
const maxRounds = 5;
const rotatingDealer = true;
const startingDealer = 0;
const smallBlind = 1;
const bigBlind = 2;
const increment = 1;
const ante = 0;

const setupNewHand = (players, dealerIndex = 0) => {
  let foundDealer = false;
  let foundSmallBlind = !smallBlind;
  let foundBigBlind = !bigBlind;
  let foundNextPlayer = false;

  let index = dealerIndex;
  let amount = ante;
  let playerCount = players.length;

  const playerArr = players.map((player) => {
    return { ...player, inTheGun: false, isDealer: false, bets: player.bets = [] };
  });

  while (
    !foundDealer ||
    !foundSmallBlind ||
    !foundBigBlind ||
    !foundNextPlayer ||
    index - dealerIndex < playerCount
  ) {
    let player = playerArr[index % playerArr.length];

    const playerIsActive = player.status !== "out" && player.balance;

    if (!foundDealer) {
      player.isDealer = true;
      foundDealer = true;
    } else if (!foundSmallBlind && playerIsActive) {
      amount = smallBlind;
      foundSmallBlind = true;
    } else if (!foundBigBlind && playerIsActive) {
      amount = bigBlind;
      foundBigBlind = true;
    } else if (!foundNextPlayer && playerIsActive) {
      player.inTheGun = true;
      foundNextPlayer = true;
    }

    if (!playerIsActive) {
      player.bets.push(0);
      player.status = "out";
    } else {
      player.bets.push(amount);
      player.status = "ready";
    }

    amount = ante;

    index++;
  }

  return [...playerArr];
};

export default Game = ({ navigation }) => {
  const players = useSelector((state) => state.players);

  const dispatch = useDispatch();

  //game state vars
  const [currentHand, setCurrentHand] = useState(1);
  const [reraise, setReraise] = useState(players.map(() => 0));
  const [playerStats, setPlayerStats] = useState(() => setupNewHand(players));

  const activePlayerIndex = playerStats.findIndex(({ inTheGun }) =>
    inTheGun >= 0 ? inTheGun : 0
  );
  const currentRound = playerStats[0].bets.length - 1;
  const bets = playerStats.map(({ bets }) => bets);
  const currentRoundBets = playerStats.map(({ bets }) => bets[currentRound]);
  const paceAmount = Math.max(...currentRoundBets);
  const potAmount = bets.reduce(
    (totalSum, playerBets) =>
      totalSum +
      playerBets.reduce((playerTotal, roundBet) => playerTotal + roundBet, 0),
    0
  );

  const callAmount = useMemo(() => {
    if (activePlayerIndex < 0) return 0;
    const currentBet = currentRoundBets[activePlayerIndex];
    const playerBalance = playerStats[activePlayerIndex].balance;
    const newCallAmount = paceAmount - currentBet;

    // console.log(currentBet, playerBalance, newCallAmount);

    return newCallAmount > playerBalance ? playerBalance : newCallAmount;
  }, [currentRoundBets]);
  //end game state vars

  //ux state variables
  const [playerSelected, setPlayerSelected] = useState(null);
  const [promptWinnerSelection, setPrompWinnerSelection] = useState(false);
  const [winnerModalVisible, setWinnerModalVisible] = useState(false);
  const [winningPlayer, setWinningPlayer] = useState(null);
  const [winnerAlertVisible, setWinnerAlertVisible] = useState(false);

  const listElement = useRef(null);

  const handleBet = (type, amount) => {
    Keyboard.dismiss();

    //update reraise count
    if (amount > callAmount) {
      setReraise((state) => {
        state[activePlayerIndex] += 1;
        return [...state];
      });
    }

    //set bet and handle next player
    setPlayerStats((state) => {
      const activeIndex = state.findIndex(({ inTheGun }) => inTheGun);
      const activePlayer = state[activeIndex];

      activePlayer.inTheGun = false;
      activePlayer.bets[currentRound] += amount;
      activePlayer.status = type;
      activePlayer.balance -= amount;

      //activate next player
      for (var i = 0; i < state.length; i++) {
        const pointer = (i + activeIndex + 1) % state.length;
        const player = state[pointer];

        //ensure next player is not
        if (
          player.status !== "out" &&
          player.status !== "fold" &&
          player.balance
        ) {
          player.inTheGun = true;
          break;
        }
      }

      if (!state.some(({ inTheGun }) => inTheGun)) {
        console.log("fuck");
        state[activeIndex].inTheGun = true;
      }

      return [...state];
    });
  };

  const handleNewRound = () => {
    if (currentRound === maxRounds - 1) {
      setPrompWinnerSelection(true);
      return;
    }

    setReraise(players.map(() => 0));

    setPlayerStats((state) => {
      const activeIndex = state.findIndex(({ isDealer }) => isDealer);

      let foundNextPlayer = false;

      for (var i = 0; i < state.length; i++) {
        const pointer = (i + activeIndex + 1) % state.length;
        const player = state[pointer];

        player.bets.push(0);
        player.inTheGun = false;

        //ensure next player is not
        if (
          player.status !== "out" &&
          player.status !== "fold" &&
          player.balance
        ) {
          if (!foundNextPlayer) {
            player.inTheGun = true;
            foundNextPlayer = true;
          }

          player.status = "ready";
        }
      }

      if (!state.some(({ inTheGun }) => inTheGun)) {
        console.log("fuck");
        state[activeIndex].inTheGun = true;
      }

      return [...state];
    });
  };

  const calculatedWinnings = () => {
    const playerBetTotals = playerStats.reduce(
      (array, player) => [
        ...array,
        player.bets.reduce((total, round) => total + round, 0),
      ],
      []
    );

    const winningPlayerIndex = playerStats.findIndex(
      ({ id }) => id === winningPlayer.id
    );
    const winningPlayerTotalBet = playerBetTotals[winningPlayerIndex];

    const playerCredits = playerBetTotals.map((totalBet) =>
      Math.max(totalBet - winningPlayerTotalBet, 0)
    );

    return [
      potAmount - playerCredits.reduce((total, credits) => total + credits, 0),
      playerCredits,
    ];
  };

  const handleHandEnd = (player) => {
    setPrompWinnerSelection(false);
    setWinnerModalVisible(false);

    setWinningPlayer(player);
    setWinnerAlertVisible(true);
  };

  const handleNewHand = () => {
    const [winnings, playerCredits] = calculatedWinnings();

    setPlayerStats((state) => {
      const dealerIndex = playerStats.findIndex(({ isDealer }) => isDealer);

      const updatedWinnings = state.map((player, index) => {
        player.balance +=
          player.id === winningPlayer.id ? winnings : playerCredits[index];

        return player;
      });

      return setupNewHand(updatedWinnings, dealerIndex);
    });

    setWinnerAlertVisible(false); //close winner alert

    setReraise(playerStats.map(() => 0)); //reset reraise counts
    setCurrentHand((state) => (state += 1)); // up hand count
  };

  useEffect(() => {
    const remainingPlayers = playerStats.filter(
      ({ status }) => status !== "fold" && status !== "out"
    );

    //everyone but 1 person folded
    if (remainingPlayers.length === 1) {
      console.log("everyone is out or folded but 1 person");
      handleHandEnd(remainingPlayers[0]);
    } else if (remainingPlayers.every(({ status }) => status === "check")) {
      console.log("all players checked");
      handleNewRound();
    } else if (!remainingPlayers.some(({ status }) => status === "ready")) {
      //console.log("everyone has made an action");

      const awaitingPlayers = remainingPlayers.filter(
        ({ balance, bets }) => bets[currentRound] < paceAmount && balance
      );

      if (!awaitingPlayers.length) {
        if (remainingPlayers.filter(({ balance }) => !!balance).length < 2) {
          // console.log(
          //   "at least everyone but 1 person is all in and it's time to select a winner"
          // );
          setPrompWinnerSelection(true);
        } else {
          console.log("new round");
          handleNewRound();
        }
      } else {
        console.log("waiting for players");
      }
    } else {
      console.log("round continues");
    }
  }, [playerStats]);

  useEffect(() => {
    if (activePlayerIndex !== -1) {
      listElement.current.scrollToIndex({
        index: activePlayerIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [activePlayerIndex]);

  console.log(playerStats);

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            columnGap: 20,
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 10,
            flex: 0,
          }}
        >
          <View style={{ width: 50 }}></View>
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
        <FlatList
          style={{
            backgroundColor: useThemeColor({}, "background"),
            flex: 1,
          }}
          data={playerStats}
          renderItem={({ item: player, index }) => (
            <PlayerRow
              promptWinner={promptWinnerSelection}
              isTurn={player.inTheGun && !promptWinnerSelection}
              player={player}
              key={player.id}
              currentRound={currentRound}
              onPress={() => {
                setPlayerSelected(playerStats[index]);
                setWinnerModalVisible(true);
              }}
              isLast={index === playerStats.length - 1}
            />
          )}
          ref={listElement}
          onScrollToIndexFailed={() => {}}
        />
      </SafeAreaView>

      {/* {activePlayerIndex < 0 ? (
        <Animated.View
          exiting={SlideOutDown}
          entering={SlideInDown}
          layout={LinearTransition}
        >
          <SafeAreaView
            style={{
              backgroundColor: "rgba(0,0,0,0.1)",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
          >
            <View
              style={{
                padding: 20,
              }}
            >
              <ThemedButton onPress={handleStartGame}>Start Game</ThemedButton>
            </View>
          </SafeAreaView>
        </Animated.View>
      ) : ( */}
      <Animated.View
        exiting={SlideOutDown}
        entering={SlideInDown}
        layout={LinearTransition}
      >
        <SafeAreaView
          style={{
            backgroundColor: "rgba(0,0,0,0.1)",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <View style={{ paddingTop: 30 }}>
            <Stats
              currentHand={currentHand}
              currentRound={currentRound}
              potAmount={potAmount}
            />
            <BettingControls
              activePlayerBalance={playerStats[activePlayerIndex].balance}
              callAmount={callAmount}
              handleBet={handleBet}
              promptWinnerSelection={promptWinnerSelection}
              maxRaiseReached={reraise[activePlayerIndex] >= maxReraise}
              activePlayerIndex={activePlayerIndex}
            />
          </View>
        </SafeAreaView>
      </Animated.View>
      {/* )} */}
      {/* </SafeAreaView> */}

      <WinnerConfirmModal
        player={playerSelected}
        animationType="slide"
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
        animationType="slide"
        transparent={true}
        visible={winnerAlertVisible}
      >
        {winningPlayer && (
          <ThemedView style={{ gap: 20 }}>
            <View style={{ alignItems: "center", gap: 10 }}>
              <Avatar source={winningPlayer.avatar} size={160} />
              <ThemedText type="title">Winner!</ThemedText>
              <ThemedText type="subtitle">{winningPlayer.name}</ThemedText>
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
