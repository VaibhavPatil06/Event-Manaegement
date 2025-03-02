import { createSlice } from '@reduxjs/toolkit';
import {  EventsState } from '../../types';

const initialState: EventsState = {
  id:"",
 title:"",
 description:"",
 date:"",
 location: "",
 image: "",
 update:false,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setId:(state,action)=>{
      state.id = action.payload;
    },
    setTitle:(state,action)=>{
      state.title = action.payload;
    },
    setDescription:(state,action)=>{
      state.description = action.payload;
    },
    setDate:(state,action)=>{
      state.date = action.payload;
    },
    setLocation:(state,action)=>{
      state.location = action.payload;
    },
    setImage:(state,action)=>{
      state.image = action.payload;
    },
    setUpdate:(state,action)=>{
      state.update = action.payload;
    },

  }
});

export const {
setId,
  setTitle,
  setDescription,
  setDate,
  setLocation,
  setImage,
  setUpdate
} = eventsSlice.actions;


export default eventsSlice.reducer;