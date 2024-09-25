import { createSlice } from "@reduxjs/toolkit";

export const playersSlice = createSlice({
  name: "players",
  initialState: [],
  reducers: {
    startGame: (state, action) => {
      const dealerIndex = action.payload;
      state[dealerIndex].isDealer = true;

      for (var i = 0; i < state.length; i++) {
        const pointer = (i + dealerIndex + 1) % state.length;
        const player = state[pointer];

        player.inTheGun = true;
        break;
      }
    },
    addPlayers: (state, { payload: newPlayers }) => {
      state.push(...newPlayers);
    },
    removePlayer: (state, action) => {
      return state.filter(({ id }) => id !== action.payload);
    },
    reorderPlayers: (state, action) => {
      return action.payload;
    },
    updatePlayer: (state, action) => {
      return state.map((player) => {
        if (player.id === action.payload.id) {
          return { ...player, ...action.payload };
        } else {
          return player;
        }
      });
    },
    bet: (state, { payload: { amount, type } }) => {
      const currentIndex = state.findIndex(({ inTheGun }) => inTheGun);

      //update player
      state[currentIndex] = {
        ...state[currentIndex],
        inTheGun: false,
        status: type,
        currentBet: state[currentIndex].currentBet + amount,
        balance: state[currentIndex].balance - amount,
      };

      //activate next player
      for (var i = 0; i < state.length; i++) {
        const pointer = (i + currentIndex + 1) % state.length;
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
        const dealerIndex = state.findIndex(({ isDealer }) => isDealer);
        state[dealerIndex + 1].inTheGun = true;
        console.log("fucked up");
      }
    },
    resetPlayers: (state) =>
      state.map((player) => ({
        ...player,
        currentBet: null,
        folded: !player.balance,
        status: !player.balance ? "out" : "ready",
      })),
    nextHand: (state, action) => {
      let { startingDealer, ante, smallBlind, bigBlind } = action.payload;

      const dealerIndex =
        startingDealer !== null
          ? startingDealer - 1
          : state.findIndex(({ isDealer }) => isDealer);

      let foundDealer = !!startingDealer;
      let foundNextPlayer = false;

      for (var i = 0; i < state.length; i++) {
        const pointer = (i + dealerIndex + 1) % state.length;
        const player = state[pointer];

        if (!foundDealer) {
          player.isDealer = true;
          foundDealer = true;
        } else if (
          player.status !== "out" &&
          player.status !== "fold" &&
          player.balance
        ) {
          player.isDealer = false;
          player.inTheGun = false;
          player.currentBet = ante;
          player.status = "ready";

          if (smallBlind) {
            player.currentBet = smallBlind;
            player.status = "bet";
            smallBlind = 0;
            continue;
          }
          if (bigBlind) {
            player.currentBet = bigBlind;
            player.status = "bet";
            bigBlind = 0;
            continue;
          }
          if (!foundNextPlayer) {
            player.inTheGun = true;
            foundNextPlayer = true;
          } else {
            player.inTheGun = false;
          }
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addPlayers,
  removePlayer,
  reorderPlayers,
  updatePlayer,
  resetPlayers,
  nextHand,
  bet,
  startGame,
} = playersSlice.actions;

export default playersSlice.reducer;
