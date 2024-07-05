import { Chart } from "react-google-charts";

interface Config {
    si: Number;
}

export const options = {
  title: "¿habrá precipitación?",
  legend: "none",
  pieHole: 0.6,
  is3D: false,
};

export default function PrecipitationChart(config: Config) {
  let no = 100 - config.si

  let data = [
    ["Task", "Hours per Day"],
    ["Si", config.si],
    ["No", no], // CSS-style declaration
  ]

  return (
    <Chart
      chartType="PieChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}