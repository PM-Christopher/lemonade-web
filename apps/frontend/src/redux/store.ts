import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from "redux-persist";
import storage from "redux-persist/lib/storage";

// reducers
import authReducer from "@/features/authentication/authSlice";
import eventReducer from "@/features/events/event.slice"
import tempReducer from "./tempSlice";
import toastifyReducer from "./toastifySlice"
import generalReducer from "./general.slice"

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "event"], // Only persist the 'auth' slice
};

const reducers = combineReducers({
    auth: authReducer,
    temp: tempReducer,
    toast: toastifyReducer,
    event: eventReducer,
    general: generalReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        }
    })
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;