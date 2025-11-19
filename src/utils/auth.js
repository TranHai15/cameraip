// Auth utility functions

export const clearToken = () => {
  localStorage.removeItem('user_id');
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
};

export const getToken = () => {
  try {
    const userId = localStorage.getItem("user_id");
    const accessToken = localStorage.getItem("access_token");
    return { userId, accessToken };
  } catch (err) {
    clearToken();
    return { userId: null, accessToken: null };
  }
};

export const isAuthenticated = () => {
  const { userId, accessToken } = getToken();
  return !!(userId && accessToken);
};

export const saveAuthData = (user, token) => {
  localStorage.setItem('user_id', user.NguoiDungID);
  localStorage.setItem('access_token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

