import { Container, Box, Hidden } from '@mui/material';
import { useState, useEffect } from 'react';
// import { useQuery} from 'react-query';
import { getMethod } from 'src/utils/api';
import { Helmet } from 'react-helmet';
import { FormFactura } from 'src/components/factura/FormFactura';
import { FiltroFactura } from 'src/components/factura/FiltroFactura';
import { GrillaFactura } from 'src/components/factura/GrillaFactura';

export function Factura({ idSociety , loggedUser}) {

  const [filtComp, setFiltComp] = useState(-1);
  const [filtFide, setFiltFide] = useState(-1);
  const [filtRS, setFiltRS] = useState(-1); 

  const [fideicomisos, setFideicomisos] = useState([]);  
  const [proveedores, setProveedores] = useState([]);  
  
  useEffect((idSociety) => {
    let id = idSociety?.id > 0? idSociety.id:JSON.parse(localStorage.getItem("idSociety"))?.id;
    getMethod(`fideicomiso/listar/${id}`).then((items) => setFideicomisos(items));
    getMethod(`empresa/listar/${id}/0`).then((items) => setProveedores(items));
  }, []);

  return (
    <>
      <Helmet>
        <title>Facturas | {idSociety?.nombre ?? ''}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Hidden smUp={(loggedUser?.['rol.factura'] ==='vista')} >
          <Box sx={{ pt: 3 }} >
            <FormFactura idSociety={idSociety} loggedUser={loggedUser} fideicomisos={fideicomisos} proveedores={proveedores} />
          </Box>
          </Hidden> 
          <Box sx={{ pt: 3 }}>
            <FiltroFactura idSociety={idSociety} 
            fideicomisos={fideicomisos}  setFiltComp={setFiltComp} setFiltFide={setFiltFide} setFiltRS={setFiltRS}  proveedores={proveedores}
            />
          </Box>
    
          <Box sx={{ pt: 3 }}>
            <GrillaFactura idSociety={idSociety} loggedUser={loggedUser}
            filtComp={filtComp} filtFide={filtFide} filtRS={filtRS}  />
          </Box>
        </Container>
      </Box>
    </>
  );
}
