import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCrimeMonthlySummary = createAsyncThunk('fetchCrimeMonthlySummary', async (coords) => {

  const lat = coords[0];
  const lng = coords[1];
  const response = await axios.get(`http://127.0.0.1:8000/crimewatch/monthly-summary/${lat}&${lng}`);
  const data = await response.data;
  
  return data;

});

const crimeMonthlySummarySlice = createSlice({
  name: 'crimeMonthlySummary',
  initialState: {
    data: '',
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCrimeMonthlySummary.pending, (state) => {
      state.status = 'loading';
    });

    builder.addCase(fetchCrimeMonthlySummary.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = 'fulfilled';
    });

    builder.addCase(fetchCrimeMonthlySummary.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = action.payload;
    });
  },
});

export default crimeMonthlySummarySlice.reducer;
