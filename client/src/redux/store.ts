import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/user-slice";
import matchReducer from "./features/matches/matches-slice";
import matchStateReducer from "./features/match-state/match-state-slice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        match: matchReducer,
        matchState: matchStateReducer,
    },
});

export type IRootState = ReturnType<typeof store.getState>;