import { Container, Box, Hidden } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery} from 'react-query';
import { getMethod } from 'src/utils/api';
import { FormEmpresa } from 'src/components/empresa/FormEmpresa';
import { GrillaEmpresa } from 'src/components/empresa/GrillaEmpresa';
import { FiltroEmpresa } from 'src/components/empresa/FiltroEmpresa';

export function Proveedores({ idSociety, loggedUser }) {

  const [filtRS, setFiltRS] = useState(-1); 

  const {
    data: empresaInformation,
    isLoading,
    error,
  } = useQuery(['empresa', idSociety], () => getMethod(`empresa/listar/${idSociety.id}/${tipo}`));


  const tipo = 0; // 1 = Fiduciantes  0 = Proveedores

  console.log(222, filtRS);

  return (
    <>
      <Helmet>
        <title>Proveedores | {idSociety?.nombre ?? ''}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Hidden smUp={(loggedUser['rol.proveedor'] ==='vista')} >
            <Box sx={{ pt: 3 }}>
              <FormEmpresa idSociety={idSociety} loggedUser={loggedUser} tipo={tipo} />
            </Box>
          </Hidden> 

          <Box sx={{ pt: 3 }}>
            <FiltroEmpresa idSociety={idSociety} 
            setFiltRS={setFiltRS}  proveedores={empresaInformation}
            />
          </Box>

          <Box sx={{ pt: 3 }}>
            <GrillaEmpresa idSociety={idSociety} loggedUser={loggedUser} tipo={tipo}  filtRS={filtRS}  isLoading={isLoading} error={error} empresaInformation={empresaInformation}  />
          </Box>
        </Container>
      </Box>
    </>
  );
}
