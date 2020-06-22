import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import ReuseButton from "./ReuseButton";

import { connect } from "react-redux";
import { postMention } from "../redux/actions/userActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

import AddIcon from "@material-ui/icons/Add";

class PostMention extends Component {
  state = {
    open: false,
    body: "",
    errors: {},
  };

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

export default connect((mapStateToProps, { postMention }))(PostMention);
