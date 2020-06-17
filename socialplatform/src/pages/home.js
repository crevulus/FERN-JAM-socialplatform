import React, { Component } from "react";
import axios from "axios";
import Mention from "../components/Mention";
import Profile from "../components/Profile";

import Grid from "@material-ui/core/Grid";

export default class Home extends Component {
  state = {
    mentions: null,
  };

  componentDidMount() {
    axios
      .get("/mentions")
      .then((res) => {
        console.log(res.data);
        this.setState({
          mentions: res.data,
        });
      })
      .catch((err) => console.error(err));
  }

  render() {
    let recentMentions = this.state.mentions ? (
      this.state.mentions.map((mention) => (
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
