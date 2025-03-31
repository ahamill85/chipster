import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //game vars
  maxReraise: 1,
  maxRounds: 4,
  gameState: null,
  //betting vars
  ante: 0,
  smallBlind: 1,
  bigBlind: 2,
  increment: 1,
  minBet: 0,
  startingBalance: 100,
  limitType: "none",
  //dealer vars
  playerDealer: true,
  rotatingDealer: true,
  startingDealer: 0,
};

export const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    updateOptions: (state, { payload }) => {
      Object.entries(payload).forEach(([key, value]) => (state[key] = value));
    },
    incrementOption: (state, { payload: { key, value } }) => {
      state[key] += value;
    },
  },
});

export const { updateOptions, incrementOption } = optionsSlice.actions;

export default optionsSlice.reducer;
