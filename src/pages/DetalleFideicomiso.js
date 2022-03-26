import React from 'react'
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Grid } from '@mui/material';
import { useQuery } from 'react-query';
import { TabDetalleFide } from 'src/components/detalleFideicomiso/TabDetalleFide';
import { mostrarFechaMesTXT } from 'src/utils/utils';
import { getMethod } from 'src/utils/api';

export function DetalleFideicomiso({ idSociety, loggedUser }) {

  const { fideicomisoId, nombre } = useParams();
  console.log(1111, fideicomisoId, nombre);
  const{
      data: dataFide,
      isLoading,
      error,
      refetch
    } = useQuery(['dataFide', idSociety.id], () =>
      getMethod(`fideicomiso/mostrarConProducto/${idSociety.id}/${fideicomisoId}`)

  );
  
  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
/*
    var totPagosARS = 0.0 ;
    var totPagosUSD = 0.0 ;
    for(var i = 0; i < formOC?.pago.length; i++){
          if(formOC?.pago[i].moneda ==='ARS'){
            totPagosARS +=parseFloat(formOC?.pago[i].monto);
          }else{
            totPagosUSD +=parseFloat(formOC?.pago[i].monto);
          }
    }*/

  return (  
            <Container >
             
              <Box  sx={{ pt: 3 }}>
                <TabDetalleFide
                  fideicomisoId={fideicomisoId}
                  loggedUser={loggedUser}
                  dataFide={dataFide}
                  isLoading={isLoading}
                  error={error}
                  refetch={refetch}
                />
              </Box>  

            </Container>    
  );  
}
