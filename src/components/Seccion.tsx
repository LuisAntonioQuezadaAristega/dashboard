import BasicTable from './BasicTable';
import Grid from '@mui/material/Unstable_Grid2';
import { useState, useRef, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Config {
    rows: Array<object>;
}

export default function Seccion(data:Config) {
	let ArrayAny : any[] = [];
  	let [rows, setRows] = useState(ArrayAny)
	let [index, setIndex] = useState(0)
	let [titulo1, setTitulo1] = useState("")
	let [titulo2, setTitulo2] = useState("")
  	useEffect( () => {

    (()=> {

        setRows(data.rows)

    })()

  	}, [data] )

	let items = [
		{"valor":"Viento", "descr1": "Corrientes de aire en la", "descr2": "atmósfera"}, 
		{"valor": "Rafaga", "descr1": "Viento fuerte, repentino", "descr2": "y de corta duración."}
	]

	let options = items.map( (item, key) => <MenuItem key={key} value={key}>{item["valor"]}</MenuItem>)

    let [selected, setSelected] = useState(-1)

	const info1 = useRef<HTMLDivElement>(null);
	const info2 = useRef<HTMLDivElement>(null);

    {/* Manejador de eventos */}

	const handleChange = (event: SelectChangeEvent) => {

		selected = parseInt(event.target.value)
		setSelected( selected );

		{/* Modificación de la referencia */}

		if (info1.current && info2.current) {
			info1.current.innerHTML = (selected >= 0) ? ""+items[selected]["descr1"] : ""
			info2.current.innerHTML = (selected >= 0) ? ""+items[selected]["descr2"] : ""
		}

		if (selected == 0){
			setTitulo1("Tabla de viento 1")
			setTitulo2("Tabla de viento 2")
			setIndex(1)
		}
		if(selected == 1){
			setTitulo1("Tabla de rafaga 1")
			setTitulo2("Tabla de rafaga 2")
			setIndex(2)
		}

	};

	{/* JSX */}

    return (
        <Grid container spacing={5} id="seccion2">
			<Grid alignContent={"center"}>
		    <Paper
			    sx={{
					p: 2,
					display: 'flex',
					flexDirection: 'column',
					backgroundColor: "white",
				}}>

				<Typography gutterBottom component="h2" variant="h6" color={"#2871DB"}>
					Velocidad de
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
					<Typography ref={info1} mt={2} component="p" color="text.secondary" />
					<Typography ref={info2} mt={2} component="p" color="text.secondary" />

				</Box>
				
		    </Paper>
			</Grid>
            <Grid alignContent={"center"}>
				<h2>{titulo1}</h2>
            	<BasicTable rows={rows.slice(0,4)} index={index}></BasicTable>
        	</Grid>
			<Grid alignContent={"center"}>
				<h2>{titulo2}</h2>
				<BasicTable rows={rows.slice(4,8)} index={index}></BasicTable>
        	</Grid>
        </Grid>
    )
}