import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const AuthRoute = ({
  // props received from App.js
  comp: Component,
  authenticated,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        // check for auth before rendering component
        authenticated === true ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

AuthRoute.propTypes = {
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(AuthRoute);
