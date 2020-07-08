import {
  LOADING_UI,
  SET_ERRORS,
  POST_MENTION,
  CLEAR_ERRORS,
  SET_MENTIONS,
  LOADING_DATA,
  LIKE_MENTION,
  // UNLIKE_MENTION,
} from "../types";
import axios from "axios";

export const getMentions = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/mentions")
    .then((res) => {
      dispatch({
        type: SET_MENTIONS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_MENTIONS,
        payload: err.response.data,
      });
    });
};

export const likeMention = (mentionId) => (dispatch) => {
  axios
    .get(`/mentions/${mentionId}/like`)
    .then((res) => {
      dispatch({
        type: LIKE_MENTION,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// unlike scream 24 5

export const postMention = (newMention) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/mentions", newMention)
    .then((res) => {
      dispatch({
        type: POST_MENTION,
        payload: res.data,
      });
      dispatch({
        type: CLEAR_ERRORS,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};
