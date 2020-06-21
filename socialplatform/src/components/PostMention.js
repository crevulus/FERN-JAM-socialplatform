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

class PostMention extends Component {
  render() {
    return <div></div>;
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
