import { ChangeEvent, useState } from 'react';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

export default function ControlPanel() {

    {/* variable de estado y función de actualización */}

	let emptyArray = new Array<String>()
	let [checked, setChecked] = useState(emptyArray)

    {/* manejador de eventos */}
	
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {

        {/* Copia del arreglo (variable de estado) con el operador spread  */ }
        let copy = [...checked]

        let element = event.target.name

        {/* Indice del elemento en el arreglo. Si no existe en el arreglo, el resultado es -1 */ }
        let index = copy.indexOf(element)

        if (index != -1) {

            {/* Filtra los elementos del arreglo que sean diferentes del elemento seleccionado */ }
            let copyFilter = copy.filter(value => value !== element)

            {/* Actualiza la variable de estado checked */ }
            setChecked([...copyFilter])
        } else {

            {/* Actualiza la variable de estado checked */ }
            setChecked([...copy, element])
        }


    };

    return (
		<Paper
			sx={{
					p: 2,
					display: 'flex',
					flexDirection: 'column'
				}}>

				<Typography gutterBottom component="h2" variant="h6" color="primary">
					Controles
				</Typography>

				<FormControlLabel
					control={
							<Checkbox
								name="precipitation"
								value="precipitation"
                                onChange={handleChange}
							/>}
					label="Precipitación"
				/>

				<FormControlLabel
					control={
							<Checkbox
								name="humidity"
								value="humidity"
                                onChange={handleChange}
							/>}
					label="Humedad"
				/>
                
            {/* Temporal: Muestra los elementos seleccionados */}
			<ul>
				{
				    checked.map(el => <li> {el} </li>)
				}
			</ul>
		</Paper>
    )
}