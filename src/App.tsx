import { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Indicator from './components/Indicator';
import Summary from './components/Summary';
import BasicTable from './components/BasicTable';
//import WeatherChart from './components/WeatherChart';
import ControlPanel from './components/ControlPanel';
import TemperatureChart from './components/TemperatureChart';
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import PrecipitationChart from './components/PrecipitationChart';

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

  {/*max y min de velocidad*/}
  let [rowsSpeed, setRowsSpeed] = useState([])

  {/*max y min de temperatura*/}
  let [rowsHeat, setRowsHeat] = useState([])

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

			let API_KEY = ""
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
				
			let hoursFrom = (""+timeElement.getAttribute("from")).split("T")[1]

			let hoursTo = (""+timeElement.getAttribute("to")).split("T")[1]

			let windSpeed = timeElement.getElementsByTagName("windSpeed")[0].getAttribute("mps") + " "+  timeElement.getElementsByTagName("windSpeed")[0].getAttribute("unit")

			let windDirection = timeElement.getElementsByTagName("windDirection")[0].getAttribute("deg") + " "+  timeElement.getElementsByTagName("windDirection")[0].getAttribute("code") 

			let maxtemp = Math.round((parseFloat(""+timeElement.getElementsByTagName("temperature")[0].getAttribute("max")) - 273.15) * 100)/100

			let mintemp = Math.round((parseFloat(""+timeElement.getElementsByTagName("temperature")[0].getAttribute("min")) - 273.15) * 100)/100

			let temperature = ((maxtemp + mintemp)/2)

			let hoursprom = ( ((parseInt(hoursFrom.split(":")[0]) + parseInt(hoursTo.split(":")[0]))/2) - 0.5)+":30"

			let llueve = parseFloat(""+timeElement.getElementsByTagName("precipitation")[0].getAttribute("probability")) * 100

			return { "hoursFrom": hoursFrom, "hoursTo": hoursTo, "windSpeed": windSpeed, "windDirection": windDirection, "temperature": temperature, "maxtemp": maxtemp, "mintemp": mintemp, "hoursprom": hoursprom, "llueve": llueve}
		   
		})

		arrayObjects = arrayObjects.slice(0,8)

		let maxspeed = "0.0"
  		let maxspeedtime = ""
  		let minspeed = "1000.0"
  		let minspeedtime = ""

		let maxheat = "0.0"
		let maxheatTime = ""
		let minheat = "1000.0"
		let minheattime = ""
		for(const index in arrayObjects){
			if(parseFloat(maxspeed.split(" ")[0])<parseFloat(arrayObjects[index]["windSpeed"].split(" ")[0])){
				maxspeed = arrayObjects[index]["windSpeed"]
				maxspeedtime = arrayObjects[index]["hoursFrom"] + " - " + arrayObjects[index]["hoursTo"]
			}

			if(parseFloat(minspeed.split(" ")[0])>parseFloat(arrayObjects[index]["windSpeed"].split(" ")[0])){
				minspeed = arrayObjects[index]["windSpeed"]
				minspeedtime = arrayObjects[index]["hoursFrom"] + " - " + arrayObjects[index]["hoursTo"]
			}

			if(parseFloat(maxheat) < arrayObjects[index]["maxtemp"]){
				maxheat = ""+arrayObjects[index]["maxtemp"]
				maxheatTime = arrayObjects[index]["hoursFrom"] + " - " + arrayObjects[index]["hoursTo"]
			}

			if(parseFloat(minheat) > arrayObjects[index]["mintemp"]){
				minheat = ""+arrayObjects[index]["mintemp"]
				minheattime = arrayObjects[index]["hoursFrom"] + " - " + arrayObjects[index]["hoursTo"]
			}
		}

		let lluvia = arrayObjects[0]["llueve"]
		{/* 3. Actualice de la variable de estado mediante la función de actualización */}

		setRowsTable(arrayObjects)
		setRowsSpeed({ "max": maxspeed, "maxtime": maxspeedtime, "min": minspeed, "mintime": minspeedtime})
		setRowsHeat({ "max": maxheat+" Celcius", "maxtime": maxheatTime, "min": minheat+" Celcius", "mintime": minheattime, "lluvia": lluvia})

	})()


},[])

  return (
	
	<Grid>
		<Grid container spacing={5} id="seccion1">
			<Grid container>
	      		<Summary></Summary>
				{indicators[0]}
	      		<Summary></Summary>
			</Grid>

			<Grid container>
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
			</Grid>
		</Grid>
		<br></br>
		<br></br>
		<br></br>
		<Grid container spacing={5} id="seccion1">
			<Grid>
		  		<Indicator title={'Precipitación'} subtitle={'Probabilidad'} value={0.13} />
				<br></br>
				<ControlPanel title={'Velocidad del viento'} max={rowsSpeed["max"]} maxtime={rowsSpeed["maxtime"]} min={rowsSpeed["min"]} mintime={rowsSpeed["mintime"]}/>
	    	</Grid>
			<Grid xs={12} lg={8}>
            {/* 4. Envíe la variable de estado (dataTable) como prop (input) del componente (BasicTable) */}
            	<BasicTable rows={rowsTable}></BasicTable>
        	</Grid>
			{/*<Grid xs={12} md={6} lg={9} >
		       	<BasicTable />
		    </Grid>*/}
		</Grid>
		<br></br>
		<br></br>
		<br></br>
		<Grid container spacing={5} id="seccion2">
			<Grid >
		  		<Indicator title={'Precipitación'} subtitle={'Probabilidad'} value={0.13} />
				<br></br>
				<ControlPanel title={'Temperatura (Celcius)'} max={rowsHeat["max"]} maxtime={rowsHeat["maxtime"]} min={rowsHeat["min"]} mintime={rowsHeat["mintime"]}/>
	    	</Grid>

			<Grid xs={12} lg={10}>
				<TemperatureChart rows={rowsTable}></TemperatureChart>
			</Grid>

			<Grid xs={12} lg={10}>
				<PrecipitationChart si={rowsHeat["lluvia"]}></PrecipitationChart>
			</Grid>
		</Grid>
	</Grid>

		
	)
}



export default App
