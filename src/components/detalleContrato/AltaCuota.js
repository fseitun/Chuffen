import { TextField, Button } from '@mui/material';
import {useState, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';

import { Autocomplete } from '@mui/material';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { SocietyContext } from 'src/App';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';

export function AltaCuota({ dataContrato, conceptosCuota, loggedUser, moneda, refetch  }) {
  
  const idSociety = useContext(SocietyContext);
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const [concepto, setConcepto] = useState(null);
 

  const { mutate: addCuota } = useMutation(
    Cuota => postMethod(`cuota/agregar/${idSociety.id}`, Cuota),
    {
      onMutate: async Cuota => {
        Cuota.creador = parseInt(loggedUser.id);

        await queryClient.invalidateQueries(['cuota', idSociety]);
        const prevData = await queryClient.getQueryData(['cuota', idSociety]);
        // const newData = [...prevData, { ...Cuota, id: new Date().getTime() }];
        // queryClient.setQueryData(['cuota', idSociety], newData);
        return prevData;

      },
      onError: (err, id, context) => queryClient.setQueryData(['cuota', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['cuota', idSociety])
        }
        refetch()        
      }
    }
  );


  return (
    
     <>
     <Formik
        initialValues={{
          concepto: '',
          cuota: '',
          monto: '',
          fecha: null,
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          
          addCuota({         
            fecha: values?.fecha, 
            cuota: values?.cuota,              
            concepto: concepto.id,
            monto: values?.monto,

            contratoId: dataContrato?.cont?.id,
            moneda: moneda,
            creador: loggedUser.id
          });
          resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>

            <Field component={Picker} label="Fecha" type="date" name="fecha" />

            <Field 
              as={TextField} 
              required 
              size="small" 
              label='Cuota número' 
              type='number' 
              name='cuota' 
            />    

            <Field
                as={Autocomplete}
                size={'small'}
                label='Concepto'
                title="Concepto"
                disablePortal
                required
                style={{ width: '160px', display: 'inline-flex' }}
                onChange={(event, newValue) => {
                  setConcepto(newValue);
                  setFieldValue('concepto', newValue);
                }}
                value={concepto}
                getOptionLabel={option => option.descripcion}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={(conceptosCuota? conceptosCuota:[])}
                renderInput={params => <TextField {...params} label='Concepto' />}
              />    
            
 

            <Field
              as={TextField}
              required
              label="Monto"
              size="small"
              type="float"
              name="monto"
              onChange={event => onlyNumbers(event, setFieldValue, 'monto')}
            />        
     

            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>
          </Form>
        )}
      </Formik>
      <Prompt
        message="Descripción, fecha y monto no puede estar en blanco"
        ok
      />
     </> 
  );
}


function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,11}$/;
  if (regex.test(value.toString())) {
    setFieldValue(typeOfData, value.toString());
  }
}

function Picker({ field, form }) {
  const { name, value } = field;
  const { setFieldValue } = form;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label="Fecha"
        inputFormat="dd/MM/yyyy"
        value={value}
        onChange={value => setFieldValue(name, value)}
        renderInput={params => <TextField required size="small" {...params} />}
      />
    </LocalizationProvider>
  );
}

