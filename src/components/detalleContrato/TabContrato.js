import * as React from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, Hidden} from '@mui/material';
import { AltaCuota } from 'src/components/detalleContrato/AltaCuota';
import { PageLiquidacion } from 'src/components/liquidacion/PageLiquidacion';
import { GrillaCuota } from 'src/components/detalleContrato/GrillaCuota';
import { FormCesion } from 'src/components/detalleContrato/FormCesion';
import { GrillaItem } from 'src/components/detalleContrato/GrillaItem';
import { RepeaterCesion } from 'src/components/detalleContrato/RepeaterCesion';
import { PageCobro } from 'src/components/cobro/PageCobro';

export function TabContrato({ contratoId,  idSociety, loggedUser, conceptosCuota, dataContrato, isLoading, error, refetch, moneda, setMoneda, personas, empresas, CACs}) {



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
                <Tab label="Liquidaciones" value="LIQ" />
                <Tab label="Compromisos en Pesos" value="ARS" />
                <Tab label="Compromisos en Dolares" value="USD" />
                <Tab label="Cesiones" value="CES" />
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

              <Box sx={{ pt: 3 }}>
                
                <PageLiquidacion 
                    contratoId={contratoId}
                    idSociety={idSociety}
                    loggedUser={loggedUser}
                    contrato={dataContrato?.cont}
                    cesion={dataContrato?.cesiones[0]}
                />
              
              </Box>

         

            </TabPanel>
            <TabPanel value="ARS">

              <Hidden  smUp={verAgregar} >
                <Box sx={{ pt: 3 }}>
                  <AltaCuota
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
            <TabPanel value="CES">

                <FormCesion
                      // OCId={OCId}
                      contratoId={contratoId} 
                      idSociety={idSociety}
                      loggedUser={loggedUser}
                      personas={personas}
                      empresas={empresas}
                      // dataContrato={dataContrato}
                      isLoading={isLoading}
                      error={error}
                      refetch={refetch}
                   
                />

              {dataContrato?.cesiones?.map((item,index)=>{
                  return <RepeaterCesion     
                            key={'rep_'+ index}             
                            idSociety={idSociety}
                            fila={dataContrato?.cesiones?.length - index}
                            fideicomisoId={dataContrato?.cont?.fideicomisoId}
                            cesion={item}
                            isLoading={isLoading}
                            error={error}
                            personas={personas}
                            empresas={empresas}
                            loggedUser={loggedUser}
                            refetch={refetch}
                          />
              })}
              
              
              
            </TabPanel>
            <TabPanel value="PRD">
              <GrillaItem               
                  items={dataContrato?.item}
              />
            </TabPanel>

          </TabContext>                  
    </>   
  );
}
