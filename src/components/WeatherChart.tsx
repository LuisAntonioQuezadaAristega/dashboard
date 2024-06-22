import { Chart } from "react-google-charts";
import Paper from '@mui/material/Paper';

export default function WeatherChart() {

    const data = [
        ["Hora", "Precipitación [Prob]", "Humedad [% como decimal]"],
        ["03:00", 0.13, 0.78],
        ["06:00", 0.04, 0.81],
        ["09:00", 0.07, 0.82],
        ["12:00", 0.03, 0.73],
        ["15:00", 0.04, 0.66],
        ["18:00", 0.06, 0.64],
        ["21:00", 0.05, 0.77],
    ];

    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Chart
                chartType="LineChart"
                data={data}
                width="100%"
                height="400px"
                options={{
                    title: "Precipitación y Humedad vs Hora",
                    curveType: "function",
                    legend: { position: "bottom" },
                }}
            />
        </Paper>
    )
}