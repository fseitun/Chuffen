import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Grid } from '@mui/material';
import { Helmet } from 'react-helmet';
import { AgregarFactura } from 'src/components/detalleOP/AgregarFactura';
import { FormDetalleOP } from 'src/components/detalleOP/FormDetalleOP';
import { GrillaDetalleOP } from 'src/components/detalleOP/GrillaDetalleOP';
import { mostrarFechaMesTXT } from 'src/utils/utils';

export function DetalleOP({ idSociety, loggedUser }) {

  const { idOP } = useParams();
  const { fecha } = useParams();  
  const { empresaId } = useParams();  
  const { numero } = useParams();

  return (
    <>
      <Helmet>
        <title>
        op:{numero} | {idSociety?.nombre}
        </title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container >

          <Box sx={{ pt: 3 }}>
            <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >

                             
                  <Grid item md={7}>
                  <Typography align="left" color="textPrimary" variant="h4">
                          Solicitud de Pago: {numero}
                        </Typography>
                  </Grid>
                  <Grid item md={5}>
                        <Typography align="right" color="textPrimary" variant="h5">
                          {mostrarFechaMesTXT(fecha)}
                        </Typography>
                  </Grid>

             

            </Grid>
          </Box>

          <Box sx={{ pt: 3 }}>
            <AgregarFactura
              OPId={idOP}
              fecha={fecha}
              empresaId={empresaId}
              idSociety={idSociety}
              loggedUser={loggedUser}
            />
          </Box>

          <Box sx={{ pt: 3 }}>
            <GrillaDetalleOP
              OPId={idOP}
              fecha={fecha}
              empresaId={empresaId}
              idSociety={idSociety}
              loggedUser={loggedUser}
            />
          </Box>
         
          <Box sx={{ pt: 3 }}>
            <FormDetalleOP
              OPId={idOP}
              fecha={fecha}
              empresaId={empresaId}
              idSociety={idSociety}
              loggedUser={loggedUser}
            />
          </Box>
    
       
        </Container>
      </Box>
    </>
  );
}
