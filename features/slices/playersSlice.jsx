import { createSlice } from "@reduxjs/toolkit";

export const playersSlice = createSlice({
  name: "players",
  initialState: [
    {
      avatar: null,
      balance: 100,
      bets: [0],
      id: "F57C8277-585D-4327-88A6-B5689FF69DFE",
      inTheGun: false,
      isDealer: false,
      name: "Anna Haro",
      status: "ready",
    },
    {
      avatar: null,
      balance: 99,
      bets: [1],
      id: "AB211C5F-9EC9-429F-9466-B9382FF61035",
      inTheGun: false,
      isDealer: false,
      name: "Daniel Higgins",
      status: "ready",
    },
    {
      avatar: null,
      balance: 98,
      bets: [2],
      id: "E94CD15C-7964-4A9B-8AC4-10D7CFB791FD",
      inTheGun: false,
      isDealer: false,
      name: "David Taylor",
      status: "ready",
    },
    {
      avatar: null,
      balance: 100,
      bets: [0],
      id: "2E73EE73-C03F-4D5F-B1E8-44E85A70F170",
      inTheGun: true,
      isDealer: false,
      name: "Hank Zakroff",
      status: "ready",
    },
    {
      avatar: null,
      balance: 100,
      bets: [0],
      id: "410FE041-5C4E-48DA-B4DE-04C15EA3DBAC",
      inTheGun: false,
      isDealer: false,
      name: "John Appleseed",
      status: "ready",
    },
    {
      avatar: null,
      balance: 100,
      bets: [0],
      id: "177C371E-701D-42F8-A03B-C61CA31627F6",
      inTheGun: false,
      isDealer: false,
      name: "Kate Bell",
      status: "ready",
    },
    {
      avatar: null,
      balance: 100,
      bets: [0],
      id: "177C371E-701D-42F8-A03B-wqewqrweqrewr",
      inTheGun: false,
      isDealer: false,
      name: "Joe Dirt",
      status: "ready",
    },
    {
      avatar: null,
      balance: 100,
      bets: [0],
      id: "177C371E-701D-42F8-A03B-tryurtyurtyu",
      inTheGun: false,
      isDealer: false,
      name: "Bart Simpson",
      status: "ready",
    },
    {
      avatar: null,
      balance: 100,
      bets: [0],
      id: "177C371E-701D-42F8-A03B-gjhgjhfghjfgh",
      inTheGun: false,
      isDealer: false,
      name: "Keanu Reeves",
      status: "ready",
    },
    {
      avatar: null,
      balance: 100,
      bets: [0],
      id: "177C371E-701D-42F8-A03B-asdfasdfasdf",
      inTheGun: false,
      isDealer: false,
      name: "The Dude",
      status: "ready",
    },
  ],
  reducers: {
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
    resetPlayers: (state) =>
      state.map((player) => ({
        ...player,
        currentBet: null,
        folded: !player.balance,
        status: !player.balance ? "out" : "ready",
      })),
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
