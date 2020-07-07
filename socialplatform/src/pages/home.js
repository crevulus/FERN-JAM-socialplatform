import React, { Component } from "react";
import axios from "axios";
import Mention from "../components/Mention";
import Profile from "../components/Profile";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";

import { connect } from "react-redux";
import { getMentions } from "../redux/actions/dataActions";

class Home extends Component {
  componentDidMount() {
    this.props.getMentions();
  }

  render() {
    const { mentions, loading } = this.props.data;
    let recentMentions = !loading ? (
      mentions.map((mention) => (
        <Mention key={mention.mentionId} mention={mention} />
      ))
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {recentMentions}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

Home.propTypes = {
  getMentions: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  // data reducer in store.js puts all data in data object
  data: state.data,
});

export default connect(mapStateToProps, { getMentions })(Home);
