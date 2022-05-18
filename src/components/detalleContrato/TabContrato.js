import * as React from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Hidden} from '@mui/material';
import { AltaCuota } from 'src/components/detalleContrato/AltaCuota';
import { GrillaCuota } from 'src/components/detalleContrato/GrillaCuota';
import { GrillaItems } from 'src/components/detalleContrato/GrillaItems';
import { PageCobro } from 'src/components/cobro/PageCobro';

export function TabContrato({ OCId,  idSociety, loggedUser, conceptosCuota, dataContrato, isLoading, error, refetch, moneda, setMoneda, CACs}) {



  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setMoneda(newValue);
  };

  let verAgregar = (loggedUser?.['rol.contrato'] ==='vista'); // si es vista, no ve boton agregar 

  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    return (
          
    <>

          <TabContext value={moneda}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Cobros" value="COB" />
                <Tab label="Liquidaciones" disabled={true}  value="LIQ" />
                <Tab label="Compromisos en Pesos" value="ARS" />
                <Tab label="Compromisos en Dolares" value="USD" />
                <Tab label="Productos" value="PRD" />
                
              </TabList>
            </Box>
            <TabPanel value="COB">

              <Box sx={{ pt: 3 }}>
                
                <PageCobro 
                    mode={"contrato"} 
                    idSociety={idSociety}
                    loggedUser={loggedUser}
                    contrato={dataContrato?.cont}
                />
              
              </Box>

            </TabPanel>
            <TabPanel value="LIQ">
            </TabPanel>
            <TabPanel value="ARS">

              <Hidden  smUp={verAgregar} >
                <Box sx={{ pt: 3 }}>
                  <AltaCuota
                        OCId={OCId}
                        idSociety={idSociety}
                        loggedUser={loggedUser}
                        dataContrato={dataContrato}
                        isLoading={isLoading}
                        error={error}
                        refetch={refetch}
                        moneda={'ARS'}
                        conceptosCuota={conceptosCuota}
                  />
                </Box>
              </Hidden>
              <Box sx={{ pt: 3 }}>                    
                <GrillaCuota
                      OCId={OCId}
                      idSociety={idSociety}
                      loggedUser={loggedUser}
                      dataContrato={dataContrato}
                      isLoading={isLoading}
                      error={error}
                      refetch={refetch}
                      conceptosCuota={conceptosCuota}
                      moneda={'ARS'}
                />
              </Box>
                  
            
            </TabPanel>

            <TabPanel value="USD">

              <Hidden  smUp={verAgregar} >
                <Box sx={{ pt: 3 }}>
                  <AltaCuota
                        OCId={OCId}
                        idSociety={idSociety}
                        loggedUser={loggedUser}
                        dataContrato={dataContrato}
                        isLoading={isLoading}
                        error={error}
                        refetch={refetch}
                        moneda={'USD'}
                        conceptosCuota={conceptosCuota}
                  />
                </Box>
              </Hidden>
              <Box sx={{ pt: 3 }}>                    
                <GrillaCuota
                      OCId={OCId}
                      idSociety={idSociety}
                      loggedUser={loggedUser}
                      dataContrato={dataContrato}
                      isLoading={isLoading}
                      error={error}
                      refetch={refetch}
                      conceptosCuota={conceptosCuota}
                      moneda={'USD'}
                />
              </Box>
            
            
            </TabPanel>
            <TabPanel value="PRD">
              <GrillaItems                    
                  items={dataContrato?.item}
              />
            </TabPanel>

          </TabContext>                  
    </>   
  );
}
