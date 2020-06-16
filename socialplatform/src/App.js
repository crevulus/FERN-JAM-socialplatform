import React from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
} from "react-router-dom";
import decode from "jwt-decode";
import { Provider } from "react-redux";
import store from "./redux/store";

import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import NavBar from "./components/NavBar";
import AuthRoute from "./util/AuthRoute";

import "./App.css";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import purple from "@material-ui/core/colors/purple";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: "#f44336",
    },
  },
  typography: {
    useNextVariants: true,
  },
});

let authenticated;

const token = localStorage.firebaseIdToken;

// check for authentication
if (token) {
  const decodedToken = decode(token);
  // extract exp date from jwt obj
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = "/login";
    authenticated = false;
    localStorage.clear();
  }
  authenticated = true;
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <NavBar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <AuthRoute
                exact
                path="/login"
                comp={Login}
                authenticated={authenticated}
              />
              <AuthRoute
                exact
                path="/signup"
                comp={Signup}
                authenticated={authenticated}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
