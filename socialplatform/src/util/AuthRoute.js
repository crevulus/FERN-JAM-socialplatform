import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function AuthRoute({
  // props received from App.js
  comp: Component,
  authenticated,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) =>
        // check for auth before rendering component
        authenticated === true ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
}
