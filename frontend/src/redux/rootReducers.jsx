import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice.jsx';



const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;