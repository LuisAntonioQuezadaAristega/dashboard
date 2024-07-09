import { Grid } from "@mui/material";
import { Chart } from "react-google-charts";

interface Config {
    si: Number;
    title: String;
}

export var options = {
  title: "",
  legend: "none",
  backgroundColor: 'none',
  colors: ['#2871DB', '#c0752e'],
  pieHole: 0.6,
  is3D: false,
  margin:0,
};

export default function PrecipitationChart(config: Config) {
  let no = 100 - parseInt(""+config.si)
  //options.title = "¿llovera a las" + config.title + "?"
  let data = [
    ["Task", "Hours per Day"],
    ["Si", config.si],
    ["No", no], // CSS-style declaration
  ]

  return (
    <Grid alignContent={"center"}>
      <h2>¿llovera a las</h2>
      <h2>{config.title} ?</h2>
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