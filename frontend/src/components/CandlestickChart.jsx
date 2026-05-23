import { useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function CandlestickChart({ assetName }) {
  // Dummy Historical OHLC Data (Date, Open, High, Low, Close)
  const [series] = useState([
    {
      data: [
        { x: new Date("2023-10-01").getTime(), y: [150, 155, 148, 152] },
        { x: new Date("2023-10-02").getTime(), y: [152, 158, 150, 156] },
        { x: new Date("2023-10-03").getTime(), y: [156, 160, 154, 159] },
        { x: new Date("2023-10-04").getTime(), y: [159, 162, 155, 157] },
        { x: new Date("2023-10-05").getTime(), y: [157, 165, 156, 163] },
        { x: new Date("2023-10-06").getTime(), y: [163, 164, 158, 160] },
        { x: new Date("2023-10-07").getTime(), y: [160, 168, 159, 166] },
        { x: new Date("2023-10-08").getTime(), y: [166, 170, 162, 164] },
        { x: new Date("2023-10-09").getTime(), y: [164, 165, 155, 158] },
        { x: new Date("2023-10-10").getTime(), y: [158, 162, 150, 154] },
      ],
    },
  ]);

  const [options] = useState({
    chart: {
      type: "candlestick",
      height: 350,
      toolbar: {
        show: true, // Enables zoom and pan tools
      },
      animations: {
        enabled: false // Better performance for trading charts
      }
    },
    title: {
      text: `${assetName} - 10 Day History`,
      align: "left",
      style: {
        fontSize: '14px',
        color: '#666'
      }
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        formatter: (value) => {
          return "$" + value.toFixed(2);
        }
      }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#16a34a', // Tailwind green-600
          downward: '#dc2626' // Tailwind red-600
        }
      }
    }
  });

  return (
    <div id="chart" className="w-full h-full bg-white rounded-lg">
      <ReactApexChart
        options={options}
        series={series}
        type="candlestick"
        height={350}
      />
    </div>
  );
}