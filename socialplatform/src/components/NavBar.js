import React, { Component, Fragment } from "react";
import ReuseButton from "./ReuseButton";
import Link from "react-router-dom/Link";
import PropTypes from "prop-types";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import AddIcon from "@material-ui/icons/Add";
import HomeIcon from "@material-ui/icons/Home";

import { connect } from "react-redux";

class NavBar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar className="nav-container">
            {authenticated ? (
              <Fragment>
                <ReuseButton tip="New post">
                  <AddIcon />
                </ReuseButton>
                <Link to="/">
                  <ReuseButton tip="Home">
                    <HomeIcon />
                  </ReuseButton>
                </Link>
              </Fragment>
            ) : (
              <Fragment>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/login">
                  Log In
                </Button>
                <Button color="inherit" component={Link} to="/signup">
                  Sign Up
                </Button>
              </Fragment>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(NavBar);
