import * as React from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab} from '@mui/material';
// import { PrincipalDetalleFide } from 'src/components/detalleFideicomiso/PrincipalDetalleFide';
// import { FiltroDetalleFide } from 'src/components/detalleFideicomiso/FiltroDetalleFide';
// import { FormDetalleFide } from 'src/components/detalleFideicomiso/FormDetalleFide';

import { StepperContrato } from 'src/components/contrato/StepperContrato';
import { GrillaContrato } from 'src/components/contrato/GrillaContrato';


export function TabContrato({idSociety, fideicomisoId,  loggedUser, dataFide, isLoading, error, refetch}) {

  const [value, setActTab] = React.useState('1');

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
                <Tab label="Nuevo contrato" value="0" />
                <Tab label="Contratos" value="1" />
                <Tab label="Liquidaciones" value="2" />
              </TabList>
            </Box>
            <TabPanel value="0">
              <Box sx={{ pt: 3 }}>
              <StepperContrato
                  setActTab={setActTab}
                  idSociety={idSociety}
                  fideicomisoId={fideicomisoId}
                  loggedUser={loggedUser}
                  dataFide={dataFide}
                  isLoading={isLoading}
                  error={error}
                  refetch={refetch}
                />
              
              </Box>           
            </TabPanel>

            <TabPanel value="1">
              <Box sx={{ pt: 3 }}>
                <GrillaContrato
                  idSociety={idSociety}
                  fideicomisoId={fideicomisoId}
                  loggedUser={loggedUser}
                  dataFide={dataFide}
                  isLoading={isLoading}
                  error={error}
                  refetch={refetch}
                />
              
              </Box>           
            </TabPanel>
     
            <TabPanel value="2">
              <Box sx={{ pt: 3 }}>
          bbbb
              
              </Box>           
            </TabPanel>
           

          </TabContext>                  
    </>   
  );
}