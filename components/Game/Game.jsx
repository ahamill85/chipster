import React, { useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView, View, Keyboard, Text } from "react-native";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

import { ThemedButton } from "../ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSelector } from "react-redux";
import PlayerRow from "./PlayerRow";
import WinnerConfirmModal from "./WinnerConfirmModal";
import ThemedModal from "../ThemedModal";
import Avatar from "../Avatar";
import BettingControls from "./BettingControls";
import Stats from "./Stats";
import { FlatList } from "react-native-gesture-handler";

import Animated, {
  LinearTransition,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";

import { BlurView } from "expo-blur";

import { FontAwesome, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { TouchableHighlight } from "react-native";
import { TouchableOpacity } from "react-native";
import Options from "../Options/Options";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// const maxReraise = 1;
// const maxRounds = 5;
// const rotatingDealer = true;
// const startingDealer = 0;
// const smallBlind = 1;
// const bigBlind = 2;
// const increment = 1;
// const ante = 0;
// const playerDealer = true;

const setupNewHand = (players, options) => {
  const { playerDealer, smallBlind, bigBlind, ante, rotatingDealer } = options;

  const currentDealerIndex = players.findIndex(({ isDealer }) => isDealer);
  const dealerIndex = rotatingDealer
    ? (currentDealerIndex + 1) % players.length
    : 0;

  let foundDealer = !playerDealer;
  let foundSmallBlind = !smallBlind;
  let foundBigBlind = !bigBlind;
  let foundNextPlayer = false;

  let index = dealerIndex;
  let amount = ante;
  let playerCount = players.length;

  const playerArr = players.map((player) => {
    return {
      ...player,
      inTheGun: false,
      isDealer: false,
      bets: [],
    };
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
      player.balance -= amount;
      player.status = "ready";
    }

    amount = ante;

    index++;
  }

  return [...playerArr];
};

export default Game = ({ navigation }) => {
  const players = useSelector((state) => state.players);
  const { maxReraise, maxRounds, startingBalance, increment, ...options } =
    useSelector((state) => state.options);

  //game state vars
  const [reraise, setReraise] = useState(players.map(() => 0));
  const [playerStatsHistory, setPlayerStatsHistory] = useState(() => {
    const newHand = setupNewHand(
      players.map((player) => ({ ...player, balance: startingBalance })),
      options
    );
    return {
      past: [newHand],
      present: newHand,
      future: [],
    };
  });

  //derived state vars
  const { present: playerStats } = playerStatsHistory;
  const currentHand = playerStatsHistory.past.length + 1;
  const activePlayerIndex = playerStats.findIndex(({ inTheGun }) =>
    inTheGun >= 0 ? inTheGun : 0
  );
  const currentRound = playerStats[0].bets.length - 1;
  const bets = playerStats.map(({ bets }) => bets);
  const currentRoundBets = playerStats.map(({ bets }) => bets[currentRound]);
  const paceAmount = Math.max(...currentRoundBets);

  //memoized vars
  const potAmount = useMemo(
    () =>
      bets.reduce(
        (totalSum, playerBets) =>
          totalSum +
          playerBets.reduce(
            (playerTotal, roundBet) => playerTotal + roundBet,
            0
          ),
        0
      ),
    [playerStats]
  );
  const callAmount = useMemo(() => {
    if (activePlayerIndex < 0) return 0;
    const currentBet = currentRoundBets[activePlayerIndex];
    const playerBalance = playerStats[activePlayerIndex].balance;
    const newCallAmount = paceAmount - currentBet;

    return newCallAmount > playerBalance ? playerBalance : newCallAmount;
  }, [currentRoundBets]);

  //ux state variables
  const [playerSelected, setPlayerSelected] = useState(null);
  const [promptWinnerSelection, setPrompWinnerSelection] = useState(false);
  const [winnerModalVisible, setWinnerModalVisible] = useState(false);
  const [winningPlayer, setWinningPlayer] = useState(null);
  const [winnerAlertVisible, setWinnerAlertVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  const [overlayHeight, setOverlayHeight] = useState(0);

  //refs
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
    setPlayerStatsHistory(({ present: players, ...rest }) => {
      const activeIndex = players.findIndex(({ inTheGun }) => inTheGun);
      const activePlayer = players[activeIndex];

      activePlayer.inTheGun = false;
      activePlayer.bets[currentRound] += amount;
      activePlayer.status = type;
      activePlayer.balance -= amount;

      //activate next player
      for (var i = 0; i < players.length; i++) {
        const pointer = (i + activeIndex + 1) % players.length;
        const player = players[pointer];

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

      if (!players.some(({ inTheGun }) => inTheGun)) {
        console.log("fuck");
        players[activeIndex].inTheGun = true;
      }

      return {
        ...rest,
        present: [...players],
      };
    });
  };

  const handleNewRound = () => {
    if (currentRound === maxRounds - 1) {
      setPrompWinnerSelection(true);
      return;
    }

    setReraise(players.map(() => 0));

    setPlayerStatsHistory(({ present: players, ...rest }) => {
      const activeIndex = players.findIndex(({ isDealer }) => isDealer);

      let foundNextPlayer = false;

      for (var i = 0; i < players.length; i++) {
        const pointer = (i + activeIndex + 1) % players.length;
        const player = players[pointer];

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

      if (!players.some(({ inTheGun }) => inTheGun)) {
        console.log("fuck");
        players[activeIndex].inTheGun = true;
      }

      return {
        ...rest,
        present: [...players],
      };
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

    setPlayerStatsHistory(({ past, present: players }) => {
      const updatedWinnings = players.map((player, index) => {
        player.balance +=
          player.id === winningPlayer.id ? winnings : playerCredits[index];

        return player;
      });

      const updatedPlayers = setupNewHand(updatedWinnings, options);

      return (newHistory = {
        past: [...past, updatedPlayers],
        present: updatedPlayers,
        future: [],
      });
    });

    setWinnerAlertVisible(false); //close winner alert

    setReraise(playerStats.map(() => 0)); //reset reraise counts
    //setCurrentHand((state) => (state += 1)); // up hand count
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
        viewPosition: 0,
        viewOffset: safeArea.top + 50,
      });
    }
  }, [activePlayerIndex, promptWinnerSelection]);

  const safeArea = useSafeAreaInsets();

  console.log(playerStatsHistory.past);

  return (
    <View style={{ flex: 1 }}>
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
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustsScrollIndicatorInsets={false}
        contentInset={{ top: safeArea.top + 50, bottom: overlayHeight }}
      />
      {/* <SafeAreaView style={{ flex: 1 }}>*/}
      <BlurView
        style={{
          flexDirection: "row",
          columnGap: 20,
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 10,
          flex: 0,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          paddingTop: safeArea.top,
          opacity: 0.9,
          height: safeArea.top + 50,
          backgroundColor: useThemeColor({}, "rule"),
        }}
      >
        <View
          style={{
            width: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => setOptionsModalVisible(true)}>
            <FontAwesome6
              size={24}
              name="bars"
              style={{ color: useThemeColor({}, "buttonBackground") }}
            />
          </TouchableOpacity>
        </View>
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
      </BlurView>

      {/* </SafeAreaView> */}
      {/* <Animated.View
        exiting={SlideOutDown}
        entering={SlideInDown}
        layout={LinearTransition}
        style={{backgroundColor: useThemeColor({}, "background"),}}
      > */}
      <BlurView
        style={{
          paddingBottom: safeArea.bottom,
          paddingTop: 30,
          backgroundColor: useThemeColor({}, "rule"),
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          overflow: "hidden",
        }}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setOverlayHeight(height);
        }}
      >
        {/* <View style={{ paddingHorizontal: 20 }}>
            <ThemedButton
              onPress={() => {
                setToggle((toggle) => !toggle);
              }}
            >
              Toggle
            </ThemedButton>
          </View> */}
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
          increment={increment}
        />
      </BlurView>
      {/* </Animated.View> */}
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
              <Avatar
                name={winningPlayer.name}
                source={winningPlayer.avatar}
                size={160}
              />
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
      <ThemedModal
        animationType="slide"
        transparent={true}
        visible={optionsModalVisible}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ThemedText type="subtitle">Options</ThemedText>
          <TouchableOpacity onPress={() => setOptionsModalVisible(false)}>
            <FontAwesome5
              name="times"
              size={30}
              style={{ color: useThemeColor({}, "tint1") }}
            />
          </TouchableOpacity>
        </View>
        <ThemedView style={{ gap: 20 }}>
          <ThemedButton
            icon={
              <FontAwesome6
                name="arrow-rotate-left"
                size={22}
                style={{ color: useThemeColor({}, "buttonText") }}
              />
            }
            onPress={() => {
              setPlayerStatsHistory(({ past, present, future }) => {
                return {
                  present: past.pop(),
                  past,
                  future,
                };
              });
              console.log("go back a hand");
            }}
          >
            Reset Current Hand
          </ThemedButton>
          <ThemedButton
            onPress={() => {
              setOptionsModalVisible(false);
              navigation.navigate("options");
            }}
          >
            Update Options
          </ThemedButton>
          <ThemedButton
            type="danger"
            onPress={() => {
              setOptionsModalVisible(false);
              navigation.navigate("welcome");
            }}
          >
            Exit Game
          </ThemedButton>
        </ThemedView>
      </ThemedModal>
    </View>
  );
};
