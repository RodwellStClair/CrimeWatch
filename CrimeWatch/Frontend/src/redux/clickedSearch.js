import { createSlice } from '@reduxjs/toolkit';

export const clickedSearch = createSlice({
  name: 'Search',
  initialState: {
    Search: false,
  },
  reducers: {
    setClickedSearch: (state, action) => {

      if (action.payload === true) {
        state.Search = true;
      } else {
        state.Search = false;
      }
    },
  },
});

export const { setClickedSearch } = clickedSearch.actions;

export default clickedSearch.reducer;
