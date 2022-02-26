import { Container, Box, Hidden } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ManipularOC } from 'src/components/OC/ManipularOC';
import { FiltroOC } from 'src/components/OC/FiltroOC';
import { GrillaOC } from 'src/components/OC/GrillaOC';
import { useQuery } from 'react-query';
import { getMethod } from 'src/utils/api';

export function OC({ idSociety, loggedUser }) {

  var blue = 0;
  if(loggedUser?.['rol.op'] ==='total'){blue= -1;}

  const {
    data: opInformation,
    isLoading,
    error,
    // refetch
  } = useQuery(['OC', idSociety], () => getMethod(`OC/listar/${idSociety.id}/todas`));


  const { data: fideicomisos } = useQuery(
    ['fideicomisos'],
    () => getMethod(`fideicomiso/listar/${idSociety.id}`));


  const { data: proveedores } = useQuery(
    ['proveedores'],
    () => getMethod(`proveedor/listar/${idSociety.id}`));


  const [filtFide, setFiltFide] = useState(-1);
  const [filtRS, setFiltRS] = useState(-1);

  /*
         <Box sx={{ pt: 3 }}>
            <FiltroOC idSociety={idSociety}  loggedUser={loggedUser} 
            fideicomisos={fideicomisos}  setFiltFide={setFiltFide} setFiltRS={setFiltRS} setFiltEst={setFiltEst} proveedores={proveedores} ddfacturas={ddfacturas} ddfacturasBlue={ddfacturasBlue}
            />
          </Box>


          <Box sx={{ pt: 3 }}>
            <GrillaOC idSociety={idSociety}  loggedUser={loggedUser} opInformation={opInformation} filtFide={filtFide} filtRS={filtRS} filtEst={filtEst}  isLoading={isLoading}  error={error} />
          </Box>*/
  
  return (
    <>
      <Helmet>
        <title>OP's | TSF Desarrollos</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}>
        <Container maxWidth={false}>
          <Hidden smUp={(loggedUser?.['rol.factura'] ==='vista')} >
            <Box sx={{ pt: 3 }}>
              <ManipularOC idSociety={idSociety}  loggedUser={loggedUser} fideicomisos={fideicomisos} proveedores={proveedores} />
            </Box>
          </Hidden>

   
        </Container>
      </Box>
    </>
  );
}

