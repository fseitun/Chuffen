import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { PageCobro } from 'src/components/cobro/PageCobro';
import { useQuery } from 'react-query';
import { getMethod } from 'src/utils/api';

export function Cobros({ idSociety, loggedUser, contrato}) {

  const { data: fideicomisos } = useQuery(
    ['fideicomisos'],
    () => getMethod(`fideicomiso/listarEmpresa/${idSociety.id}`));

  return (
    <>
      <Helmet>
        <title>Cobros | {idSociety?.nombre ?? ''}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3,
        }}
      >
        <Container maxWidth={false}>
      
              <PageCobro 
                  mode={"cobro"} 
                  fideicomisos={fideicomisos}
                  idSociety={idSociety}
                  loggedUser={loggedUser}
                  contrato={contrato}
              />
      
        </Container>
      </Box>
    </>
  );
}