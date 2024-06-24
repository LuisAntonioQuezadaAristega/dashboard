//import { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Indicator from './components/Indicator';
import Summary from './components/Summary';
import BasicTable from './components/BasicTable';
import WeatherChart from './components/WeatherChart';
import ControlPanel from './components/ControlPanel';
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

//<Grid xs={12} sm={4} md={3} lg={2}>1</Grid>
//<Grid xs={6} sm={4} md={3} lg={2}>2</Grid>
//<Grid xs={6} sm={4} md={3} lg={2}>3</Grid>
//<Grid xs={12} sm={4} md={3} lg={2}>4</Grid>
//<Grid xs={6} sm={4} md={6} lg={2}>5</Grid>
//<Grid xs={6} sm={4} md={6} lg={2}>6</Grid>

// border: solid, dashed, dotted, ridge, outset;
function App() {
  //const [count, setCount] = useState(0)
   
  return (
	
	<Grid container spacing={0}>
		<Grid>
			<h1>Weather's Way</h1>
			<Grid container spacing={5} id="seccion1">
				<Grid xs={6} md={4} lg={2}>
		  			<Indicator title={'Precipitación'} subtitle={'Probabilidad'} value={0.13} />
	    		</Grid>
				<Grid xs={6} sm={4} md={3} lg={2}>
	      			<Summary></Summary>
	    		</Grid>
				<Grid xs={12} md={6} lg={9} >
		       		<BasicTable />
		    	</Grid>
			</Grid>
			<br></br>
			<br></br>
			<br></br>
			<br></br>
			<Grid container spacing={5} id="seccion2">
				<Grid xs={12} lg={2}>
					<ControlPanel />	
				</Grid>

				<Grid xs={12} lg={10}>
					<WeatherChart></WeatherChart>
				</Grid>
			</Grid>
		</Grid>
		
		  
			
			
	</Grid>

		
	)
}



export default App
