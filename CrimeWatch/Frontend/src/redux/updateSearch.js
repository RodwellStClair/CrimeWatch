import { createSlice } from '@reduxjs/toolkit';

export const updateSearch = createSlice({
  name: 'updateSearch',
  initialState: {
    coordinates: '',
  },
  reducers: {
    getSearch: (state, action) => {
      if (!JSON.parse(sessionStorage.getItem('startCoordinates'))) {
        sessionStorage.setItem('startCoordinates', JSON.stringify([50.095, 0.9771]));
      }
      state.coordinates = action.payload;
    },
  },
});

export const { getSearch } = updateSearch.actions;
export default updateSearch.reducer;
