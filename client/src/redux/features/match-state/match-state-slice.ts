import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Match } from '../../../types/match';


interface MatchState {
  currentQuestionIndex: number;
  timer: number;
  match: Match | null;
}

const initialState: MatchState = {
  currentQuestionIndex: 0,
  timer: 10,
  match: null,
};


export const matchStateSlice = createSlice({
  name: 'matchState',
  initialState,
  reducers: {
    setMatch: (state, action: PayloadAction<Match>) => {
      state.match = action.payload;
    },
    setTimer: (state, action: PayloadAction<number>) => {
      state.timer = action.payload;
    },
    nextQuestion: (state) => {
      if (state.match) {
        state.currentQuestionIndex += 1;
        state.timer = 10;
      }
    },
    resetMatchState: () => initialState,
  },
});

export const { setMatch, setTimer, nextQuestion, resetMatchState } = matchStateSlice.actions;

export default matchStateSlice.reducer;
