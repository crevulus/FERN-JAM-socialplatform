import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_MENTION,
} from "../types";
import axios from "axios";

const initialState = {
  authenticated: false,
  credentials: {},
  likes: [],
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload, // binds API values to values in initialState
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case LIKE_MENTION:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentials.userHandle,
            mentionId: action.payload.mentionId,
          },
        ],
      };
    default:
      return state; // state set to initialState as default arg
  }
}
