import React, { Component } from "react";
import PropTypes from "prop-types";
import Link from "react-router-dom/Link";

import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import icon from "../magoosh-ticks.png";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";

const styles = {
  form: {
    textAlign: "center",
  },
  logo: {
    margin: 10,
  },
  button: {
    marginTop: 15,
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: 8,
  },
};

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loading: false,
      errors: [],
    };
  }

  //props aren't loaded into component on mount so we require this hook
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(userData, this.props.history); // history can redirect us on success
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const {
      classes,
      UI: { loading },
    } = this.props;
    const { errors } = this.state;
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={icon} alt="Logo" className={classes.logo} />
          <Typography variant="h2" className={classes.pageTitle}>
            Log In
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              helperText={errors.email}
              error={errors.email ? true : false}
              className={classes.textField}
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              helperText={errors.password}
              error={errors.password ? true : false}
              className={classes.textField}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            />
            {errors.general && (
              <Typography variant="body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              size="large"
              color="primary"
              className={classes.button}
              disabled={loading} // takes a boolean value
            >
              Log in
              {loading && <CircularProgress color="secondary" size="30" />}
            </Button>
            <p>
              If you haven't created an account yet, you can make one{" "}
              <Link to="/signup">here</Link>.
            </p>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

// maps state from store.js (global) to props in this component
const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = {
  loginUser,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Login));
