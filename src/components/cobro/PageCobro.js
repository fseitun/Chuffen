import { useContext } from 'react';
import { useState } from 'react';
import { Box, Hidden } from '@mui/material';
import { FormCobro } from 'src/components/cobro/FormCobro';
import { GrillaCobro } from 'src/components/cobro/GrillaCobro';
import { useQuery } from 'react-query';
import { getMethod } from 'src/utils/api';
import { ConceptosPagoContext, FormaPagosFiduContext, EstadosPagoContext} from 'src/App';
import { FiltroCobro } from 'src/components/cobro/FiltroCobro';

export function PageCobro({ mode, idSociety, loggedUser, fideicomisos, contrato}) {

  const [filtCont, setFiltCont] = useState(-1);
  const [filtFide, setFiltFide] = useState(-1);

  const {
    data: dataCobro,
    isLoading,
    error,
    refetch,
  } = useQuery(['cobro', idSociety], () => getMethod(`cobro/listar/${idSociety.id}/${(mode ==='contrato')? contrato?.id:0}/*/*`));

  //////////////////////////////////////////////////////////////////
  /////////// ver //////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  const { data: contratos } = useQuery(
    ['contratos'],
    () => getMethod(`contrato/listar/${idSociety.id}/0`));

  const { data: cuentas_destino} = useQuery(
    ['cuentabanco'], 
    () => getMethod(`cuentabanco/listarB/${idSociety.id}/*`));
  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////
  // var cuentas_destino = [{}];

  var conceptosPago = useContext(ConceptosPagoContext);
  // var formaCobros = useContext(FormaCobrosContext); 
  var formaPagosFidu =  useContext(FormaPagosFiduContext); 
  // var fondos_s =  useContext(FondosContext); 
  var estados =  useContext(EstadosPagoContext);


  return (
    <>

          <Hidden smUp={(loggedUser?.['rol.cobros'] ==='vista')} >
            <Box sx={{ pt: 3 }}>
              <FormCobro idSociety={idSociety}  
              mode={mode} 
              contrato={contrato}  
              contratos={contratos} 
              fideicomisos={fideicomisos}  
              formaPagosFidu={formaPagosFidu} 
              conceptosPago={conceptosPago} 
              loggedUser={loggedUser}  
              refetch={refetch}/>
            </Box>
          </Hidden>

          <Hidden smUp={(mode ==='contrato')} >
            <Box sx={{ pt: 3 }}>
              <FiltroCobro idSociety={idSociety} 
                fideicomisos={fideicomisos}               
                setFiltCont={setFiltCont} setFiltFide={setFiltFide}  contratos={contratos}
              />
            </Box>
          </Hidden>          
     
          <Box sx={{ pt: 3 }}>
              <GrillaCobro 
                idSociety={idSociety} loggedUser={loggedUser}   
                formaPagosFidu={formaPagosFidu}
                mode={mode} 
                contratoId={contrato?.cont?.id}        
                dataCobro={dataCobro} 
                conceptosPago={conceptosPago} 
                isLoading={isLoading}
                cuentas_destino={cuentas_destino} 
                estados={estados} error={error} refetch={refetch}
                filtCont={filtCont} filtFide={filtFide} 
            />
         
          </Box>

    </>
  );
}