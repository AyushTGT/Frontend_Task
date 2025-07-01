import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  CLEAR_PROFILE,
} from "./profileActions";

const initialState = {
  myProfile: null,
  loading: false,
  error: null,
};

export function profileReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_PROFILE_SUCCESS:
      return { ...state, loading: false, myProfile: action.payload };
    case FETCH_PROFILE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case CLEAR_PROFILE:
      return { ...state, myProfile: null };
    default:
      return state;
  }
}