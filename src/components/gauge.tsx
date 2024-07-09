import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

interface Config {
    title: String;
    value: Number;
}

export const options = {
  Width: 500,
  height: 200,
  redFrom: 90,
  redTo: 100,
  yellowFrom: 75,
  yellowTo: 90,
  minorTicks: 5,
};

export default function Gauge(config: Config) {

  let info = [
    ["Label", "Value"],
    [config.title, config.value],
  ]

  const [data, setData] = useState(info);

  useEffect(() => {
    const id = setInterval(() => {
      setData(info);
    }, 3000);

    return () => {
      clearInterval(id);
    };
  });

  return (
    <Chart
      chartType="Gauge"
      width="100%"
      height="80px"
      data={data}
      options={options}
    />
  );
}