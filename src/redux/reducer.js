import { UPDATE_LOGIN_FORM, RESET_LOGIN_FORM, SET_LOGIN_ERRORS,SET_LOGIN_LOADING } from "./action";

const initialState = {
    form: {
        email: "",
        password: "",
        recaptchaToken: "",
        rememberMe: false,
    },
    errors: {},
    isLoading: false,
};

export function loginReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_LOGIN_FORM:
            return {
                ...state,
                form: {
                    ...state.form,
                    [action.payload.field]: action.payload.value,
                },
            };
        case RESET_LOGIN_FORM:
            return {
                ...state,
                form: initialState.form,
                errors: {},
            };
        case SET_LOGIN_ERRORS:
            return {
                ...state,
                errors: action.payload,
            };
        case SET_LOGIN_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            };
        default:
            return state;
    }
}

// import { UPDATE_LOGIN_FORM, RESET_LOGIN_FORM, SET_LOGIN_ERRORS,SET_LOGIN_LOADING } from "./action";

// import {
//   FETCH_PROFILE_REQUEST,
//   FETCH_PROFILE_SUCCESS,
//   FETCH_PROFILE_FAILURE,
//   CLEAR_PROFILE,
// } from "./action";

// const initialStateForm = {
//     form: {
//         email: "",
//         password: "",
//     },
//     errors: {},
//     isLoading: false,
// };

// const initialState = {
//   myProfile: null,
//   loading: false,
//   error: null,
// };

// export function profileReducer(state = initialState, action) {
//   switch (action.type) {
//     case FETCH_PROFILE_REQUEST:
//       return { ...state, loading: true, error: null };
//     case FETCH_PROFILE_SUCCESS:
//       return { ...state, loading: false, myProfile: action.payload };
//     case FETCH_PROFILE_FAILURE:
//       return { ...state, loading: false, error: action.payload };
//     case CLEAR_PROFILE:
//       return { ...state, myProfile: null };
//     default:
//       return state;
//   }
// }

// export function loginReducer(state = initialStateForm, action) {
//     switch (action.type) {
//         case UPDATE_LOGIN_FORM:
//             return {
//                 ...state,
//                 form: {
//                     ...state.form,
//                     [action.payload.field]: action.payload.value,
//                 },
//             };
//         case RESET_LOGIN_FORM:
//             return {
//                 ...state,
//                 form: initialState.form,
//                 errors: {},
//             };
//         case SET_LOGIN_ERRORS:
//             return {
//                 ...state,
//                 errors: action.payload,
//             };
//         case SET_LOGIN_LOADING:
//             return {
//                 ...state,
//                 isLoading: action.payload,
//             };
//         default:
//             return state;
//     }
// }