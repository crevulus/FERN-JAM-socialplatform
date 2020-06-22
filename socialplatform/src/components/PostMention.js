import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import ReuseButton from "./ReuseButton";

import { connect } from "react-redux";
import { postMention } from "../redux/actions/dataActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

class PostMention extends Component {
  state = {
    open: false,
    body: "",
    errors: {},
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors,
      });
    }
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: "" });
      this.handleClose();
    }
  }

  handleOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.postMention({ body: this.state.body });
  };

  render() {
    const { errors } = this.state;
    const {
      UI: { loading },
    } = this.props;
    return (
      <Fragment>
        <ReuseButton onClick={this.handleOpen} tip="Post something">
          <AddIcon />
        </ReuseButton>
        <Dialog open={this.state.open} onClose={this.handleClose} fullWidth>
          <ReuseButton tip="Close" onClick={this.handleClose}>
            <CloseIcon />
          </ReuseButton>
          <DialogTitle>Post a new mention</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                onChange={this.handleChange}
                name="body"
                type="text"
                label="Make your mention"
                multiline
                rows="3"
                fullWidth
                placeholder="Whatcha thinkin'?"
                error={errors.body ? true : false}
                helperText={errors.body}
              />
              <Button type="submit" variant="contained" disabled={loading}>
                Submit
                {loading && <CircularProgress size={30} />}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

PostMention.propTypes = {
  postMention: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  UI: state.UI,
});

export default connect(mapStateToProps, { postMention })(PostMention);
