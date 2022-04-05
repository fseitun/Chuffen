import React from 'react'
import { useParams } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { useQuery } from 'react-query';
import { TabContrato } from 'src/components/contrato/TabContrato';
import { getMethod } from 'src/utils/api';

export function Contrato({ idSociety, loggedUser }) {

  const { fideicomisoId } = useParams();
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

  return (  
            <Container >
             
              <Box  sx={{ pt: 3 }}>
                <TabContrato
                  idSociety={idSociety}
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
