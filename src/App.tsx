import { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Indicator from './components/Indicator';
import Summary from './components/Summary';
import ControlPanel from './components/ControlPanel';

import TemperatureChart from './components/TemperatureChart';
import './App.css'
import PrecipitationChart from './components/PrecipitationChart';
import Gauge from './components/gauge';
import Seccion from './components/Seccion';

function App() {
  let ArrayAny : any[] = [];

  let [indicators, setIndicators] = useState(ArrayAny)

  let [raindata, setRainData] = useState(ArrayAny)

  let [summarys, setSummary] = useState(ArrayAny)

  let [gauges, setGauges] = useState(ArrayAny)

  let [rowsTable, setRowsTable] = useState(ArrayAny)

  let [rowsHeat, setRowsHeat] = useState({ "max": "", "maxtime": "", "min": "", "mintime": ""})
	
  useEffect(()=>{

	(async ()=>{

         let savedTextXML = localStorage.getItem("openWeatherMap")
         let expiringTime = localStorage.getItem("expiringTime")

         let nowTime = (new Date()).getTime();

         if(expiringTime === null || nowTime > parseInt(expiringTime)) {

			let API_KEY = "1835b23e7d0c0a071ef3586f8db8f8c5"
			let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
			let savedTextXML = await response.text();
			let hours = 1
			let delay = hours * 3600000

			localStorage.setItem("openWeatherMap", savedTextXML)
			localStorage.setItem("expiringTime", (nowTime + delay ).toString() )
		}


		const parser = new DOMParser();
		const xml = parser.parseFromString(""+savedTextXML, "application/xml");


		let dataToIndicators = new Array()

		let dataToSummary = new Array()

		let dataRain = new Array()


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
		let gaugeElements = Array.from(dataToSummary).map(() => <Gauge title={"humedad"} value={parseInt(""+humedad.getAttribute("value"))}/>)
		   

		setIndicators(indicatorsElements)
		setRainData(rainElements)
		setSummary(summaryElements)
		setGauges(gaugeElements)

        let arrayObjects = Array.from( xml.getElementsByTagName("time") ).map( (timeElement) =>  {
				
			let hoursFrom = (""+timeElement.getAttribute("from")).split("T")[1]

			let hoursTo = (""+timeElement.getAttribute("to")).split("T")[1]

			let windSpeed = timeElement.getElementsByTagName("windSpeed")[0].getAttribute("mps") + " "+  timeElement.getElementsByTagName("windSpeed")[0].getAttribute("unit")

			let windGust = timeElement.getElementsByTagName("windGust")[0].getAttribute("gust") + " "+  timeElement.getElementsByTagName("windGust")[0].getAttribute("unit")

			let windDirection = timeElement.getElementsByTagName("windDirection")[0].getAttribute("deg") + " "+  timeElement.getElementsByTagName("windDirection")[0].getAttribute("code") 

			let maxtemp = Math.round((parseFloat(""+timeElement.getElementsByTagName("temperature")[0].getAttribute("max")) - 273.15) * 100)/100

			let mintemp = Math.round((parseFloat(""+timeElement.getElementsByTagName("temperature")[0].getAttribute("min")) - 273.15) * 100)/100

			let temperature = ((maxtemp + mintemp)/2)

			let hoursprom = ( ((parseInt(hoursFrom.split(":")[0]) + parseInt(hoursTo.split(":")[0]))/2) - 0.5)+":30"

			return { "hoursFrom": hoursFrom, "hoursTo": hoursTo, "windSpeed": windSpeed, "windDirection": windDirection, "temperature": temperature, "maxtemp": maxtemp, "mintemp": mintemp, "hoursprom": hoursprom, "windGust":windGust, "wind":["", windSpeed, windGust]}
		   
		})

		arrayObjects = arrayObjects.slice(0,8)

		let maxheat = "0.0"
		let maxheatTime = ""
		let minheat = "1000.0"
		let minheattime = ""
		for(const index in arrayObjects){

			if(parseFloat(maxheat) < arrayObjects[index]["maxtemp"]){
				maxheat = ""+arrayObjects[index]["maxtemp"]
				maxheatTime = arrayObjects[index]["hoursFrom"] + " - " + arrayObjects[index]["hoursTo"]
			}

			if(parseFloat(minheat) > arrayObjects[index]["mintemp"]){
				minheat = ""+arrayObjects[index]["mintemp"]
				minheattime = arrayObjects[index]["hoursFrom"] + " - " + arrayObjects[index]["hoursTo"]
			}
		}

		setRowsTable(arrayObjects)
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

		
		<br></br>
		<br></br>
		<br></br>
		<Seccion rows={rowsTable}></Seccion>
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
