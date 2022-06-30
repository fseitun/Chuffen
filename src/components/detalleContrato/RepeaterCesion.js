import React from 'react';
import { useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import esLocale from 'date-fns/locale/es';
import { Formik, Form } from 'formik';
import { Typography, Grid, TextField, Box, Button } from '@mui/material';
import { usePrompt } from 'src/utils/usePrompt';
import { postMethod, deleteMethod} from 'src/utils/api';
import { date_to_YYYYMMDD, DB_to_date } from 'src/utils/utils'; 
import { Delete as DeleteIcon } from '@mui/icons-material';
import { FormCesionItem } from 'src/components/detalleContrato/FormCesionItem';
import { GrillaCesionItem } from 'src/components/detalleContrato/GrillaCesionItem';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

export function RepeaterCesion({idSociety, loggedUser, cesion, fila, personas, empresas, isLoading, error, refetch}) {

  var acceso = true;
  if(loggedUser?.['rol.contrato'] ==='vista'){acceso =false}
  const [field, setField] = useState("");

  
  const { Prompt, setIsPromptOpen } = usePrompt(() => {});
  const [rowIdToDelete, setRowIdToDelete] = useState();
  
  const queryClient = useQueryClient();


  const locale = 'es';
  const localeMap = {es: esLocale};  
  const maskMap = {es: '__/__/____'};
  function save(event, field, id, isNumber, isDate) {
    
    if(isNumber){ // si es un campo de tipo numero
      // onlyNumbers(event, field, id); sin campos numericos
    }else{
      if(isDate){ // si es un picker de fecha
        const value = date_to_YYYYMMDD(event) + " 03:00"; 
        modifyData({ field, id, value });
      }else{  
        const { value } = event.target;
        modifyData({ field, id, value });
      }
    }
  }

  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) => await postMethod(`cesion/modificar/${idSociety.id}`, {id,[field]: value,}),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['cesion', idSociety]);
        const prevData = await queryClient.getQueryData(['cesion', idSociety]);
        if(prevData){
          
          const newData = [
            ...prevData.filter(_cesion => _cesion.id !== id),
            { ...prevData.find(_cesion => _cesion.id === id), [field]: value },
          ];
          queryClient.setQueryData(['cesion', idSociety], newData);
          
          return prevData;
        }
      },
      onError: (err, id, context) => queryClient.setQueryData(['cesion', idSociety], context),
      onSettled: () => {if(idSociety.id > 0) {
                        queryClient.invalidateQueries(['cesion', idSociety])
                      }
                      refetch()} 
    }
  );


  const { mutate: eliminate } = useMutation(
    async idItem => await deleteMethod(`cesion/eliminar/${idSociety.id}`, { id: idItem }),
    {
      onMutate: async idItem => {
        await queryClient.cancelQueries(['item', idSociety]);
        const prevData = queryClient.getQueryData(['item', idSociety]);
        //const newData = prevData.filter(item => item.id !== idItem);
        //queryClient.setQueryData(['cuota', idSociety], newData);
        return prevData;
      },
      onError: (err, idItem, context) => queryClient.setQueryData(['item', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['item', idSociety])
        }
        refetch()}
    }
  );


  const [verFidu, setVerFidu] = React.useState(false);

  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else

  return (
    <>
      <Formik >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <Prompt message="¿Eliminar fila?" action={() => eliminate(rowIdToDelete)} />
            <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} > 
              
              <Grid item md={1}> 
                    <Typography align="left" color="textPrimary" variant="h5">
                      Cesión {fila}:
                    </Typography>
              </Grid>               
              
              <Grid item md={3}>

                    <TextField  
                      size={'small'} 
                      sx={{ width: '20ch' }} 
                      label="Nombre de La Cesión" 
                      disabled={!acceso}
                      style={{ width: '250px', display: 'inline-flex' }}
                      key={'cesion_' + cesion?.id} 
                      defaultValue={cesion?.nombre}  
                      name="nombre" 
                      onChange={event => setField('nombre')}               
                      onBlur={event => save(event, field, cesion?.id, false, false)}  
            
                    /> 

              </Grid>   
              <Grid item md={1}> 
                    <Typography align="left" color="textPrimary" variant="h5">
                      Fecha:
                    </Typography>
              </Grid>               
              
              <Grid item md={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
                      <DatePicker
                        mask={maskMap[locale]}
                        value={DB_to_date(cesion?.fecha)}
                        disabled={!acceso}
                        // key={`fec_${cesion?.id}`} 
                        label='Fecha Adhesión'
                        onChange={(newValue) => save(newValue, 'fecha', cesion?.id, false, true)}
                        renderInput={(params) => <TextField required  key={`fecha_${cesion?.id}`}  size="small" {...params} />}
                      />
                    </LocalizationProvider>
                    &nbsp;&nbsp;
                    <DeleteIcon
                          onClick={()=> {
                            setRowIdToDelete(cesion?.id);
                            setIsPromptOpen(true);
                          }}
                        />
                    
              </Grid>   
              
              <Grid item md={12} >
                    &nbsp;
              </Grid>   
              
            </Grid>

          </Form>
        )}
      </Formik>

      <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} > 

        <Grid item md={1}>
          &nbsp;
        </Grid>        

        <Box component="span" width={'60%'} sx={{ p: 2, borderRadius: 2, border: 2, borderColor: 'primary.main' }}>      
            
            <Grid item md={11}>

                <Typography align="right" >
                  <Button align="center" size='small' onClick={() => {setVerFidu(!verFidu);}} >
                    {verFidu ? "Cerrar" : "Agregar Fiduciante"}
                  </Button>
                </Typography>
                  
                {verFidu ? 
                <FormCesionItem                    
                  idSociety={idSociety}
                  fideicomisoId={cesion?.fideicomisoId}
                  personas={personas}
                  empresas={empresas}
                  cesionId={cesion?.id}
                  loggedUser={loggedUser}
                  refetch={refetch}
                />:""}

                <GrillaCesionItem
                  loggedUser={loggedUser}
                  items={cesion?.cesionItems}
                  refetch={refetch}
                />
                
            </Grid>

        </Box> 

      </Grid>  

      <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} > 
        <Grid item md={1}>
          &nbsp;
        </Grid>        
      </Grid> 
      <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} > 
        <Grid item md={1}>
          &nbsp;
        </Grid>        
      </Grid> 

      <Grid item md={12} sx={{ p: 2, borderTop: 2, borderColor: 'primary.main' }} >                      
      </Grid>  

    </>
  );
}