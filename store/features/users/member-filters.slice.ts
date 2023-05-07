import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Topic } from "@store/features/topics";
import { RootState } from "@store/store-config/store";
import { Id } from "@app/declarations";
import memberFiltersInitialState from "./member-filters.initial-state";

const memberFiltersSlice = createSlice({
  name: "memberFilters",
  initialState: memberFiltersInitialState,
  reducers: {
    addTopic: (state, { payload }: PayloadAction<Topic>) => {
      const isAlreadyAdded = state.topics.find(
        (topic) => topic.id === payload.id
      );

      if (!isAlreadyAdded) {
        state.topics.push(payload);
      }
    },
    removeTopic: (state, { payload }: PayloadAction<Id>) => {
      state.topics = state.topics.filter((topic) => topic.id !== payload);
    },
    setSearch: (state, { payload }: PayloadAction<string>) => {
      state.search = payload;
    },
    setOrderBy: (state, { payload }: PayloadAction<"rating" | "activity">) => {
      state.orderBy = payload;
    },
  },
});

export const { addTopic, removeTopic, setSearch, setOrderBy } =
  memberFiltersSlice.actions;

export const selectTopicsFilter = (state: RootState) =>
  state.memberFilters.topics;
export const selectSearchFilter = (state: RootState) =>
  state.memberFilters.search;
export const selectOrderBy = (state: RootState) => state.memberFilters.orderBy;

export default memberFiltersSlice.reducer;
