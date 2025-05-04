import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authReducer from "./auth.slice";
import businessReducer from "./businessForm.slice";
import trendReducer from "./trend.slice";
import notificationReducer from "./notification.slice";
import videoReducer from "./video.slice";

const appReducer = combineReducers({
  auth: authReducer,
  businessForm: businessReducer,
  trends: trendReducer,
  notification: notificationReducer,
  video: videoReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "RESET_APP") {
    storage.removeItem("persist:root");
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
