import {configureStore, Store} from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"

export const store: Store = configureStore({
    reducer: {
        authSlice: authReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch