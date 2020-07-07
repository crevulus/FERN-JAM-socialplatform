import React, { Component } from "react";
import Link from "react-router-dom/Link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";
import ReuseButton from "./ReuseButton";

import { connect } from "react-redux";
import { likeMention } from "../redux/actions/dataActions";

import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
  },
  content: {
    padding: 25,
    objectFit: "cover",
  },
};

class Mention extends Component {
  // checks if mention has already been liked
  likedMention = () => {
    // mention obj is passed down from home
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.mentionId === this.props.mention.mentionId
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  likeMention = () => {
    this.props.likeMention(this.props.mention.mentionId);
  };

  render() {
    dayjs.extend(relativeTime);
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
      user: { authenticated },
    } = this.props;

    // not logged in 7 click heart -> redir to login
    const likeButton = !authenticated ? (
      <ReuseButton tip="Like this mention">
        <Link to="/login">
          <FavoriteBorder color="primary" />
        </Link>
      </ReuseButton>
    ) : this.likedMention() ? (
      <FavoriteIcon color="primary" />
    ) : (
      <ReuseButton tip="Like this mention" onClick={this.likeMention}>
        <FavoriteBorder color="primary" />
      </ReuseButton>
    );

    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title="User Profile Picture"
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography variant="h5" component={Link} to={`/users/${userHandle}`}>
            {userHandle}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{body}</Typography>
          {likeButton}
          <span>{likeCount} likes</span>
        </CardContent>
      </Card>
    );
  }
}

Mention.propTypes = {
  likeMention: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  mention: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeMention,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Mention));
