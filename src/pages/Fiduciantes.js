
import { Container, Box, Typography} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { getMethod } from 'src/utils/api';
import Grid from '@mui/material/Grid';
import { TabFidu } from 'src/components/fiduciante/TabFidu';
//import { FormProveedor } from 'src/components/proveedores/FormProveedor';
//import { GrillaProveedor } from 'src/components/proveedores/GrillaProveedor';

export function Fiduciantes({ idSociety, loggedUser }) {

  const tipo = 1; // 1 = Fiduciantes  0 = Proveedores
 /* const{
    data: dataEmp,
    isLoading,
    error,
    refetch
  } = useQuery(['dataEmp', idSociety.id], () =>
    getMethod(`empresa/listar/${idSociety.id}/${tipo}`)

);*/

  return (
    <>
      <Helmet>
        <title>Fiduciantes | {idSociety?.nombre ?? ''}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container >
          <Box  sx={{ pt: 3 }}>
            <TabFidu
              idSociety={idSociety}
              loggedUser={loggedUser}
              tipo={tipo}
      
            />
          </Box>
        </Container>
      </Box>
    </>
  );
}

