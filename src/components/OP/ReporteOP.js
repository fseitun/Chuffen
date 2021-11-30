import { Helmet } from 'react-helmet';
import { Box, Avatar, Container, Typography, Grid} from '@mui/material';
// import { Formik, Form, Field } from 'formik';

export function ReporteOP({ miOP }) {
  
    return (
    <>

<Helmet>
        <title>aaaaaa | { miOP }</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <div>*************************************************************</div> 
        <div>**** Inicio componente ReporteOP.ja a convertir a PDF *******</div> 
        <div>*************************************************************</div> 
        <Avatar sx={{ bgcolor: 'green' }} variant="square">
          N
        </Avatar>
        <div>lalala laala</div>  
        <Container >
          <Box sx={{ pt: 3 }}>

          <Typography align="left" color="textPrimary" variant="h5">
                          Fecha
                        </Typography>  
 
                        <Grid item md={4}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          Descripción
                        </Typography>   
                                 
                  </Grid>  
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          Fecha
                        </Typography>                      
                  </Grid>  
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          Monto
                        </Typography>                
                  </Grid>          
          
          </Box>       
        </Container>
      </Box>
    </>
  );
}


