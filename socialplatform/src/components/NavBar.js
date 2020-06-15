import React, { Component } from "react";
import Link from "react-router-dom/Link";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

export default class NavBar extends Component {
  render() {
    return (
      <div>
        <AppBar position="fixed">
          <Toolbar className="nav-container">
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Log In
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Sign Up
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
