import React, { useEffect, useMemo } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts, { ApexOptions } from 'apexcharts';
import jaLocale from 'apexcharts/dist/locales/ja.json';
import './Charts.css';
import { useEnvsensors } from './useEnvsensors';
import { Envsensor } from './API';

const chartHeight = '40%';

const deviceIdToRoom = {
    'palamb0001': '寝室'
};

const getCommonOptions = () : ApexOptions => ({
    chart: {
        group: 'chart-group',
        height: chartHeight,
        locales: [jaLocale],
        defaultLocale: 'ja',
        zoom: {
            enabled: false
        },
        animations: {
            easing: 'easeinout',
            animateGradually: {
                enabled: false,
            },
            dynamicAnimation: {
                speed: 100,
            },
        }
    },
    tooltip: {
        x: {
            format: "yyyy/MM/dd HH:mm"
        },
    },
    xaxis: {
        type: "datetime",
        title: {
            text: '日時',
            offsetY: 3,
        },
        labels: {
            datetimeUTC: false, //表示をJSTにする
        },
    },
    yaxis: {
        labels: {
            minWidth: 30,
        },
        decimalsInFloat: 0,
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
    },
});

const getSeries = (
    envsensors: readonly Envsensor[],
    field: 'temperature' | 'humidity' | 'illuminance' | 'power'
) =>
    Object.entries(deviceIdToRoom).map(([deviceId, room]) => ({
        name: room,
        data: envsensors
            .filter((m) => m.deviceid === deviceId)
            .map((m) => [m.timestamp * 1000, m[field]]), //convert javascript unixtime (*1000)
    }));

const Charts = () => {
    const { envsensors, requestEnvsensors } = useEnvsensors();

    useEffect(() => {
        requestEnvsensors();
    }, [requestEnvsensors]);

    const commonOptions = useMemo(() => getCommonOptions(), []);

    return (
      <>
            <Chart
                className="Chart"
                options={{
                    ...commonOptions,
                    chart: {
                        ...commonOptions.chart,
                        id: 'temperature-chart',
                    },
                    yaxis: {
                        ...commonOptions.yaxis,
                        title: {
                            text: '温度[℃]',
                        },
                    },
                    tooltip: {
                        ...commonOptions.tooltip,
                        y: {
                            formatter: (value) => `${value.toFixed(1)}℃`,
                        },
                    },
                }}
                series={ getSeries(envsensors, 'temperature') as ApexAxisChartSeries}
                hegit={chartHeight}
            />
        </>
    )
}

export default Charts;