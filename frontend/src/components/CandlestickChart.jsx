import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "../store/themeStore";

export default function CandlestickChart({ assetName }) {
  const { theme } = useTheme();

  // Dynamic theme parameters
  const isDark = theme === "dark";

  // Dummy Historical OHLC Data (Date, Open, High, Low, Close)
  const series = useMemo(() => [
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
  ], []);

  const options = useMemo(() => ({
    chart: {
      type: "candlestick",
      height: 350,
      background: "transparent",
      toolbar: {
        show: true,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      foreColor: isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(15, 23, 42, 0.55)",
    },
    title: {
      text: `${assetName} - 10 Day Trend`,
      align: "left",
      style: {
        fontSize: "13px",
        fontFamily: "Outfit, sans-serif",
        fontWeight: 800,
        color: isDark ? "#ffffff" : "#0f172a",
      },
    },
    grid: {
      borderColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
      strokeDashArray: 4,
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        style: {
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
        },
        formatter: (value) => {
          return "$" + value.toFixed(2);
        },
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#10b981", // High-tech emerald-500
          downward: "#f43f5e", // High-tech rose-500
        },
      },
    },
  }), [assetName, isDark]);

  return (
    <div id="chart" className="w-full h-full p-2.5">
      <ReactApexChart
        options={options}
        series={series}
        type="candlestick"
        height={320}
      />
    </div>
  );
}