import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { editUserDetails } from "../redux/actions/userActions";

import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import EditIcon from "@material-ui/icons/Edit";

class EditDetails extends Component {
  state = {
    bio: "",
    website: "",
    location: "",
    open: false,
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

  setCredentialsState = (credentials) => {
    this.setState({
      bio: credentials.bio ? credentials.bio : "",
      website: credentials.website ? credentials.website : "",
      location: credentials.location ? credentials.location : "",
    });
  };

  render() {
    return (
      <Fragment>
        <Tooltip title="Edit details" placement="top">
          <IconButton onClick={this.handleOpen}>
            <EditIcon color="primary" />
          </IconButton>
        </Tooltip>
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
                name="Bio"
                type="text"
                label="Bio"
                value={this.state.bio}
                multiline
                rows="5"
                onChange={this.onChange}
              />
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

EditDetails.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
});

export default connect(mapStateToProps, { editUserDetails })(EditDetails);
