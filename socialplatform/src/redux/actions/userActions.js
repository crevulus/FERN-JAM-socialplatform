import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI } from "../types";
import axios from "axios";

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then((res) => {
      console.log(res.data);
      localStorage.setItem("firebaseIdToken", `Bearer ${res.data.token}`);
      this.setState({
        loading: false,
      });
      // every time we send a req with axios it will have a an auth header with our token
      axios.defaults.common["Authorization"] = `Bearer ${res.data.token}`;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      // redirect to home
      history.push("/");
    })
    .catch((err) => {
      console.log("got into catch before dispatch");
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const getUserData = () => (dispatch) => {
  axios
    .get("/user")
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data, // data sent to reducer
      });
    })
    .catch((err) => console.log(err));
};
