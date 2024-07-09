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
import Gauge from './components/gauge';

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

  let [raindata, setRainData] = useState([])

  let [summarys, setSummary] = useState([])

  let [gauges, setGauges] = useState([])

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

		let dataToSummary = new Array()

		let dataRain = new Array()

		{/* 
		Análisis, extracción y almacenamiento del contenido del XML 
		en el arreglo de resultados
		*/}

		let location = xml.getElementsByTagName("location")[1]
		
		let city = (xml.getElementsByTagName("name"))[0]
		dataToIndicators.push(["País, ciudad:", "Ecuador, "+city.textContent])

		let timezone = (xml.getElementsByTagName("timezone"))[0]
		dataToIndicators.push(["Zona horaria:", timezone.textContent])

		let latitude = location.getAttribute("latitude")
		dataToIndicators.push(["Latitud:", latitude])

		let longitude = location.getAttribute("longitude")
		dataToIndicators.push(["Longitud:", longitude])

		let forecast = xml.getElementsByTagName("precipitation")[0]
		let rain = parseFloat(""+forecast.getAttribute("probability"))*100
		let tiempo = xml.getElementsByTagName("time")[0]
		let raintime = (""+tiempo.getAttribute("from")).split("T")[1] + " - " + (""+tiempo.getAttribute("to")).split("T")[1]
		dataRain.push([rain, raintime])

		let sun = xml.getElementsByTagName("sun")[0]
		let sunrise = sun.getAttribute("rise")
		let sunset = sun.getAttribute("set")
		dataToSummary.push([(""+sunrise).split("T")[0], (""+sunrise).split("T")[1], (""+sunset).split("T")[0], (""+sunset).split("T")[1]])

		//console.log(rain)

		{/* Renderice el arreglo de resultados en un arreglo de elementos Indicator */}

		let indicatorsElements = Array.from(dataToIndicators).map(
			(element) => <Indicator title={element[0]} value={element[1]}/>
		)

		let rainElements = Array.from(dataRain).map(
			(element) => <PrecipitationChart si={element[0]} title={element[1]}/>
		)

		let summaryElements = Array.from(dataToSummary).map(
			(element) => <Summary riseday={element[0]} riseTime={element[1]} setday={element[2]} setTime={element[3]}/>
		)

		let humedad = xml.getElementsByTagName("humidity")[0]
		let gaugeElements = <Gauge title={"humedad"} value={parseInt(""+humedad.getAttribute("value"))}/>
		   
		{/* Modificación de la variable de estado mediante la función de actualización */}

		setIndicators(indicatorsElements)
		setRainData(rainElements)
		setSummary(summaryElements)
		setGauges(gaugeElements)


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

			return { "hoursFrom": hoursFrom, "hoursTo": hoursTo, "windSpeed": windSpeed, "windDirection": windDirection, "temperature": temperature, "maxtemp": maxtemp, "mintemp": mintemp, "hoursprom": hoursprom}
		   
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
		{/* 3. Actualice de la variable de estado mediante la función de actualización */}

		setRowsTable(arrayObjects)
		setRowsSpeed({ "max": maxspeed, "maxtime": maxspeedtime, "min": minspeed, "mintime": minspeedtime})
		setRowsHeat({ "max": maxheat+" Celcius", "maxtime": maxheatTime, "min": minheat+" Celcius", "mintime": minheattime})

	})()


},[])

  return (
	
	<Grid>
		<Grid container spacing={5} id="seccion1">
			<Grid alignContent={"center"}>
				{indicators[0]}
				<br></br>
				{indicators[1]}
			</Grid>
			<Grid alignContent={"center"}>
				{summarys}
			</Grid>
			<Grid>
				{gauges}
			</Grid>
			<Grid alignContent={"center"}>
				{indicators[2]}
				<br></br>
				{indicators[3]}
			</Grid>
		</Grid>

		{/*
		<Grid container spacing={5}>
	      	<Summary></Summary>
			{indicators[0]}
	      	<Summary></Summary>
		</Grid>*/}

		
		<br></br>
		<br></br>
		<br></br>
		<Grid container spacing={5} id="seccion2">
			<Grid alignContent={"center"}>
				<ControlPanel title={'Velocidad del viento'} max={rowsSpeed["max"]} maxtime={rowsSpeed["maxtime"]} min={rowsSpeed["min"]} mintime={rowsSpeed["mintime"]} color={"#2871DB"} fondo={"white"}/>
	    	</Grid>
			<Grid alignContent={"center"}>
            {/* 4. Envíe la variable de estado (dataTable) como prop (input) del componente (BasicTable) */}
				<h2>Tabla de viento 1</h2>
            	<BasicTable rows={rowsTable.slice(0,4)}></BasicTable>
        	</Grid>
			<Grid alignContent={"center"}>
				<h2>Tabla de viento 2</h2>
				<BasicTable rows={rowsTable.slice(4,8)}></BasicTable>
        	</Grid>
			{/*<Grid xs={12} md={6} lg={9} >
		       	<BasicTable />
		    </Grid>*/}
		</Grid>
		<br></br>
		<br></br>
		<br></br>
		<Grid container spacing={5} id="seccion3">
			<Grid alignContent={"center"}>
				<ControlPanel title={'Temperatura (Celcius)'} max={rowsHeat["max"]} maxtime={rowsHeat["maxtime"]} min={rowsHeat["min"]} mintime={rowsHeat["mintime"]} color={"#c0752e"} fondo={"#F2E6D8"}/>
	    	</Grid>

			<Grid alignContent={"center"}>
				<h2>Temperatura (Celcius) vs Tiempo (Horas)</h2>
				<TemperatureChart rows={rowsTable}></TemperatureChart>
			</Grid>

			{raindata[0]}
		</Grid>
	</Grid>

		
	)
}



export default App
