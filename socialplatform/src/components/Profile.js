import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Link from "react-router-dom/Link";

import dayjs from "dayjs";

import { connect } from "react-redux";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import MaterialLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import LocationOn from "@material-ui/icons/LocationOn";
import CalendarToday from "@material-ui/icons/CalendarToday";
import LinkIcon from "@material-ui/icons/Link";

const styles = {
  paper: {
    padding: 20,
  },
  profilePic: {
    maxWidth: 50,
    borderRadius: "50%",
  },
  profileDetails: {
    color: "red",
  },
  buttons: {
    padding: 5,
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
          <img className={classes.profilePic} src={imageUrl} alt="Profile" />
          <MaterialLink
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
            variant="h6"
          >
            {userHandle}
          </MaterialLink>
          <div className={classes.profileDetails}>
            {bio && <Typography variant="body2">{bio}</Typography>}
            {location && (
              <Fragment>
                <LocationOn /> <span>{location}</span>
                <br />
              </Fragment>
            )}
            {website && (
              <Fragment>
                <LinkIcon />
                {/* target _blank so opens in new window; rel is a thing to
                  stop React complaining. */}
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {website}
                </a>
                <br />
              </Fragment>
            )}
            <Fragment>
              <CalendarToday />
              <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
            </Fragment>
          </div>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Typography variant="body2" align="center">
            No profile found, please login again
          </Typography>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/signup"
            >
              Signup
            </Button>
          </div>
        </Paper>
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
