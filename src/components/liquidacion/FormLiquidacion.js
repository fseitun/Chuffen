import { TextField, Button } from '@mui/material';
import {useState, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { SocietyContext } from 'src/App';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import { date_to_YYYYMMDD } from 'src/utils/utils';


export function FormLiquidacion({ contrato, loggedUser, refetch  }) {
  
  const idSociety = useContext(SocietyContext);
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const [concepto, setConcepto] = useState(null);
 

  const { mutate: addLiquidacion } = useMutation(
    Liquidacion => postMethod(`liquidacion/agregar/${idSociety.id}`, Liquidacion),
    {
      onMutate: async Liquidacion => {
        Liquidacion.creador = parseInt(loggedUser.id);

        await queryClient.invalidateQueries(['liquidacion', idSociety]);
        const prevData = await queryClient.getQueryData(['liquidacion', idSociety]);
        // const newData = [...prevData, { ...Liquidacion, id: new Date().getTime() }];
        // queryClient.setQueryData(['Liquidacion', idSociety], newData);
        return prevData;

      },
      onError: (err, id, context) => queryClient.setQueryData(['liquidacion', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['liquidacion', idSociety])
        }
        refetch()        
      }
    }
  );

  console.log(contrato);

  return (
    
     <>
     <Formik
        initialValues={{
          // concepto: '',
          // monto: '',
          fecha: null,
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          
          addLiquidacion({         
            fechaLiquidacion: date_to_YYYYMMDD(values?.fecha), 
            contrato: contrato,
            // concepto: concepto.id,
            // monto: values?.monto,

            contratoId: contrato?.cont?.id,
            // moneda: moneda,
            creador: loggedUser.id
          });
          resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>

            <Field component={Picker} label="Fecha" type="date" name="fecha" />

            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>
          </Form>
        )}
      </Formik>
      <Prompt
        message="Descripción, fecha no puede estar en blanco"
        ok
      />
     </> 
  );
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

