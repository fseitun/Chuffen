import { TextField, Button } from '@mui/material';
import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { SocietyContext } from 'src/App';
                
export function AltaDetalleOC({ OCId, loggedUser, moneda, refetch  }) {
  const idSociety = useContext(SocietyContext);
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const { mutate: addOCItem } = useMutation(
    OCItem => postMethod(`OCdetalle/agregar/${idSociety.id}`, OCItem),
    {
      onMutate: async OCItem => {
        OCItem.creador = parseInt(loggedUser.id);
        OCItem.OCId = parseInt(OCId);
        OCItem.moneda = moneda;
        
  
        await queryClient.invalidateQueries(['OCdetalle', idSociety]);
        const prevData = await queryClient.getQueryData(['OCdetalle', idSociety]);
        const newData = [...prevData, { ...OCItem, id: new Date().getTime() }];
        queryClient.setQueryData(['OCdetalle', idSociety], newData);
        return prevData;

      },
      onError: (err, id, context) => queryClient.setQueryData(['OCdetalle', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['OCdetalle', idSociety])
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
          
          addOCItem(values);
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
              style={{ width: '215px', display: 'inline-flex' }}
              label='Tarea' 
              type='string' 
              name='descripcion' 
            />
            
            <Field
              as={TextField}
              required
              label="Monto"
              style={{ width: '215px', display: 'inline-flex' }}
              size="small"
              type="float"
              name="monto"
              onChange={event => onlyNumbers(event, setFieldValue, 'monto')}
            />        
     
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
