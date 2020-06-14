import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

export default class Home extends Component {
  render() {
    return (
      <Grid container>
        <Grid item sm={8} xs={12}>
          <p>Content Left</p>
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile Right</p>
        </Grid>
      </Grid>
    );
  }
}
