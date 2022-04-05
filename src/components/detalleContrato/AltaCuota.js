import { TextField, Button } from '@mui/material';
import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { SocietyContext } from 'src/App';
                
export function AltaCuota({ contratoId, loggedUser, moneda, refetch  }) {
  
  const idSociety = useContext(SocietyContext);
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const { mutate: addCuota } = useMutation(
    Cuota => postMethod(`cuota/agregar/${idSociety.id}`, Cuota),
    {
      onMutate: async Cuota => {
        Cuota.creador = parseInt(loggedUser.id);
        //Cuota.OCId = parseInt(OCId);
        //Cuota.moneda = moneda;
        
  
        await queryClient.invalidateQueries(['cuota', idSociety]);
        const prevData = await queryClient.getQueryData(['cuota', idSociety]);
        const newData = [...prevData, { ...Cuota, id: new Date().getTime() }];
        queryClient.setQueryData(['cuota', idSociety], newData);
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
          descripcion: '',
          monto: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          
          addCuota(values);
          resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>

            <Field 
              as={TextField} 
              required 
              size="small" 
              label='Tarea' 
              type='string' 
              name='descripcion' 
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
        message="Tarea y monto no puede estar en blanco"
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
