import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  // {
  //   id: 1,
  //   name: "Samantha",
  //   currentBet: 0,
  //   balance: 100,
  //   avatar: null,
  //   isDealer: true,
  //   status: "ready",
  //   inTheGun: false,
  // },
  // {
  //   id: 11,
  //   name: "Anthony",
  //   currentBet: 0,
  //   balance: 50,
  //   avatar: null,
  //   isDealer: false,
  //   status: "ready",
  //   inTheGun: true,
  // },
  // {
  //   id: 21,
  //   name: "Harper",
  //   currentBet: 0,
  //   balance: 100,
  //   avatar: null,
  //   isDealer: false,
  //   status: "ready",
  //   inTheGun: false,
  // },
  // {
  //   id: 32,
  //   name: "Cameron",
  //   currentBet: 0,
  //   balance: 100,
  //   avatar: null,
  //   isDealer: false,
  //   status: "ready",
  //   inTheGun: false,
  // },
];

export const playersSlice = createSlice({
  name: "players",
  initialState: initialState,
  reducers: {
    startGame: (state, action) => {
      const dealerIndex = action.payload;
      state[dealerIndex].isDealer = true

      for (var i = 0; i < state.length; i++) {
        const pointer = (i + dealerIndex + 1) % state.length;
        const player = state[pointer];

        player.inTheGun = true;
        break;
      }
    },
    addPlayer: (state, action) => {
      state.push(action.payload);
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
        currentBet: 0,
        folded: !player.balance,
        status: !player.balance ? "out" : "ready",
      })),
    nextDealer: (state) => {
      const dealerIndex = state.findIndex(({ isDealer }) => isDealer);
      const playerIndex = state.findIndex(({ inTheGun }) => inTheGun);

      let foundDealer = false;

      state[dealerIndex].isDealer = false;
      state[playerIndex].inTheGun = false;

      for (var i = 0; i < state.length; i++) {
        const pointer = (i + dealerIndex + 1) % state.length;
        const player = state[pointer];

        if (!foundDealer) {
          player.isDealer = true;
          foundDealer = true;
          continue;
        }

        if (
          player.status !== "out" &&
          player.status !== "fold" &&
          player.balance
        ) {
          player.inTheGun = true;
          break;
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addPlayer,
  removePlayer,
  reorderPlayers,
  updatePlayer,
  resetPlayers,
  nextDealer,
  bet,
  startGame
} = playersSlice.actions;

export default playersSlice.reducer;
