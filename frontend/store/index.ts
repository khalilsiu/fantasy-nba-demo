import { Action, AnyAction, combineReducers, configureStore, ThunkAction } from "@reduxjs/toolkit"
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { league } from "./leagueSlice";
import { toast } from "./toastSlice";

const combinedReducer = combineReducers({
    league,
    toast,
});


const reducer = (state: ReturnType<typeof combinedReducer>, action: AnyAction) => {
    if (action.type === HYDRATE) {
        const nextState = {
            ...state, // use previous state
            ...action.payload, // apply delta from hydration
        };
        return nextState;
    } else {
        return combinedReducer(state, action);
    }
};

// config the store 
const makeStore = () => configureStore({
    reducer
})

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];
export type RootState = ReturnType<typeof combinedReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);