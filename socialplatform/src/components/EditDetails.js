import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import ReuseButton from "./ReuseButton";

import { connect } from "react-redux";
import { editUserDetails } from "../redux/actions/userActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import EditIcon from "@material-ui/icons/Edit";

class EditDetails extends Component {
  state = {
    bio: "",
    website: "",
    location: "",
    open: false,
  };

  setCredentialsState = (credentials) => {
    this.setState({
      bio: credentials.bio ? credentials.bio : "",
      website: credentials.website ? credentials.website : "",
      location: credentials.location ? credentials.location : "",
    });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location,
    };
    this.props.editUserDetails(userDetails);
    this.handleClose();
  };

  handleOpen = () => {
    this.setState({ open: true });
    this.setCredentialsState(this.props.credentials);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    const { credentials } = this.props;
    this.setCredentialsState(credentials);
  }

  render() {
    return (
      <Fragment>
        {/* <Tooltip title="Edit profile details" placement="top">
          <IconButton onClick={this.handleOpen}>
            <EditIcon color="primary" />
          </IconButton>
        </Tooltip> */}
        <ReuseButton tip="Edit profile details" onClick={this.handleOpen}>
          <EditIcon color="primary" />
        </ReuseButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          // maxWidth={sm}
        >
          <DialogTitle>Edit your profile</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="bio" // name is used for targeting in handleChange
                type="text"
                label="Bio"
                value={this.state.bio}
                fullWidth
                multiline
                rows="5"
                onChange={this.handleChange}
              />
            </form>
            <form>
              <TextField
                name="website"
                type="text"
                label="Website"
                value={this.state.website}
                fullWidth
                onChange={this.handleChange}
              />
            </form>
            <form>
              <TextField
                name="location"
                type="text"
                label="Location"
                value={this.state.location}
                fullWidth
                onChange={this.handleChange}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

EditDetails.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
});

export default connect(mapStateToProps, { editUserDetails })(EditDetails);
