import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useAuthenticator, Button, Heading, View } from '@aws-amplify/ui-react';

interface ChartData {
  options: any;
  series: any;
}

const App: React.FC = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [chartData, setChartData] = useState<ChartData>({
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
  });

  useEffect(() => {
    const timer = setInterval(() => {
      generateNoiseData();
    }, 10000); // Generate data every 10 seconds

    return () => clearInterval(timer);
  }, []);

  const generateNoiseData = () => {
    const newData = {
      x: new Date().getTime(),
      y: Math.floor(Math.random() * 50) + 30 // Random noise level between 30 and 80 dB
    };

    setChartData(prevState => {
      const updatedSeries = [{
        ...prevState.series[0],
        data: [...prevState.series[0].data, newData]
      }];

      // Keep only the last 30 data points (5 minutes of data)
      if (updatedSeries[0].data.length > 30) {
        updatedSeries[0].data.shift();
      }

      return { ...prevState, series: updatedSeries };
    });
  };

  if (!user) {
    return <Heading level={3}>Please sign in to view the noise monitoring dashboard</Heading>;
  }

  return (
    <View className="app">
      <Heading level={1}>Real-time Noise Level Monitoring</Heading>
      <View className="mixed-chart">
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={350}
          width={700}
        />
      </View>
      <Button onClick={signOut}>Sign out</Button>
    </View>
  );
};

export default App;
