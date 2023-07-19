import { combineReducers, configureStore, } from '@reduxjs/toolkit';

// Slices
import deviceReducer from './slices/deviceSlice';
import deviceDataReducer from './slices/deviceDataSlice';
import gpsReducer from './slices/gpsSlice';

// Middlewares
import { logDataMiddleware } from './middleware/logDataMiddleware';

const rootReducer = combineReducers({
    deviceSlice: deviceReducer,
    deviceDataSlice: deviceDataReducer,
    gpsSlice: gpsReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), logDataMiddleware],
})

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// Fix circular reference
export type RootState = ReturnType<typeof rootReducer>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;