export const UPDATE_LOGIN_FORM = "UPDATE_LOGIN_FORM";
export const RESET_LOGIN_FORM = "RESET_LOGIN_FORM";
export const SET_LOGIN_ERRORS = "SET_LOGIN_ERRORS";
export const SET_LOGIN_LOADING = "SET_LOGIN_LOADING";

export const updateLoginForm = (field, value) => ({
    type: UPDATE_LOGIN_FORM,
    payload: { field, value },
});

export const resetLoginForm = () => ({
    type: RESET_LOGIN_FORM,
});

export const setLoginErrors = (errors) => ({
    type: SET_LOGIN_ERRORS,
    payload: errors,
});

export const setLoginLoading = (isLoading) => ({
    type: SET_LOGIN_LOADING,
    payload: isLoading,
});