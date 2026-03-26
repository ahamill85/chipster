import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { View, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { shallowEqual, useSelector } from "react-redux";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { ThemedButton } from "../ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import PlayerRow from "./PlayerRow";
import ThemedModal from "../ThemedModal";
import Avatar from "../Avatar";
import BettingControls from "./BettingControls";
import Stats from "./Stats";
import InGameMenu from "./InGameMenu";

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
      if (amount > player.balance) amount = player.balance;
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
  const safeArea = useSafeAreaInsets();

  //redux vars
  const players = useSelector((state) => state.players, shallowEqual);
  const options = useSelector((state) => state.options, shallowEqual);

  //game state vars
  const [isActiveHand, setIsActiveHand] = useState(false);
  const [reraise, setReraise] = useState(players.map(() => 0));
  const [playerStatsHistory, setPlayerStatsHistory] = useState(() => {
    const newHand = setupNewHand(
      players.map((player) => ({
        ...player,
        balance: options.startingBalance,
      })),
      options
    );

    return {
      past: [],
      present: newHand,
      future: [],
    };
  });

  //ux state variables
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [promptWinnerSelection, setPromptWinnerSelection] = useState(false);
  const [winnerModalVisible, setWinnerModalVisible] = useState(false);
  const [winningPlayer, setWinningPlayer] = useState({});
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [controlsHeight, setControlsHeight] = useState(0);
  const [flatListHeight, setFlatListHeight] = useState(0);
  const headerHeight = safeArea.top + 50;

  //derived state vars
  const { present: playerStats } = playerStatsHistory;
  const activePlayerIndex = playerStats.findIndex(({ inTheGun }) =>
    inTheGun >= 0 ? inTheGun : 0
  );
  const currentRound = playerStats[0].bets.length - 1;
  const bets = playerStats.map(({ bets }) => bets);
  const currentRoundBets = playerStats.map(({ bets }) => bets[currentRound]);
  const minBet = Math.max(options.ante, options.smallBlind, options.bigBlind);
  const paceAmount = Math.max(...currentRoundBets, !currentRound ? minBet : 0);

  const remainingPlayers = playerStats.filter(
    ({ status, balance }) => status !== "fold" && status !== "out"
  );
  const awaitingPlayers = remainingPlayers.filter(
    ({ status, bets }) => bets[currentRound] < paceAmount || status === "ready"
  );

  //memoized vars
  const currentHand = useMemo(
    () =>
      playerStatsHistory.past.length === 0
        ? 0
        : playerStatsHistory.past.length - (isActiveHand ? 1 : 0),
    [playerStatsHistory.past.length, isActiveHand]
  );
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
  const calculatedWinnings = useMemo(() => {
    if (!("name" in winningPlayer)) return null;
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
    return {
      winnings,
      playerCredits,
    };
  }, [winningPlayer]);

  const gameOver =
    winningPlayer?.balance + calculatedWinnings?.winnings ===
    players.length * options.startingBalance;

  //refs
  const listElement = useRef(null);

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

      return {
        past,
        present: [...present],
        future: [],
      };
    });

    setIsActiveHand(true);
  };

  const handleNewRound = () => {
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

      return {
        ...rest,
        present: [...players],
      };
    });
  };

  const handleNewHand = () => {
    const { winnings, playerCredits } = calculatedWinnings;

    setWinnerModalVisible(false); //close winner alert
    setPromptWinnerSelection(false); //reset player list
    setReraise(playerStats.map(() => 0)); //reset reraise counts
    setIsActiveHand(false);

    setPlayerStatsHistory(({ present: players, past, ...rest }) => {
      const updatedWinnings = players.map((player, index) => {
        player.balance +=
          player.id === winningPlayer.id ? winnings : playerCredits[index];

        return player;
      });

      const updatedPlayers = setupNewHand(updatedWinnings, options);

      return {
        ...rest,
        past,
        present: updatedPlayers,
      };
    });
  };

  const handleHandEnd = (player) => {
    setWinningPlayer({ ...player });
    setWinnerModalVisible(true);
  };

  const handleGameReset = () => {
    handleUIReset();
    setPlayerStatsHistory(({ past }) => {
      return {
        past: [],
        present: JSON.parse(JSON.stringify(past[0])),
        future: [],
      };
    });
  };

  const handleUIReset = () => {
    setIsActiveHand(false);
    setWinnerModalVisible(false);
    setPromptWinnerSelection(false);
  };

  if (!promptWinnerSelection) {
    console.log("check hands");
    if (remainingPlayers.length === 1) {
      console.log("everyone is out or folded but 1 person");
      handleHandEnd(remainingPlayers[0]);
    } else if (awaitingPlayers.length === 0) {
      if (currentRound >= options.maxRounds - 1) {
        console.log("max rounds reached");
        setPromptWinnerSelection(true);
      } else {
        console.log("all players acted, time for a new round");
        handleNewRound();
      }
    } else if (
      remainingPlayers.filter(({ balance }) => !!balance).length === 1
    ) {
      console.log("only 1 person has a balance left to bet");
      setPromptWinnerSelection(true);
    } else {
      console.log("keep going!");
    }
  }

  const ITEM_HEIGHT = 80; // replace with your actual item height

  const scrollToCenter = (index) => {
    const viewportHeight = flatListHeight - headerHeight - controlsHeight;
    const centerOffset =
      index * ITEM_HEIGHT - (viewportHeight - ITEM_HEIGHT) / 2;
    const offset = centerOffset - headerHeight;

    console.log(offset);

    listElement.current?.scrollToOffset({
      offset,
      animated: true,
    });
  };

  useEffect(() => {
    if (activePlayerIndex >= 0) {
      scrollToCenter(activePlayerIndex);
    }
  }, [playerStats, controlsHeight, promptWinnerSelection]);

  const handlePlayerPress = useCallback(
    (index) => {
      setSelectedPlayer(playerStats[index]);
      setWinnerModalVisible(true);
    },
    [playerStats]
  );

  useEffect(() => {
    if (!isActiveHand) {
      console.log("options updated");

      setPlayerStatsHistory(() => ({
        past: [],
        present: setupNewHand(players, options),
        future: [],
      }));
    }
  }, [players, options, isActiveHand, promptWinnerSelection]);

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
          extraData={promptWinnerSelection}
          renderItem={({ item: player, index }) => (
            <PlayerRow
              promptWinner={promptWinnerSelection}
              isTurn={player.inTheGun && !promptWinnerSelection}
              player={player}
              key={player.id}
              currentRound={currentRound}
              onPress={() => handlePlayerPress(index)}
              isLast={index === playerStats.length - 1}
            />
          )}
          ref={listElement}
          automaticallyAdjustContentInsets={false}
          automaticallyAdjustsScrollIndicatorInsets={false}
          contentInset={{ top: headerHeight, bottom: controlsHeight }}
          scrollIndicatorInsets={{
            top: headerHeight,
            bottom: controlsHeight,
          }}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setFlatListHeight(height);
          }}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          onScrollToIndexFailed={scrollToCenter}
        />
        <BlurView
          intensity={70}
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
            height: headerHeight,
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
          intensity={70}
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
            const { height } = event.nativeEvent.layout;
            setControlsHeight(height);
          }}
        >
          {!promptWinnerSelection ? (
            <>
              <Stats
                currentHand={currentHand}
                currentRound={currentRound}
                potAmount={potAmount}
              />
              <BettingControls
                activePlayerBalance={playerStats[activePlayerIndex]?.balance}
                callAmount={callAmount}
                handleBet={handleBet}
                promptWinnerSelection={promptWinnerSelection}
                maxRaiseReached={
                  reraise[activePlayerIndex] >= options.maxReraise
                }
                activePlayerIndex={activePlayerIndex}
                increment={options.increment}
                potAmount={potAmount}
              />
            </>
          ) : (
            <View
              style={{
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
        </BlurView>
        <ThemedModal visible={winnerModalVisible} style={{ maxWidth: 400 }}>
          {selectedPlayer ? (
            <View style={{ gap: 20 }}>
              <ThemedText
                type="subtitle"
                style={{ textAlign: "center" }}
              >{`Confirm ${selectedPlayer?.name} won the the hand.`}</ThemedText>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <ThemedButton
                  type="danger"
                  style={{ flex: 1 }}
                  onPress={() => {
                    setWinnerModalVisible(false);
                  }}
                >
                  Cancel
                </ThemedButton>
                <ThemedButton
                  style={{ flex: 1 }}
                  onPress={() => {
                    handleHandEnd(selectedPlayer);
                    setSelectedPlayer(null);
                  }}
                >
                  Confirm
                </ThemedButton>
              </View>
            </View>
          ) : (
            <ThemedView style={{ gap: 20 }}>
              <KeyboardAvoidingView>
                <View
                  style={{ alignItems: "center", gap: 10, paddingVertical: 30 }}
                >
                  <Avatar
                    name={winningPlayer.name}
                    source={winningPlayer.avatar}
                    size={160}
                  />
                  <ThemedText
                    type="h3"
                    style={{ textAlign: "center", paddingBottom: 10 }}
                  >
                    {`${winningPlayer.name} wins the ${
                      gameOver ? "game" : "hand"
                    }!`}
                  </ThemedText>
                  <ThemedText type="subtitle" style={{ textAlign: "center" }}>
                    {gameOver
                      ? `Total - ${
                          winningPlayer?.balance + calculatedWinnings?.winnings
                        }`
                      : `Pot Total - ${calculatedWinnings?.winnings}`}
                  </ThemedText>
                </View>

                {!gameOver ? (
                  <ThemedButton onPress={handleNewHand}>
                    Deal Next Hand
                  </ThemedButton>
                ) : (
                  <View style={{ gap: 10 }}>
                    <ThemedButton onPress={handleGameReset}>
                      New Game
                    </ThemedButton>
                    <ThemedButton
                      type="danger"
                      onPress={() => {
                        setWinnerModalVisible(false);
                        navigation.navigate("welcome");
                      }}
                    >
                      Exit Game
                    </ThemedButton>
                  </View>
                )}
              </KeyboardAvoidingView>
            </ThemedView>
          )}
        </ThemedModal>
        <InGameMenu
          navigation={navigation}
          visible={optionsModalVisible}
          disableUndo={!playerStatsHistory.past.length}
          disableRedo={!playerStatsHistory.future.length}
          disableReset={!playerStatsHistory.past.length}
          activeHand={isActiveHand}
          handleUndo={() => {
            handleUIReset();
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
            handleUIReset();
            setPlayerStatsHistory(({ past, present, future }) => {
              return {
                present: future.pop(),
                past: [...past, JSON.parse(JSON.stringify(present))],
                future,
              };
            });
            setOptionsModalVisible(false);
          }}
          handleReset={handleGameReset}
          backdropDismiss={() => setOptionsModalVisible(false)}
          handleDismiss={() => setOptionsModalVisible(false)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
