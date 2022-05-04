import React from 'react';
import { useState } from 'react';
import { TextField, MenuItem, Grid, Hidden } from '@mui/material';
import esLocale from 'date-fns/locale/es';
import { useContext } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { SocietyContext } from 'src/App';
import { date_to_YYYYMMDD, DB_to_date } from 'src/utils/utils'; 
// (fecha)

export function FormDetalleOC({ OCId, formOC, loggedUser, refetch  }) {

  var acceso = true;
  if(loggedUser?.['rol.oc'] ==='vista'){acceso =false}

  const idSociety = useContext(SocietyContext);
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const [field, setField] = useState("");


  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) => await postMethod(`OC/modificar/${idSociety.id}`, {id,[field]: value,}),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['OC', idSociety]);
        const prevData = await queryClient.getQueryData(['OC', idSociety]);
        if(prevData){
          
          const newData = [
            ...prevData.filter(_OC => _OC.id !== id),
            { ...prevData.find(_OC => _OC.id === id), [field]: value },
          ];
          queryClient.setQueryData(['OC', idSociety], newData);
          
          return prevData;
        }
      },
      onError: (err, id, context) => queryClient.setQueryData(['OC', idSociety], context),
      onSettled: () => {if(idSociety.id > 0) {
                        queryClient.invalidateQueries(['OCdetalle', idSociety])
                      }
                      refetch()} 
    }
  );

  function save(event, field, id, isNumber, isDate) {
    
    if(isNumber){ // si es un campo de tipo numero
      onlyNumbers(event, field, id);
    }else{
      if(isDate){ // si es un picker de fecha
        setValuef(event);
        const value = date_to_YYYYMMDD(event) + " 03:00"; 
        modifyData({ field, id, value });
      }else{  
        const { value } = event.target;
        modifyData({ field, id, value });
      }
    }
}

  function onlyNumbers(event, field, id) {
   
    event.preventDefault();
    const { value } = event.target;   
  
    // const regex = /^\d{0,11}$/; // es numero sin decimales
    const regex = /^\d{0,5}(\.\d{0,2})?$/;// es numero
    var key = event.which || event.keyCode; // keyCode detection
    var ctrl = event.ctrlKey ? event.ctrlKey : ((key === 17) ? true : false); // ctrl detection
    if(event?.target?.name === field){ // Si el campo a grabar cambio
      if (regex.test(value.toString()) || ctrl ) {
        //let id = OCId;
        modifyData({ field, id, value });
      }      
    }
  }

  
  const CACtipos = [
    {
      value: 'Construción',
      label: 'Construción',
    },
    {
      value: 'Materiales',
      label: 'Materiales',
    },
    {
      value: 'Mano de Obra',
      label: 'Mano de Obra',
    },
  ];

  const locale = 'es';
  const localeMap = {es: esLocale};  
  const maskMap = {es: '__/__/____'};
  let d = DB_to_date(formOC?.oc?.fechaIni); 
  console.log(2222, d)
  const [valuef, setValuef] = React.useState(d);


  return (
    <>
      <Formik>

        {({ isSubmitting }) => (
          <Form>
            <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >                  

              <Grid item md={5}>   

                <TextField  
                  size={'small'} 
                  sx={{ width: '20ch' }} 
                  label="Tipo de CAC" 
                  style={{ width: '215px', display: 'inline-flex' }}
                  select
                  disabled={!acceso}
                  key={formOC?.oc?.CACtipo} 
                  defaultValue={formOC.oc?.CACtipo}  
                  name="CACtipo" 
                  onChange={event => save(event, 'CACtipo', OCId, false, false)}       
                >
                    {CACtipos.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
  
                <TextField  
                  size={'small'} 
                  sx={{ width: '20ch' }} 
                  label="CAC Base" 
                  type="number" 
                  disabled={!acceso}
                  style={{ width: '215px', display: 'inline-flex' }}
                  key={formOC?.oc?.CACbase} 
                  defaultValue={formOC.oc?.CACbase}  
                  name="CACbase" 
                  onChange={event => setField('CACbase')}               
                  onBlur={event => save(event, field, OCId, true, false)}  
        
                />        
              </Grid> 
              <Grid item md={2}> 
                <Hidden  smUp={true} >
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
                    
                        <DatePicker
                          mask={maskMap[locale]}
                          value={valuef}
                          disabled={!acceso}
                          label='Fecha'
                          onChange={(newValue) => save(newValue, 'fechaIni', OCId, false, true)}
                          renderInput={(params) => <TextField required size="small" {...params} />}
                        />
                    
                  </LocalizationProvider>
                </Hidden> 

              </Grid>

            </Grid>  
          </Form>
        )}
      </Formik>
      <Prompt
        message="Tarea y monto no puede estar en blanco"
        ok
      />
    </>
  );
}