const actions = {
  CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGOUT: 'LOGOUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  checkAuthorization: () => ({
    type: actions.CHECK_AUTHORIZATION
  }),
  login: (dataLogin) => ({
    type: actions.LOGIN_REQUEST,
    payload: { dataLogin }
  }),
  loginSuccess: (user, token) => ({
    type: actions.LOGIN_SUCCESS,
    user,
    token
  }),
  loginError: (error) => ({
    type: actions.LOGIN_ERROR,
    error
  }),
  logout: () => ({
    type: actions.LOGOUT
  })
};

export default actions;
