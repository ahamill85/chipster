import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //game vars
  maxReraise: 1,
  maxRounds: 4,
  //betting vars
  ante: 0,
  smallBlind: 0,
  bigBlind: 0,
  increment: 1,
  startingBalance: 100,
  //dealer vars
  rotatingDealer: false,
  startingDealer: 0,
  playerDealer: false,
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
