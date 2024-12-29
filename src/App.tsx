import React from "react";
import Chart from "react-apexcharts";
import { useAuthenticator } from '@aws-amplify/ui-react';

interface AppProps {}
interface AppState {
  options: any;
  series: any;
}

class App extends React.Component<AppProps, AppState> {
  private timer: NodeJS.Timeout | null = null;

  state: AppState = {
    options: {
      chart: {
        id: "realtime-noise-chart",
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      xaxis: {
        type: 'datetime',
        range: 300000, // 5 minutes in milliseconds
      },
      yaxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Noise Level (dB)'
        }
      },
      title: {
        text: 'Real-time Noise Level',
        align: 'left'
      },
      stroke: {
        curve: 'smooth'
      }
    },
    series: [{
      name: 'Noise Level',
      data: []
    }]
  };

  componentDidMount() {
    this.startDataGeneration();
  }

  componentWillUnmount() {
    this.stopDataGeneration();
  }

  startDataGeneration = () => {
    this.timer = setInterval(() => {
      this.generateNoiseData();
    }, 10000); // Generate data every 10 seconds
  }

  stopDataGeneration = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  generateNoiseData = () => {
    const { series } = this.state;
    const newData = {
      x: new Date().getTime(),
      y: Math.floor(Math.random() * 50) + 30 // Random noise level between 30 and 80 dB
    };

    const updatedSeries = [{
      ...series[0],
      data: [...series[0].data, newData]
    }];

    // Keep only the last 30 data points (5 minutes of data)
    if (updatedSeries[0].data.length > 30) {
      updatedSeries[0].data.shift();
    }

    this.setState({ series: updatedSeries });
  }

  render() {
    const { options, series } = this.state;
    const { signOut } = useAuthenticator();
    return (
      <div className="app">
        <div className="row">
          <h1>Real-time Noise Level Monitoring</h1>
          <div className="mixed-chart">
            <Chart
              options={options}
              series={series}
              type="line"
              height={350}
              width={700}
            />
          </div>
        </div>
        <button onClick={signOut}>Sign out</button>
      </div>
    );
  }
}

export default App;
