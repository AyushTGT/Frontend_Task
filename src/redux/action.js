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

// export const UPDATE_LOGIN_FORM = "UPDATE_LOGIN_FORM";
// export const RESET_LOGIN_FORM = "RESET_LOGIN_FORM";
// export const SET_LOGIN_ERRORS = "SET_LOGIN_ERRORS";
// export const SET_LOGIN_LOADING = "SET_LOGIN_LOADING";

// export const updateLoginForm = (field, value) => ({
//     type: UPDATE_LOGIN_FORM,
//     payload: { field, value },
// });

// export const resetLoginForm = () => ({
//     type: RESET_LOGIN_FORM,
// });

// export const setLoginErrors = (errors) => ({
//     type: SET_LOGIN_ERRORS,
//     payload: errors,
// });

// export const setLoginLoading = (isLoading) => ({
//     type: SET_LOGIN_LOADING,
//     payload: isLoading,
// });

// // Actions for Profile
// export const FETCH_PROFILE_REQUEST = "FETCH_PROFILE_REQUEST";
// export const FETCH_PROFILE_SUCCESS = "FETCH_PROFILE_SUCCESS";
// export const FETCH_PROFILE_FAILURE = "FETCH_PROFILE_FAILURE";
// export const CLEAR_PROFILE = "CLEAR_PROFILE";

// export const fetchProfileRequest = () => ({
//   type: FETCH_PROFILE_REQUEST,
// });

// export const fetchProfileSuccess = (profile) => ({
//   type: FETCH_PROFILE_SUCCESS,
//   payload: profile,
// });

// export const fetchProfileFailure = (error) => ({
//   type: FETCH_PROFILE_FAILURE,
//   payload: error,
// });

// export const clearProfile = () => ({
//   type: CLEAR_PROFILE,
// });

// // Thunk action (async)
// export const fetchProfile = () => async (dispatch) => {
//   dispatch(fetchProfileRequest());
//   try {
//     const token = window.Cookies.get("jwt_token");
    
//     const res = await fetch(`http://localhost:8000/me`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if (!res.ok) throw new Error("Failed to fetch profile");
//     const data = await res.json();
//     dispatch(fetchProfileSuccess(data));
//   } catch (error) {
//     dispatch(fetchProfileFailure(error.message));
//   }
// };