// import { createStore, combineReducers } from "redux";
// import loginReducer from "./reducer";
// import { compose } from "redux";

// const rootReducer = combineReducers({
//     login: loginReducer,
// });

// const composeEnhancers =
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const store = createStore(
//     rootReducer,
//     composeEnhancers()
// );

// export default store;

// import { createStore, combineReducers, applyMiddleware } from "redux";
// import {loginReducer} from "./reducer";
// import { compose } from "redux";
// import {profileReducer} from "./reducer";
// import { thunk } from "redux-thunk";

// const rootReducer = combineReducers({
//     login: loginReducer,
//     profile: profileReducer,
// });

// const composeEnhancers =
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const store = createStore(
//     rootReducer,
//     composeEnhancers(applyMiddleware(thunk))
// );

// export default store;


import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { loginReducer } from "./reducer";
import { profileReducer } from "./profileReducer";
import {thunk} from "redux-thunk";
import {reducer as formReducer} from "redux-form";

const rootReducer = combineReducers({
  login: loginReducer,
  profile: profileReducer,
  form: formReducer,
});

const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;