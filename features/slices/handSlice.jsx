import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dealerIndex: 0,
  startingPlayerIndex: 1,
  activePlayerIndex: 1,
  callAmount: 0,
  potAmount: 0,
  roundCount: 1,
};

export const handSlice = createSlice({
  name: "hand",
  initialState,
  reducers: {
    updateActivePlayer: (state, action) => {
      state.activePlayerIndex =
        state.activePlayerIndex === action.payload - 1
          ? 0
          : state.activePlayerIndex + 1;
      if (state.activePlayerIndex === state.startingPlayerIndex)
        state.roundCount += 1;
    },
    updateCallAmount: (state, action) => {
      state.callAmount = action.payload;
    },
    updatePotAmount: (state, action) => {
      state.potAmount += action.payload;
    },
    incrementRoundCount: (state) => {
      state.roundCount += 1;
    },
  },
});

export const {
  updateActivePlayer,
  updateCallAmount,
  updatePotAmount,
  incrementRoundCount,
} = handSlice.actions;

export default handSlice.reducer;
