import React, { Component } from "react";
import Chart from "chart.js";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    const myChart = new Chart(this.chartRef.current, {
      type: "bar",
      data: {
        labels: ["Change=", "Competitor"],
        datasets: [
          {
            label: "A",
            backgroundColor: "pink",
            data: [110, 175],
          },
          {
            label: "B",
            backgroundColor: "lightyellow",
            data: [600, 650],
          },
          {
            label: "C",
            backgroundColor: "lightgreen",
            data: [80, 120],
          },
          {
            label: "D",
            backgroundColor: "lightblue",
            data: [30, 30],
          },
        ],
      },
      options: {
        tooltips: {
          mode: "label",
        },
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value) {
                  return "$" + value;
                },
              },
            },
          ],
        },
      },
    });
  }

  render() {
    const graphStyle = {
      backgroundColor: "red",
      position: "relative",
      height: 10,
      responsive: true,
    };

    return (
      <div class="chart-container" style={{ graphStyle }}>
        <canvas ref={this.chartRef} />
      </div>
    );
  }
}

export default Graph;
