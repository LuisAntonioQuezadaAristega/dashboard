import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import { Grid } from '@mui/material';
import Gauge from './gauge';

export default function InteractiveSection() {

    let format1 = {maxWidth: 345, backgroundColor:'blue'}
    let format2 = {maxWidth: 345, backgroundColor:'white'}
    let format3 = {maxWidth: 345}

    const handleClick = ()=>{
        format2.backgroundColor = 'blue'
    }

    return (
        <Grid container spacing={5}>
            <Grid>
                <Gauge title={"windGust"} value={5.13}></Gauge>
            </Grid>

            <Grid>
                <Card sx={format1}>
                    <CardActionArea>
                        <CardContent>
                            <Typography color="text.secondary" component="p">
                                05:19:08 - 05:19:08
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <br></br>
                <Card sx={format2} onClick={handleClick}>
                    <CardActionArea>
                        <CardContent>
                            <Typography color="text.secondary" component="p">
                                05:19:08 - 05:19:08
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <br></br>
                <Card sx={format3}>
                    <CardActionArea>
                        <CardContent>
                            <Typography color="text.secondary" component="p">
                                05:19:08 - 05:19:08
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>

            <Grid>
                <Gauge title={"windGust"} value={5.13}></Gauge>
            </Grid>
        </Grid>
    );
  }