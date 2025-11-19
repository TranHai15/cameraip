import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { isAuthenticated } from "../utils/auth";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const authState = useSelector((state) => state.Auth);
  const isLoggedIn = isAuthenticated() || authState.idToken !== null;

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;

