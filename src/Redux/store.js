import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { reducer } from "./reducer";


let rootReducer=combineReducers({reducer});

export const store=legacy_createStore(rootReducer,applyMiddleware(thunk));