import {configureStore, Store} from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import { blogApi } from "./apis/blogApi"
import { questionApi } from "./apis/questionApi"

export const store: Store = configureStore({
    reducer: {
        authSlice: authReducer,
        [blogApi.reducerPath]: blogApi.reducer,
        [questionApi.reducerPath]: questionApi.reducer,
    },
    middleware: (getDeaultMiddleware) => getDeaultMiddleware().concat(blogApi.middleware, questionApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch