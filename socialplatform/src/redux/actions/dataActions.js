import { LOADING_UI, SET_ERRORS, POST_MENTION, CLEAR_ERRORS } from "../types";
import axios from "axios";
import { SET_ERRORS } from "../types";

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
