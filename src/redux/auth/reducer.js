import actions from "./actions";

const initState = {
  idToken: null,
  user: null,
  is_refreshing: false,
};

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.LOGIN_REQUEST:
      return {
        ...state,
        is_refreshing: true
      };
    case actions.CHECK_AUTHORIZATION:
      return {
        ...state,
        is_refreshing: true
      };
    case actions.LOGIN_SUCCESS:
      return {
        idToken: action.token,
        user: action.user,
        is_refreshing: false,
      };
    case actions.LOGIN_ERROR:
      return {
        ...state,
        is_refreshing: false,
      };
    case actions.LOGOUT:
      return initState;
    default:
      return state;
  }
}
