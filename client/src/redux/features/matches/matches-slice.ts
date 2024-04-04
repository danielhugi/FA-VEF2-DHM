import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWithCredentials } from "../../../utilities/fetch-utilities";
import { Match } from "../../../types/match";

export const getMatches = createAsyncThunk("matches/getMatches", async () => {
  const response = await fetchWithCredentials("matches");
  const data = (await response.json()) as Match[];
  return data;
});

type MatchesState = {
  status: "loading" | "idle";
  error: string | null;
  matches: Match[];
};

const initialState: MatchesState = {
  matches: [],
  error: null,
  status: "idle",
};

export const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    setMatches: (state, action) => {
      state.matches = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getMatches.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });

    builder.addCase(getMatches.fulfilled, (state, { payload }) => {
      state.matches = payload;
      state.status = "idle";
    });

    builder.addCase(getMatches.rejected, (state, { payload }) => {
      if (payload) {
        state.error = "Could not retrieve matches";
      }
      state.status = "idle";
    });
  },
});

export const { setMatches } = matchesSlice.actions;

export default matchesSlice.reducer;