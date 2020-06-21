import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Link from "react-router-dom/Link";
import EditDetails from "./EditDetails";

import dayjs from "dayjs";

import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../redux/actions/userActions";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import MaterialLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import LocationOn from "@material-ui/icons/LocationOn";
import CalendarToday from "@material-ui/icons/CalendarToday";
import LinkIcon from "@material-ui/icons/Link";
import PhotoIcon from "@material-ui/icons/AddAPhoto";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";
import ReuseButton from "./ReuseButton";

const styles = {
  paper: {
    padding: 20,
  },
  profilePic: {
    maxWidth: 150,
    borderRadius: "50%",
  },
  profileDetails: {
    color: "primary",
  },
  buttons: {
    padding: 5,
  },
};

class Profile extends Component {
  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("ProfileImage", image, image.name);
    this.props.uploadImage(formData);
  };

  // selects hidden choose file button and simulates a click
  handleEditPicture = () => {
    const fileInput = document.getElementById("imageUpload");
    fileInput.click();
  };

  handleLogout = () => {
    this.props.logoutUser();
  };

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
          <input
            type="file"
            id="imageUpload"
            hidden="hidden" //hides choose file button
            onChange={this.handleImageChange}
          />
          <ReuseButton
            tip="Edit pic"
            onClick={this.handleEditPicture}
            btnClassName="buttons"
          >
            <PhotoIcon color="primary" />
          </ReuseButton>
          <EditDetails />
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
                <LinkIcon />{" "}
                {/* target _blank so opens in new window; rel is a thing to
                  stop React complaining. */}
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {website}
                </a>
                <br />
              </Fragment>
            )}
            <Fragment>
              <CalendarToday />{" "}
              <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
            </Fragment>
            <br />
            <Fragment>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.handleLogout}
              >
                <span>Logout</span>
                <KeyboardReturn />
              </Button>
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
            </Button>{" "}
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

// extracts data from our state
const mapStateToProps = (state) => ({
  user: state.user,
});

// decalre which actions to use/take from props
const mapActionsToProps = { logoutUser, uploadImage };

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Profile));
