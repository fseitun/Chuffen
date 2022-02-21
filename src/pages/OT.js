import { Container, Box, Hidden } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { ManipularOT } from 'src/components/OT/ManipularOT';
import { FiltroOT } from 'src/components/OT/FiltroOT';
import { GrillaOT } from 'src/components/OT/GrillaOT';
import { useQuery } from 'react-query';
import { getMethod } from 'src/utils/api';

export function OT({ idSociety, loggedUser }) {

  var blue = 0;
  if(loggedUser?.['rol.op'] ==='total'){blue= -1;}

  const {
    data: opInformation,
    isLoading,
    error,
    // refetch
  } = useQuery(['OP', idSociety], () => getMethod(`OP/listar/${idSociety.id}/todas/nulo/${blue}/0/0/0`));


  const { data: fideicomisos } = useQuery(
    ['fideicomisos'],
    () => getMethod(`fideicomiso/listar/${idSociety.id}`));


  const { data: proveedores } = useQuery(
    ['proveedores'],
    () => getMethod(`proveedor/listar/${idSociety.id}`));


  const { data: ddfacturas } = useQuery(
    ['ddfacturas'],
    () => getMethod(`factura/listar/${idSociety.id}/opid/0/0`));

  const { data: ddfacturasBlue } = useQuery(
    ['ddfacturasBlue'],
    () => getMethod(`factura/listar/${idSociety.id}/opid/0/1`));


  const [filtFide, setFiltFide] = useState(-1);
  const [filtRS, setFiltRS] = useState(-1);
  const [filtEst, setFiltEst] = useState(-1);
  
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
              <ManipularOT idSociety={idSociety}  loggedUser={loggedUser} fideicomisos={fideicomisos} proveedores={proveedores}  ddfacturas={ddfacturas} ddfacturasBlue={ddfacturasBlue} />
            </Box>
          </Hidden>

          <Box sx={{ pt: 3 }}>
            <FiltroOT idSociety={idSociety}  loggedUser={loggedUser} 
            fideicomisos={fideicomisos}  setFiltFide={setFiltFide} setFiltRS={setFiltRS} setFiltEst={setFiltEst} proveedores={proveedores} ddfacturas={ddfacturas} ddfacturasBlue={ddfacturasBlue}
            />
          </Box>


          <Box sx={{ pt: 3 }}>
            <GrillaOT idSociety={idSociety}  loggedUser={loggedUser} opInformation={opInformation} filtFide={filtFide} filtRS={filtRS} filtEst={filtEst}  isLoading={isLoading}  error={error} />
          </Box>
        </Container>
      </Box>
    </>
  );
}

