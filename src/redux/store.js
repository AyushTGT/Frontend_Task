import { createStore, combineReducers } from "redux";
import loginReducer from "./reducer";
import { compose } from "redux";

const rootReducer = combineReducers({
    login: loginReducer,
});

const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    composeEnhancers()
);

export default store;