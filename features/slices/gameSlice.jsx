import { createSlice } from "@reduxjs/toolkit";

export const gameSlice = createSlice({
  name: "game",
  initialState: null,
  reducers: {
    newGame: (state, action) => action.payload,
    nextPlayer: (state, action) => {
      state.activePlayer += 1;
    },
    nextGame: (state, action) => {
      state.activePlayer += 1;
    },
    playerBet: (state, action) => {
      return state.filter(({ id }) => id !== action.payload);
    },
  },
});

export const { newGame, nextPlayer, playerBet } = gameSlice.actions;

export default gameSlice.reducer;
