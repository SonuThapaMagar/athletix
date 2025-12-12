import { configureStore } from "@reduxjs/toolkit";
import reducers from "@/redux/slices"; 

export const store = configureStore({
    reducer: reducers,
});

export const AppDispatch = store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
