
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
 
import rootReducer from './rootReducers.jsx'
 


const persistConfig = {
  key: 'root',
  storage,
}
 
const persistedReducer = persistReducer(persistConfig, rootReducer) 
 


const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;