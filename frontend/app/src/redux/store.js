import { configureStore } from '@reduxjs/toolkit';
import alertReducer from './features/alertSlice';
import { authSlice } from './features/authSlice/authSlice';

const store = configureStore({
    reducer: {
        alerts: alertReducer,
        auth: authSlice.reducer,
    },
    devTools: false
});

export default store;
