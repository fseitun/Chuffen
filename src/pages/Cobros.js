import { useContext } from 'react';
import { Container, Box } from '@mui/material';
import { Helmet } from 'react-helmet';
import { FormCobro } from 'src/components/cobro/FormCobro';
import { GrillaCobro } from 'src/components/cobro/GrillaCobro';
import { useQuery } from 'react-query';
import { getMethod } from 'src/utils/api';
import { ConceptosPagoContext, FormaCobrosContext} from 'src/App';

export function Cobros({ idSociety, loggedUser}) {

  const {
    data: dataCobro,
    isLoading,
    error,
    refetch,
  } = useQuery(['cobro', idSociety], () => getMethod(`cobro/listar/${idSociety.id}/0`));

  const { data: contratos } = useQuery(
    ['contratos'],
    () => getMethod(`contrato/listar/${idSociety.id}/0`));

  const { data: fideicomisos } = useQuery(
    ['fideicomisos'],
    () => getMethod(`fideicomiso/listar/${idSociety.id}`));   

  var conceptosPago = useContext(ConceptosPagoContext);
  var formaCobros = useContext(FormaCobrosContext);  

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
          <Box sx={{ pt: 3 }}>
          <FormCobro idSociety={idSociety} contratos={contratos} fideicomisos={fideicomisos}  formaCobros={formaCobros} conceptosPago={conceptosPago} loggedUser={loggedUser}  refetch={refetch}/>
          </Box>
          <Box sx={{ pt: 3 }}>
          <GrillaCobro idSociety={idSociety} loggedUser={loggedUser}          
          dataCobro={dataCobro} conceptosPago={conceptosPago} isLoading={isLoading} error={error} refetch={refetch}
          />
          </Box>
        </Container>
      </Box>
    </>
  );
}