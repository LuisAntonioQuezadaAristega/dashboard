import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import {useState} from 'react';

import sunrise from '../assets/dia.jpg'
import sunset from '../assets/noche.jpg'

interface Config {
    riseday: String;
    setday: String;
    riseTime: String;
    setTime: String;
}

export default function Summary(config: Config) {

    

    let items = [
		{"imagen": sunrise, "estado": "Amanecer " + config.riseday, "tiempo": config.riseTime}, 
		{"imagen": sunset, "estado": "Atardecer " + config.setday, "tiempo": config.setTime}
	]

    

    let imagenes = items.map((item) => <CardMedia component="img" height="140" image={item["imagen"]} alt="Guayaquil"/>)
    let estados = items.map((item) => <Typography gutterBottom component="h2" variant="h6" color="primary">{item["estado"]}</Typography>)
    let tiempos = items.map((item) => <Typography component="p" variant="h5">{item["tiempo"]}</Typography>)
    let [index, setIndex] = useState([0])
    let [imagen, setImagen] = useState([imagenes[0]])
    let [texto1, setTexto1] = useState([estados[0]])
    let [texto2, setTexto2] = useState([tiempos[0]])

    const ChangeImage = () => {

        if (index[0] == 1){
            setIndex([0])
            setImagen(imagenes[0])
            setTexto1(estados[0])
            setTexto2(tiempos[0])
        }else{
            setIndex([1])
            setImagen(imagenes[1])
            setTexto1(estados[1])
            setTexto2(tiempos[1])
        }
        //return alert(index[0])
    }
    //let [selected, setSelected] = useState(-1)


    
    return (
        <Card sx={{ maxWidth: 500}}>
            <CardActionArea onClick={ChangeImage}>
                {imagen}
                <CardContent sx={{ minWidth: 450}}>
                    {texto1}
                    {texto2}
                </CardContent>
            </CardActionArea>
        </Card>
    )
}