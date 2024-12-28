import {createSlice, PayloadAction, Slice} from "@reduxjs/toolkit"

interface User {
    name: string;
    email: string;
    password: string;
}

interface AuthState {
    user: User | null;
}

const initialState: AuthState = {
    user: JSON.parse(window.localStorage.getItem("user") as string) || null
}

export const authSlice: Slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },
        removeUser: (state) => {
            state.user = null
        }
    }
})

export const {setUser, removeUser} = authSlice.actions
export default authSlice.reducer