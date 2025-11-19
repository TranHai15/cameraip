import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isAuthenticated, getUser, getToken } from "./utils/auth";
import authActions from "./redux/auth/actions";
import Login from "./components/Login";
import CheckinOut from "./components/CheckinOut";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.Auth);

  useEffect(() => {
    // Kiểm tra nếu đã đăng nhập từ trước (có token trong localStorage)
    if (isAuthenticated() && !authState.idToken) {
      const user = getUser();
      const { accessToken } = getToken();

      if (user && accessToken) {
        dispatch(authActions.loginSuccess(user, accessToken));
      }
    }
  }, [dispatch, authState.idToken]);

  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <ProtectedRoute exact path="/checkin" component={CheckinOut} />
        <ProtectedRoute exact path="/" component={CheckinOut} />
        <Redirect to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
