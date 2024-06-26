import { useEffect, useState } from 'react';
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

  {/* Variable de estado y función de actualización */}

  let [indicators, setIndicators] = useState([])

  {/* 
    1. Agregue la variable de estado (dataTable) y función de actualización (setDataTable).
  */}

  let [rowsTable, setRowsTable] = useState([])

  {/* Hook: useEffect */}
		
  useEffect(()=>{

	(async ()=>{

		 {/* Del LocalStorage, obtiene el valor de las claves openWeatherMap y expiringTime */}

         let savedTextXML = localStorage.getItem("openWeatherMap")
         let expiringTime = localStorage.getItem("expiringTime")

         {/* Estampa de tiempo actual */}

         let nowTime = (new Date()).getTime();

         {/* Realiza la petición asicrónica cuando: 
             (1) La estampa de tiempo de expiración (expiringTime) es nula, o  
             (2) La estampa de tiempo actual es mayor al tiempo de expiración */}

         if(expiringTime === null || nowTime > parseInt(expiringTime)) {

			{/* Request */}

			let API_KEY = "1835b23e7d0c0a071ef3586f8db8f8c5"
			let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
			let savedTextXML = await response.text();

			{/* Diferencia de tiempo */}

			let hours = 1
			let delay = hours * 3600000


			{/* En el LocalStorage, almacena texto en la clave openWeatherMap y la estampa de tiempo de expiración */}

			localStorage.setItem("openWeatherMap", savedTextXML)
			localStorage.setItem("expiringTime", (nowTime + delay ).toString() )
		}

		{/* XML Parser */}

		const parser = new DOMParser();
		const xml = parser.parseFromString(savedTextXML, "application/xml");

		{/* Arreglo para agregar los resultados */}

		let dataToIndicators = new Array()

		{/* 
		Análisis, extracción y almacenamiento del contenido del XML 
		en el arreglo de resultados
		*/}

		let location = xml.getElementsByTagName("location")[1]
		let city = (xml.getElementsByTagName("name"))[0]

		let geobaseid = location.getAttribute("geobaseid")
		dataToIndicators.push([city.textContent,"geobaseid", geobaseid])

		let latitude = location.getAttribute("latitude")
		dataToIndicators.push([city.textContent,"Latitude", latitude])

		let longitude = location.getAttribute("longitude")
		dataToIndicators.push([city.textContent,"Longitude", longitude])

		//console.log(  )

		{/* Renderice el arreglo de resultados en un arreglo de elementos Indicator */}

		let indicatorsElements = Array.from(dataToIndicators).map(
			(element) => <Indicator title={element[0]} subtitle={element[1]} value={element[2]} />
		)
		   
		{/* Modificación de la variable de estado mediante la función de actualización */}

		setIndicators(indicatorsElements)

		{/* 
             2. Procese los resultados de acuerdo con el diseño anterior.
             Revise la estructura del documento XML para extraer los datos necesarios. 
        */}

        let arrayObjects = Array.from( xml.getElementsByTagName("time") ).map( (timeElement) =>  {
				
			let rangeHours = timeElement.getAttribute("from").split("T")[1] + " - " + timeElement.getAttribute("to").split("T")[1]

			let windDirection = timeElement.getElementsByTagName("windDirection")[0].getAttribute("deg") + " "+  timeElement.getElementsByTagName("windDirection")[0].getAttribute("code") 
			   
			return { "rangeHours": rangeHours,"windDirection": windDirection }
		   
		})

		arrayObjects = arrayObjects.slice(0,8)
	   
		{/* 3. Actualice de la variable de estado mediante la función de actualización */}

		setRowsTable(arrayObjects)

	})()

	

},[])

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
				{/*<Grid xs={12} md={6} lg={9} >
		       		<BasicTable />
		    	</Grid>*/}
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

			<Grid xs={6} lg={2}>
				{indicators[0]}
				{/* <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} /> */}
			</Grid>
			<Grid xs={6} lg={2}>
				{indicators[1]}
				{/* <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} /> */}
			</Grid>
			<Grid xs={6} lg={2}>
				{indicators[2]}
				{/* <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} /> */}
			</Grid>

			<Grid xs={12} lg={8}>
            	{/* 4. Envíe la variable de estado (dataTable) como prop (input) del componente (BasicTable) */}
            	<BasicTable rows={rowsTable}></BasicTable>
         	</Grid>

		</Grid>
		
		  
			
			
	</Grid>

		
	)
}



export default App
