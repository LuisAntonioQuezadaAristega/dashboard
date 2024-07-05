//import React from "react";
import { Chart } from "react-google-charts";

export const data = [
  [
    { type: "number", label: "x" },
    { type: "number", label: "valor" },
    { id: "i0", type: "number", role: "interval" },
    { id: "i1", type: "number", role: "interval" },
  ],
  [1, 100, 90, 110],
  [2, 120, 95, 130],
  [3, 130, 105, 140],
  [4, 90, 85, 95],
  [5, 70, 74, 63],
  [6, 30, 39, 22],
  [7, 80, 77, 83],
  [8, 100, 90, 110],
];

export const options = {
  title: "Temperatura (Kelvin) por hora",
  curveType: "function",
  lineWidth: 4,
  intervals: { style: "line" },
  legend: "none",
  hAxis: {
    title: "Tiempo",
  },
  vAxis: {
    title: "Grados",
  }
};

export default function TemperatureChart() {
  return (
    <Chart
      chartType="LineChart"
      width="115%"
      height="400px"
      data={data}
      options={options}
    />
  );
}