import { combineReducers, configureStore, } from '@reduxjs/toolkit';

// Slices
import deviceReducer from './slices/deviceSlice';
import deviceDataReducer from './slices/deviceDataSlice';
import gpsReducer from './slices/gpsSlice';
import beaconReducer from './slices/beaconSlice';
import bluetoothDataReducer from './slices/bluetoothDataSlice';
import bluetoothCommandReducer from './slices/bluetoothCommandSlice';
import deviceSettingsReducer from './slices/deviceSettingsSlice';
import deviceFilesReducer from './slices/deviceFilesSlice';
import downloadFilesReducer from './slices/fileDownloadSlice';

// Middlewares
import { logDataMiddleware } from './middleware/logDataMiddleware';
import { discoverDeviceMiddleware } from './middleware/Bluetooth/BluetoothBeaconMiddleware';

const rootReducer = combineReducers({
    deviceSlice: deviceReducer,
    deviceDataSlice: deviceDataReducer,
    gpsSlice: gpsReducer,
    beaconSlice: beaconReducer,
    bluetoothDataSlice: bluetoothDataReducer,
    bluetoothCommandSlice: bluetoothCommandReducer,
    deviceSettingsSlice: deviceSettingsReducer,
    deviceFilesSlice: deviceFilesReducer,
    downloadFilesSlice: downloadFilesReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
    }), logDataMiddleware, discoverDeviceMiddleware],
})

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// Fix circular reference
export type RootState = ReturnType<typeof rootReducer>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;