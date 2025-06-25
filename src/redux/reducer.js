import { UPDATE_LOGIN_FORM, RESET_LOGIN_FORM, SET_LOGIN_ERRORS,SET_LOGIN_LOADING } from "./action";

const initialState = {
    form: {
        email: "",
        password: "",
    },
    errors: {},
    isLoading: false,
};

export default function loginReducer(state = initialState, action) {
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