import { configureStore } from "@reduxjs/toolkit";
import playersSlice from "@/features/slices/playersSlice";
import gameSlice from "@/features/slices/gameSlice";
import handSlice from "@/features/slices/handSlice";

export const store = configureStore({
  reducer: {
    players: playersSlice,
    game: gameSlice,
    hand: handSlice,
  },
});
