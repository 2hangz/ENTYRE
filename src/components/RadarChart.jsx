import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function RadarChart() {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    const data = {
      labels: [
        "Carbon",
        "Cost",
        "Circularity",
        "TRL",
        "Safety",
        "Scalability",
        "Market"
      ],
      datasets: [
        {
          label: "Pyrolysis",
          data: [3, 3, 2, 3, 4, 3, 4],
          fill: true,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgb(255, 99, 132)",
          pointBackgroundColor: "rgb(255, 99, 132)"
        },
        {
          label: "Civil Engineering Use",
          data: [4, 4, 4, 4, 4, 4, 4],
          fill: true,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgb(54, 162, 235)",
          pointBackgroundColor: "rgb(54, 162, 235)"
        },
        {
          label: "Thermo-Mechanical Devulcanisation",
          data: [4, 3, 3, 2, 3, 2, 3],
          fill: true,
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          borderColor: "rgb(255, 206, 86)",
          pointBackgroundColor: "rgb(255, 206, 86)"
        },
        {
          label: "Gasification",
          data: [2, 2, 2, 2, 2, 1, 2],
          fill: true,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgb(75, 192, 192)",
          pointBackgroundColor: "rgb(75, 192, 192)"
        },
        {
          label: "Incineration",
          data: [1, 2, 3, 4, 2, 5, 1],
          fill: true,
          backgroundColor: "rgb(173, 108, 231)",
          borderColor: "rgb(75, 21, 122)",
          pointBackgroundColor: "rgb(75, 21, 122)",
        }
      ]
    };
    const config = {
      type: "radar",
      data: data,
      options: {
        responsive: true,
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 5
          }
        },
        plugins: {
          legend: {
            position: "top"
          },
          title: {
            display: false,
            text: "Radar Chart for ELT Pathways"
          }
        }
      }
    };

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    chartInstanceRef.current = new Chart(ctx, config);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <canvas ref={chartRef} width={400} height={400}></canvas>
    </div>
  );
}
