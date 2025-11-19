import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Row, Col, Input, Button, message, Modal } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import authApi from "../../services/authApi";
import authActions from "../../redux/auth/actions";
import { saveAuthData } from "../../utils/auth";
import { LoginWrapper } from "./style";

function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [messageError, setMessageError] = useState("");

  const handleLogin = () => {
    setLoading(true);
    setMessageError("");

    if (!username || !password) {
      setLoading(false);
      setMessageError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const data = {
      UserName: username,
      Password: password,
    };

    authApi
      .dangNhap(data)
      .then((response) => {
        if (response && response.data && response.data.Status > 0) {
          const dataLogin = response.data;
          const user = dataLogin.User || dataLogin.Data?.User;
          const token = user?.Token;

          if (user && token) {
            // Lưu vào localStorage
            saveAuthData(user, token);

            // Dispatch action để cập nhật Redux store
            dispatch(authActions.loginSuccess(user, token));

            // Reset form
            setUsername("");
            setPassword("");
            setMessageError("");
            setLoading(false);

            // Redirect to checkin page
            history.push("/checkin");
          } else {
            setLoading(false);
            setMessageError("Dữ liệu đăng nhập không hợp lệ");
          }
        } else {
          setLoading(false);
          setMessageError(response?.data?.Message || "Đăng nhập thất bại");
        }
      })
      .catch((error) => {
        setLoading(false);
        Modal.error({
          title: "Không thể đăng nhập",
          content: error?.response?.data?.Message || "Đã có lỗi xảy ra. Vui lòng thử lại!",
        });
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <LoginWrapper>
      <div className="header-landing">
        Phần mềm lễ tân số - Quản lý khách vào ra cơ quan Go Checkin
      </div>
      <Row>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={10}
          xl={8}
          className="col-login flex-center"
        >
          <div className="main-login flex-center">
            <div className="go-title">Go - Checkin</div>
            <div className="login-input">
              <div className="row">
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Tên tài khoản"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  size="large"
                />
              </div>
              <div className="row">
                <Input
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  size="large"
                />
              </div>
              <div className="row row-message">{messageError}</div>
              <div className="row">
                <Button
                  type="primary"
                  onClick={handleLogin}
                  loading={loading}
                  size="large"
                  block
                >
                  Đăng nhập
                </Button>
              </div>
            </div>
          </div>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={14}
          xl={16}
          className="col-landing"
        >
          <div className="main-landing flex-center">
            <div className="landing-title">
              Hệ thống Check-in với nhận diện khuôn mặt
            </div>
            <div className="landing-description">
              <p>Quét thẻ CCCD và nhận diện khuôn mặt tự động</p>
              <p>Quản lý khách vào ra cơ quan hiệu quả</p>
            </div>
          </div>
        </Col>
      </Row>
      <div className="footer-login">
        <i>Copyright © 2010-{new Date().getFullYear()} GO SOLUTIONS. All rights</i>
      </div>
    </LoginWrapper>
  );
}

export default Login;

