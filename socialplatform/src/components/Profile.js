import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Link from "react-router-dom/Link";

import dayjs from "dayjs";

import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../redux/actions/userActions";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import MaterialLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";

import LocationOn from "@material-ui/icons/LocationOn";
import CalendarToday from "@material-ui/icons/CalendarToday";
import LinkIcon from "@material-ui/icons/Link";
import EditIcon from "@material-ui/icons/Edit";

const styles = {
  paper: {
    padding: 20,
  },
  profilePic: {
    maxWidth: 150,
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
          <Tooltip title="Edit pic" placement="left">
            <IconButton onClick={this.handleEditPicture} className="buttons">
              <EditIcon />
            </IconButton>
          </Tooltip>
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

const mapStateToProps = (state) => ({
  user: state.user,
});

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
