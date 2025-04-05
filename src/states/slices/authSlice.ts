import {createSlice, PayloadAction, Slice} from "@reduxjs/toolkit"

export interface Stats {
    questions_submitted?: number;
    questions_created?: number;
    blogs_created?: number;
    challenges_created?: number;
    challenges_taken?: number;
}

interface User {
    id: string
    name: string;
    email: string;
    username: string;
    stats?: Stats
    createdAt: string
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
        setUser: (state: AuthState, action: PayloadAction<User>) => {
            state.user = action.payload
        },
        removeUser: (state: AuthState) => {
            state.user = null
        },
        updateStats: (state: AuthState, action: PayloadAction<Stats>) => {
            if(state.user) {
                if(!state.user.stats) {
                    state.user.stats = {}
                }

                const updatedStats = action.payload;
                for(const key in updatedStats) {
                    const k = key as keyof Stats;
                    const v = updatedStats[k];

                    if(typeof v === 'number') {
                        if(!state.user.stats[k]) {
                            state.user.stats[k] = v;
                        } else {
                            state.user.stats[k] = state.user.stats[k] + v
                        }
                    }
                }

                // Also update localStorage if you're using it for persistence
                window.localStorage.setItem("user", JSON.stringify(state.user));
            }
        }
    }
})

export const {setUser, removeUser, updateStats} = authSlice.actions
export default authSlice.reducer