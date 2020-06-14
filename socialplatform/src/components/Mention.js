import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const styles = {
  card: {
    display: "flex",
  },
};

class Mention extends Component {
  render() {
    const {
      classes,
      mention: {
        body,
        createdAt,
        userImage,
        userHandle,
        mentiondId,
        likeCount,
        commentCount,
      },
    } = this.props;
    return (
      <Card>
        <CardMedia image={userImage} title="User Profile Picture" />
        <CardContent>
          <Typography variant="h5">{userHandle}</Typography>
          <Typography variant="body2" color="textSecondary">
            {createdAt}
          </Typography>
          <Typography variant="body1">{body}</Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Mention);
