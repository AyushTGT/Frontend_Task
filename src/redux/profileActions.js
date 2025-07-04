// Actions and thunk for profile state
import Cookies from "js-cookie";

export const FETCH_PROFILE_REQUEST = "FETCH_PROFILE_REQUEST";
export const FETCH_PROFILE_SUCCESS = "FETCH_PROFILE_SUCCESS";
export const FETCH_PROFILE_FAILURE = "FETCH_PROFILE_FAILURE";
export const CLEAR_PROFILE = "CLEAR_PROFILE";

// Action creators
export const fetchProfileRequest = () => ({
  type: FETCH_PROFILE_REQUEST,
});

export const fetchProfileSuccess = (profile) => ({
  type: FETCH_PROFILE_SUCCESS,
  payload: profile,
});

export const fetchProfileFailure = (error) => ({
  type: FETCH_PROFILE_FAILURE,
  payload: error,
});

export const clearProfile = () => ({
  type: CLEAR_PROFILE,
});

// Thunk for async profile fetch
export const fetchProfile = () => async (dispatch) => {
  dispatch(fetchProfileRequest());
  try {
    const token = Cookies.get("jwt_token");
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/me`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch profile");
    const data = await res.json();
    dispatch(fetchProfileSuccess(data));
  } catch (error) {
    dispatch(fetchProfileFailure(error.message));
  }
};