import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    duration: 0,
    currentTime: 0,
    buffered: 0,
    timePercentage: 0,
}

const timerSlice = createSlice({
    name: "timer",
    initialState: initialState,
    reducers: {
        init(state, action) {
            state.duration = action.payload;
        },
        update(state, action) {
            state.currentTime = action.payload;
            if (state.duration > 0) {
                state.timePercentage = (state.currentTime / state.duration);
            } else {
                state.timePercentage = 0;
            }
        },
        buffer(state, action) {
            state.buffered = action.payload
        },
        reset(state) {
            return initialState;
        }
    },
})

export default timerSlice;