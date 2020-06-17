import React, { Component } from "react";
import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";

const styles = {
  paper: {
    maxWidth: 50,
  },
};

class Profile extends Component {
  render() {
    const {
      classes,
      user: {
        credentials: {
          userHandle,
          createdAt,
          imageUrl,
          bio,
          website,
          location,
        },
        loading,
        authenticated,
      },
    } = this.props;

    let profile = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <img src={imageUrl} alt="Profile" />
        </Paper>
      ) : (
        <p>Not authorized</p>
      )
    ) : (
      <p>Loading...</p>
    );

    return profile;
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(withStyles(styles)(Profile));
