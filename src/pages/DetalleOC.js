import React from 'react'
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Grid } from '@mui/material';
import { useQuery } from 'react-query';
import { TabOC } from 'src/components/detalleOC/TabOC';
import { mostrarFechaMesTXT } from 'src/utils/utils';
import { getMethod } from 'src/utils/api';

export function DetalleOC({ idSociety, loggedUser }) {

  const { idOC } = useParams();

  const{
      data: formOC,
      isLoading,
      error,
      refetch
    } = useQuery(['formOC', idSociety.id], () =>
      getMethod(`oc/mostrarConDetalle/${idSociety.id}/${idOC}`)

  );
  
  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else

    var totPagosARS = 0.0 ;
    var totPagosUSD = 0.0 ;
    for(var i = 0; i < formOC?.pago.length; i++){
          if(formOC?.pago[i].moneda ==='ARS'){
            totPagosARS +=parseFloat(formOC?.pago[i].monto);
          }else{
            totPagosUSD +=parseFloat(formOC?.pago[i].monto);
          }
    }

  return (  
            <Container >

              <Box sx={{ pt: 3 }}>
                <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >                                
                  <Grid item md={2.2}>
                    <Typography align="left" color="textPrimary" variant="h4">
                          Orden de Compra:
                    </Typography>
                  </Grid>
                  <Grid item md={7}>
                      <Typography align="left" color="textPrimary" variant="h4">
                      { formOC?.oc?.id}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Razon Social: { formOC?.oc?.empresas[0]?.razonSocial}&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;{ formOC?.oc?.fideicomisos[0]?.nombre}
                      </Typography>
                  </Grid>
                  <Grid item md={2.8}>
                        <Typography align="right" color="textPrimary" variant="h5">
                          {mostrarFechaMesTXT(formOC?.oc?.createdAt)}
                        </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box  sx={{ pt: 3 }}>
                <TabOC
                    OCId={idOC}
                    idSociety={idSociety}
                    loggedUser={loggedUser}
                    formOC={formOC}
                    isLoading={isLoading}
                    error={error}
                    totPagosARS ={totPagosARS}
                    totPagosUSD ={totPagosUSD} 
                    refetch={refetch}
                  />
              </Box>  

            </Container>    
  );  
}