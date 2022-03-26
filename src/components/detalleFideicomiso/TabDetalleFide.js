import * as React from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab} from '@mui/material';
//import { PrincipalDetalleFide } from 'src/components/detalleFideicomiso/PrincipalDetalleFide';
import { FiltroDetalleFide } from 'src/components/detalleFideicomiso/FiltroDetalleFide';
import { FormDetalleFide } from 'src/components/detalleFideicomiso/FormDetalleFide';
import { GrillaDetalleFide } from 'src/components/detalleFideicomiso/GrillaDetalleFide';


export function TabDetalleFide({ fideicomisoId,  loggedUser, dataFide, isLoading, error, refetch}) {

  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
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
                <Tab label="Productos" value="1" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Box sx={{ pt: 3 }}>
                <FormDetalleFide
                  fideicomisoId={fideicomisoId}
                  loggedUser={loggedUser}
                  dataFide={dataFide}
                  isLoading={isLoading}
                  error={error}
                  refetch={refetch}
                />
              </Box>           
            </TabPanel>
           

          </TabContext>                  
    </>   
  );
}
