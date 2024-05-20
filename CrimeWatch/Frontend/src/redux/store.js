import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './updateSearch';
import crimedataReducer from './getCrimedata';
import crimeMonthlySummaryReducer from './getCrimeMonthlySummary';
import clickedSearchReducer from './clickedSearch';

const store = configureStore({
  reducer: {
    search: searchReducer,
    crimedata: crimedataReducer,
    crimeMonthlySummary: crimeMonthlySummaryReducer,
    clickedSearch: clickedSearchReducer,
  },
});

export default store;
