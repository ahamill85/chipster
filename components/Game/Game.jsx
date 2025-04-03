import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { ThemedButton } from "../ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import PlayerRow from "./PlayerRow";
import WinnerConfirmModal from "./WinnerConfirmModal";
import ThemedModal from "../ThemedModal";
import Avatar from "../Avatar";
import BettingControls from "./BettingControls";
import Stats from "./Stats";
import InGameMenu from "./InGameMenu";
import { useHeaderHeight } from "@react-navigation/elements";

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
  const [isActiveHand, setIsActiveHand] = useState(false);
  const [reraise, setReraise] = useState(players.map(() => 0));
  const [playerStatsHistory, setPlayerStatsHistory] = useState(() => {
    const newHand = setupNewHand(
      players.map((player) => ({ ...player, balance: startingBalance })),
      options
    );

    return {
      past: [],
      present: newHand,
      future: [],
    };
  });

  //derived state vars
  const { present: playerStats } = playerStatsHistory;
  const activePlayerIndex = playerStats.findIndex(({ inTheGun }) =>
    inTheGun >= 0 ? inTheGun : 0
  );

  const currentHand = useMemo(
    () =>
      playerStatsHistory.past.length === 0
        ? 0
        : playerStatsHistory.past.length - (isActiveHand ? 1 : 0),
    [playerStatsHistory.past.length, isActiveHand]
  );

  const currentRound = playerStats[0].bets.length - 1;
  const bets = playerStats.map(({ bets }) => bets);
  const currentRoundBets = playerStats.map(({ bets }) => bets[currentRound]);
  const paceAmount = Math.max(...currentRoundBets);
  const gameOver =
    playerStats.filter(({ status }) => status !== "out").length === 1;
  const remainingPlayers = playerStats.filter(
    ({ status }) => status !== "fold" && status !== "out"
  );

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
  const [winningPlayer, setWinningPlayer] = useState({});
  const [winnerAlertVisible, setWinnerAlertVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [overlayHeight, setOverlayHeight] = useState(0);

  //refs
  const listElement = useRef(null);

  const headerHeight = useHeaderHeight();

  const playerBetTotals = playerStats.reduce(
    (array, player) => [
      ...array,
      player.bets.reduce((total, round) => total + round, 0),
    ],
    []
  );

  const winningPlayerTotalBet =
    playerBetTotals[
      playerStats.findIndex(({ id }) => id === winningPlayer?.id)
    ];

  const playerCredits = playerBetTotals.map((totalBet) =>
    Math.max(totalBet - winningPlayerTotalBet, 0)
  );

  const winnings =
    potAmount - playerCredits.reduce((total, credits) => total + credits, 0);

  const calculatedWinnings = useMemo(() => {
    return {
      winnings,
      playerCredits,
    };
  }, [winningPlayer]);

  // console.log("-------------------------------------");
  // console.log(`Player Bet Totals: ${playerBetTotals}`);
  // console.log(`Winning Player Total Bet: ${winningPlayerTotalBet}`);
  // console.log(`Player Credits: ${playerCredits}`);
  // console.log(`Winnings: ${winnings}`);

  const handleBet = ({ type, amount }) => {
    Keyboard.dismiss();

    //update reraise count
    if (amount > callAmount) {
      setReraise((state) => {
        state[activePlayerIndex] += 1;
        return [...state];
      });
    }

    //set bet and handle next player
    setPlayerStatsHistory(({ past, present }) => {
      //push state in to past on first bet to allow back
      if (!isActiveHand) past.push(JSON.parse(JSON.stringify(present)));

      const activeIndex = present.findIndex(({ inTheGun }) => inTheGun);
      const activePlayer = present[activeIndex];

      activePlayer.inTheGun = false;
      activePlayer.bets[currentRound] += amount;
      activePlayer.status = type;
      activePlayer.balance -= amount;

      present[activeIndex] = activePlayer;

      //activate next player
      for (var i = 0; i < present.length; i++) {
        const pointer = (i + activeIndex + 1) % present.length;
        const player = present[pointer];

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

      if (!present.some(({ inTheGun }) => inTheGun)) {
        console.log("fuck, no active present");
        present[activeIndex].inTheGun = true;
      }

      // console.log('----------------before bet-------------------')
      // console.log(rest.past[0].map(({name, balance}) => (`\n${name} - ${balance}`)))
      // console.log('---------------------------------------------')

      setIsActiveHand(true);

      return {
        past,
        present: [...present],
        future: [],
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

  const handleNewHand = () => {
    console.log("new hand!");

    const { winnings, playerCredits } = calculatedWinnings;

    setPlayerStatsHistory(({ present: players, past, ...rest }) => {
      const updatedWinnings = players.map((player, index) => {
        player.balance +=
          player.id === winningPlayer.id ? winnings : playerCredits[index];

        return player;
      });

      const updatedPlayers = setupNewHand(updatedWinnings, options);

      return {
        ...rest,
        past, //: [...past, JSON.parse(JSON.stringify(updatedPlayers))],
        present: updatedPlayers,
      };
    });

    setWinnerAlertVisible(false); //close winner alert
    setIsActiveHand(false); //set active hand to false
    setReraise(playerStats.map(() => 0)); //reset reraise counts
  };

  const handleHandEnd = (player) => {
    setPrompWinnerSelection(false);
    setWinnerModalVisible(false);

    setWinningPlayer({ ...player });
    setWinnerAlertVisible(true);
  };

  const handleReset = () => {
    setPlayerStatsHistory(({ past }) => {
      return {
        past: [],
        present: JSON.parse(JSON.stringify(past[0])),
        future: [],
      };
    });
  };

  useEffect(() => {
    if (
      promptWinnerSelection ||
      winnerAlertVisible ||
      winnerModalVisible ||
      gameOver
    )
      return;

    //everyone but 1 person folded
    if (remainingPlayers.length === 1) {
      console.log("everyone is out or folded but 1 person");
      handleHandEnd(remainingPlayers[0]);
    } else if (remainingPlayers.every(({ status }) => status === "check")) {
      console.log("all players checked");
      handleNewRound();
    } else if (!remainingPlayers.some(({ status }) => status === "ready")) {
      const awaitingPlayers = remainingPlayers.filter(
        ({ balance, bets }) => bets[currentRound] < paceAmount && balance
      );

      if (!awaitingPlayers.length) {
        if (remainingPlayers.filter(({ balance }) => !!balance).length < 2) {
          console.log("only 1 player left with a balance");
          setPrompWinnerSelection(true);
        } else {
          console.log("new round");
          handleNewRound();
        }
      } else {
        console.log("waiting for players");
      }
    } else {
      //console.log("round continues");
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
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

        <BlurView
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            overflow: "hidden",
            paddingBottom: safeArea.bottom,
            paddingTop: 30,
            backgroundColor: useThemeColor({}, "rule"),
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setOverlayHeight(height);
          }}
        >
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
            potAmount={potAmount}
          />
        </BlurView>
        <WinnerConfirmModal
          player={playerSelected}
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
        <ThemedModal visible={winnerAlertVisible} style={{ maxWidth: 400 }}>
          {winningPlayer && (
            <ThemedView style={{ gap: 20 }}>
              <KeyboardAvoidingView>
                <View
                  style={{ alignItems: "center", gap: 10, paddingVertical: 30 }}
                >
                  <ThemedText type="title">Winner!</ThemedText>
                  <Avatar
                    name={winningPlayer.name}
                    source={winningPlayer.avatar}
                    size={160}
                  />
                  <ThemedText
                    type="h3"
                    style={{ textAlign: "center", paddingBottom: 10 }}
                  >
                    {winningPlayer.name}
                  </ThemedText>
                  <ThemedText type="subtitle" style={{ textAlign: "center" }}>
                    {`Pot Total - ${calculatedWinnings.winnings}`}
                  </ThemedText>
                </View>
                <ThemedButton onPress={handleNewHand}>
                  Deal Next Hand
                </ThemedButton>
              </KeyboardAvoidingView>
            </ThemedView>
          )}
        </ThemedModal>
        <ThemedModal visible={gameOver}>
          {winningPlayer && (
            <ThemedView style={{ gap: 20 }}>
              <KeyboardAvoidingView>
                <View
                  style={{ alignItems: "center", gap: 10, paddingVertical: 30 }}
                >
                  <ThemedText type="title">Winner!</ThemedText>
                  <Avatar
                    name={winningPlayer.name}
                    source={winningPlayer.avatar}
                    size={160}
                  />
                  <ThemedText
                    type="subtitle"
                    style={{ textAlign: "center", paddingBottom: 30 }}
                  >
                    {winningPlayer.name}
                  </ThemedText>
                  <ThemedText type="subtitle" style={{ textAlign: "center" }}>
                    {`Pot Total - ${calculatedWinnings.winnings}`}
                  </ThemedText>
                </View>
                <ThemedButton onPress={handleReset}>Reset Game</ThemedButton>
              </KeyboardAvoidingView>
            </ThemedView>
          )}
        </ThemedModal>
        <InGameMenu
          navigation={navigation}
          visible={optionsModalVisible}
          disableUndo={!playerStatsHistory.past.length}
          disableRedo={!playerStatsHistory.future.length}
          handleUndo={() => {
            setIsActiveHand(false);
            setPlayerStatsHistory(({ past, present, future }) => {
              return {
                present: past.pop(),
                future: [...future, JSON.parse(JSON.stringify(present))],
                past,
              };
            });
            setOptionsModalVisible(false);
          }}
          handleRedo={() => {
            setIsActiveHand(false);
            setPlayerStatsHistory(({ past, present, future }) => {
              return {
                present: future.pop(),
                past: [...past, JSON.parse(JSON.stringify(present))],
                future,
              };
            });
            setOptionsModalVisible(false);
          }}
          handleReset={handleReset}
          backdropDismiss={() => setOptionsModalVisible(false)}
          handleDismiss={() => setOptionsModalVisible(false)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
