import { configureStore } from "@reduxjs/toolkit";
import playersSlice from "@/features/slices/playersSlice";
import optionsSlice from "@/features/slices/optionsSlice";

export const store = configureStore({
  reducer: {
    players: playersSlice,
    options: optionsSlice,
  },
});
