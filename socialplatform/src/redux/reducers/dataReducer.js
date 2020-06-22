import { POST_MENTION } from "../types";

const initialState = {
  loading: false,
  errors: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case POST_MENTION:
      return {
        ...state,
        mentions: [action.payload, ...state.mentions],
      };
    default:
      return state;
  }
}
