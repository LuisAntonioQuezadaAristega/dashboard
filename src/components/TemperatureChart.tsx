//import React from "react";
import { Chart } from "react-google-charts";
import { useState, useEffect } from 'react';

interface Config {
  rows: Array<object>;
}

export var info = [
  [
    { type: "string", label: "x" },
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
  title: "Temperatura (Celcius) por hora",
  curveType: "function",
  lineWidth: 4,
  intervals: { style: "line"},
  colors: ['#e0440e'],
  legend: "none",
  hAxis: {
    title: "Tiempo",
  },
  vAxis: {
    title: "Grados",
  }
};

export default function TemperatureChart(data:Config) {
  let [rows, setRows] = useState([])

  useEffect( () => {

    (()=> {

        setRows(data.rows)

    })()

  }, [data] )

  let index = 1

  rows.map((row) => {
    info[index] = [row.hoursprom, row.temperature, row.maxtemp, row.mintemp]
    index += 1
  })

  return (
    <Chart
      chartType="LineChart"
      width="115%"
      height="350px"
      data={info}
      options={options}
    />
  );
}