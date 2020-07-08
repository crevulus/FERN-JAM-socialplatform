import React, { Component } from "react";
import axios from "axios";

export class Trends extends Component {
  getTrends = () => {
    axios
      .get("/twitter")
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    this.getTrends();
  }

  render() {
    return (
      <div>
        <p>Print text here</p>
        <p>And also here for structure</p>
      </div>
    );
  }
}

export default Trends;
