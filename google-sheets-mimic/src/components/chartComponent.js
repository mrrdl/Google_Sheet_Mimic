import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ data, chartType }) => {
  // Extract labels and values from the first column
  const labels = data.map((_, index) => `Row ${index + 1}`);
  const chartData = data.map((row) => parseFloat(row[0]?.value || 0));

  const chartConfig = {
    labels,
    datasets: [
      {
        label: "First Column Data",
        data: chartData,
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Render the selected chart type
  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <Bar data={chartConfig} />;
      case "line":
        return <Line data={chartConfig} />;
      case "pie":
        return <Pie data={chartConfig} />;
      default:
        return <Bar data={chartConfig} />;
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Data Visualization</h3>
      {renderChart()}
    </div>
  );
};

export default ChartComponent;
