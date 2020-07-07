import {
  POST_MENTION,
  SET_MENTIONS,
  LIKE_MENTION,
  LOADING_DATA,
} from "../types";

const initialState = {
  mentions: [],
  mention: {},
  loading: false,
  errors: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_MENTIONS:
      return {
        ...state,
        mentions: action.payload, //payload defined in dataActions.js getMentions
        loading: false,
      };
    case LIKE_MENTION:
      let index = state.mentions.findIndex(
        (mention) => mention.mentionId === action.payload.mentionId
      );
      state.mentions[index] = action.payload;
      if (state.mention.mentionId === action.payload.mentionId) {
        state.mention = action.payload;
      }
      return {
        ...state,
      };
    case POST_MENTION:
      return {
        ...state,
        mentions: [action.payload, ...state.mentions],
      };
    default:
      return state;
  }
}
