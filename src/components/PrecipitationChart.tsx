import { Grid } from "@mui/material";
import { Chart } from "react-google-charts";

interface Config {
    si: Number;
    title: String;
}

export var options = {
  title: "",
  legend: "none",
  pieHole: 0.6,
  is3D: false,
};

export default function PrecipitationChart(config: Config) {
  let no = 100 - config.si
  //options.title = "" + config.title
  let data = [
    ["Task", "Hours per Day"],
    ["Si", config.si],
    ["No", no], // CSS-style declaration
  ]

  return (
    <Grid xs={12} lg={10}>
    <h2>¿llovera a las</h2>
    <h2>{config.title}?</h2>
    <Chart
      chartType="PieChart"
      width="300px"
      height="300px"
      data={data}
      options={options}
    />
    </Grid>
  );
}