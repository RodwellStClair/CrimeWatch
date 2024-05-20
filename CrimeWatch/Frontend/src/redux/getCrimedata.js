import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCrimedata = createAsyncThunk('fetchCrimedata', async (coords) => {
  const lat = coords[0];
  const lng = coords[1];
  const response = await axios.get(`http://127.0.0.1:8000/crimewatch/reports/${lat}&${lng}`);
  const data = await response.data;
  return data || null;
});

const crimedataSlice = createSlice({
  name: 'crimedata',
  initialState: {
    data: '',
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCrimedata.pending, (state) => {
      state.status = 'pending';
    });

    builder.addCase(fetchCrimedata.fulfilled, (state, action) => {
      
      state.data = action.payload;
      state.status = 'fulfilled';
    });

    builder.addCase(fetchCrimedata.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

export default crimedataSlice.reducer;
