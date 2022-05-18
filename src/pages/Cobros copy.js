import { useContext } from 'react';
import { useState } from 'react';
import { Container, Box, Hidden } from '@mui/material';
import { Helmet } from 'react-helmet';
import { FormCobro } from 'src/components/cobro/FormCobro';
import { GrillaCobro } from 'src/components/cobro/GrillaCobro';
import { useQuery } from 'react-query';
import { getMethod } from 'src/utils/api';
import { ConceptosPagoContext, FormaCobrosContext, FondosContext, EstadosPagoContext} from 'src/App';
import { FiltroCobro } from 'src/components/cobro/FiltroCobro';

export function Cobros({ idSociety, loggedUser}) {

  const [filtCont, setFiltCont] = useState(-1);
  const [filtFide, setFiltFide] = useState(-1);

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
  var fondos_s =  useContext(FondosContext); 
  var estados =  useContext(EstadosPagoContext);



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
          <Hidden smUp={(loggedUser?.['rol.cobros'] ==='vista')} >
            <Box sx={{ pt: 3 }}>
              <FormCobro idSociety={idSociety} contratos={contratos} fideicomisos={fideicomisos}  formaCobros={formaCobros} conceptosPago={conceptosPago} loggedUser={loggedUser}  refetch={refetch}/>
            </Box>
          </Hidden>
          <Box sx={{ pt: 3 }}>
            <FiltroCobro idSociety={idSociety} 
            fideicomisos={fideicomisos}  setFiltCont={setFiltCont} setFiltFide={setFiltFide}  contratos={contratos}
            />
          </Box>
          <Box sx={{ pt: 3 }}>
            <GrillaCobro idSociety={idSociety} loggedUser={loggedUser}          
            dataCobro={dataCobro} conceptosPago={conceptosPago} isLoading={isLoading}
             fondos_s={fondos_s} estados={estados} error={error} refetch={refetch}
             filtCont={filtCont} filtFide={filtFide} 
          />
         
          </Box>
        </Container>
      </Box>
    </>
  );
}