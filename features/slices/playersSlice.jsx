import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    id: 1,
    name: "Raphael",
    currentBet: 0,
    folded: false,
    balance: 100,
    avatar: null,
  },
  {
    id: 11,
    name: "Aquila",
    currentBet: 0,
    folded: false,
    balance: 100,
    avatar: null,
  },
  {
    id: 21,
    name: "Geraldine",
    currentBet: 0,
    folded: false,
    balance: 100,
    avatar: null,
  },
];

export const playersSlice = createSlice({
  name: "players",
  initialState: initialState,
  reducers: {
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
      const player = state[action.payload.index];
      state[action.payload.index] = { ...player, ...action.payload };
    },
  },
});

export const playerSlice = createSlice({
  name: "player",
  initialState: initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    addChips: (state, action) => {
      state.chips += action.payload;
    },
    removeChips: (state, action) => {
      state.chips -= action.payload;
    },
    setHand: (state, action) => {
      state.hand = action.payload;
    },
    fold: (state) => {
      state.isInGame = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addPlayer,
  removePlayer,
  reorderPlayers,
  updatePlayer,
} = playersSlice.actions;

export const { setName, addChips, removeChips, setHand, fold, resetGame } =
  playerSlice.actions;

export default playersSlice.reducer;
