import * as React from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab} from '@mui/material';
import { PageLiquidacion } from 'src/components/liquidacion/PageLiquidacion';
import { GenLiquidaciones } from 'src/components/liquidacion/GenLiquidaciones';

export function TabLiquidacion({idSociety, loggedUser, isLoading, error, fideActivo, fideicomisos, periodos, refetch}) {


  const [value, setActTab] = React.useState('0');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActTab(newValue);
  };


  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    return (
          
    <>

          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
             
                <Tab label="Consultar Liquidaciones" value="0" />
                <Tab label="Generar Liquidaciones" disabled={(loggedUser?.['rol.contrato'] ==='vista')}  value="1" />
             
             
              </TabList>
            </Box>
            <TabPanel value="0">
              
                <PageLiquidacion 
                       
                    fideActivo={fideActivo}
                    fideicomisos={fideicomisos}
                    periodos={periodos}
                    modo={'liqui'}
                    idSociety={idSociety}
                    loggedUser={loggedUser}
                        
                />
                   
            </TabPanel>

            <TabPanel value="1">
              <Box sx={{ pt: 3 }}>
          
                    <GenLiquidaciones 
          
                        loggedUser={loggedUser}
                        fideicomisos={fideicomisos?.filter((itemA)=> {return fideActivo?.find((itemB)=> {return itemA?.id === itemB?.fideicomisoId;})})}
                        periodos={periodos}
                            
                    />
              
              </Box>           
            </TabPanel>          

          </TabContext>                  
    </>   
  );
}
