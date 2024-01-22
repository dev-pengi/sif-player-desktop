import { combineReducers, configureStore } from '@reduxjs/toolkit'

import playerSlice from './slices/playerSlice';
import volumeSlice from './slices/volumeSlice';
import timerSlice from './slices/timerSlice';
import controlsSlice from './slices/controlsSlice';
import settingsSlice from './slices/settingsSlice';
import explorerSlice from './slices/explorerSlice';

const rootReducer = combineReducers({
    player: playerSlice.reducer,
    volume: volumeSlice.reducer,
    timer: timerSlice.reducer,
    controls: controlsSlice.reducer,
    settings: settingsSlice.reducer,
    explorer: explorerSlice.reducer,
})
const store = configureStore({
    reducer: rootReducer
})

export { store };
export const volumeActions = volumeSlice.actions;
export const playerActions = playerSlice.actions;
export const timerActions = timerSlice.actions;
export const controlsActions = controlsSlice.actions;
export const settingsActions = settingsSlice.actions;
export const explorerActions = explorerSlice.actions;

export type RootState = ReturnType<typeof rootReducer>;