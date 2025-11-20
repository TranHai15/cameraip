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
    console.log("🚀 [APP_INIT] Ứng dụng checkin được khởi tạo");

    // Kiểm tra nếu đã đăng nhập từ trước (có token trong localStorage)
    console.log("🔍 [APP_INIT] Kiểm tra trạng thái đăng nhập...");
    if (isAuthenticated()) {
      console.log("✅ [APP_INIT] Đã tìm thấy token xác thực");
      if (!authState.idToken) {
        console.log("🔄 [APP_INIT] Chưa có idToken trong Redux, đang khôi phục...");
        const user = getUser();
        const { accessToken } = getToken();

        if (user && accessToken) {
          console.log("✅ [APP_INIT] Khôi phục thông tin user:", {
            username: user.username,
            email: user.email,
            hasAccessToken: !!accessToken
          });
          dispatch(authActions.loginSuccess(user, accessToken));
          console.log("✅ [APP_INIT] Đã khôi phục trạng thái đăng nhập thành công");
        } else {
          console.log("❌ [APP_INIT] Không thể khôi phục thông tin user hoặc accessToken");
        }
      } else {
        console.log("✅ [APP_INIT] Đã có idToken trong Redux, bỏ qua khôi phục");
      }
    } else {
      console.log("❌ [APP_INIT] Không tìm thấy token xác thực, chuyển hướng đến login");
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
