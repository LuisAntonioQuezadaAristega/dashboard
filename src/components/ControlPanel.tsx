import { useState, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Config {
    title: String;
    max: String;
	maxtime: String;
	min: String;
	mintime: String;
}

export default function ControlPanel(config: Config) {

	{/* Datos de los elementos del Select */}

	let items = [
		{"valor":"Valor máxima", "description":"El valor máxima es:", "dato":config.max, "tiempo":config.maxtime}, 
		{"valor": "Valor minima", "description":"El valor minima es:", "dato":config.min, "tiempo":config.mintime}
	]

	let options = items.map( (item, key) => <MenuItem key={key} value={key}>{item["valor"]}</MenuItem>)

    {/* Variable de estado y función de actualización */}

    let [selected, setSelected] = useState(-1)

	{/* Variable de referencia a un elemento */ }

    const descriptionRef = useRef<HTMLDivElement>(null);
	const dato = useRef<HTMLDivElement>(null);
	const descriptiontime = useRef<HTMLDivElement>(null);
	const tiempo = useRef<HTMLDivElement>(null);

    {/* Manejador de eventos */}

	const handleChange = (event: SelectChangeEvent) => {

		let idx = parseInt(event.target.value)
		setSelected( idx );

		{/* Modificación de la referencia */}

		if (descriptionRef.current && dato.current && descriptiontime.current && tiempo.current) {
			descriptionRef.current.innerHTML = (idx >= 0) ? items[idx]["description"] : ""
			dato.current.innerHTML = (idx >= 0) ? ""+items[idx]["dato"] : ""
			descriptiontime.current.innerHTML = (idx >= 0) ? "Y ocurre entre las:" : ""
			tiempo.current.innerHTML = (idx >= 0) ? ""+items[idx]["tiempo"] : ""
		}

	};

	{/* JSX */}

    return (
		<Paper
			sx={{
					p: 2,
					display: 'flex',
					flexDirection: 'column'
				}}>

				<Typography gutterBottom component="h2" variant="h6" color="primary">
					{config.title}
				</Typography>
				
				<Box sx={{ minWidth: 120 }}>
					
					<FormControl fullWidth>
						<InputLabel id="simple-select-label">Mostrar</InputLabel>
						<Select
         					labelId="simple-select-label"
         					id="simple-select"
         					label="Variables"
         					defaultValue='-1'
         					onChange={handleChange}
     					>
							<MenuItem key="-1" value="-1" disabled>Escoja una opcion</MenuItem>
   
							{options}
   
						</Select>
					</FormControl>

					{/* Muestra la descripción de la variable seleccionada */}
					<Typography ref={descriptionRef} mt={2} component="p" color="text.secondary" />
					<Typography ref={dato} mt={2} component="p" color="text.secondary" />
					<Typography ref={descriptiontime} mt={2} component="p" color="text.secondary" />
					<Typography ref={tiempo} mt={2} component="p" color="text.secondary" />

				</Box>
				
		</Paper>
    )
}