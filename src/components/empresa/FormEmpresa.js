import { TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

                
export function FormEmpresa({ idSociety, loggedUser, tipo }) {
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const { mutate: addEmpresa } = useMutation(
    newEmpresa => postMethod(`empresa/agregar/${idSociety.id}`, newEmpresa),
    {
      onMutate: async newEmpresa => {
        if(tipo===1){
          newEmpresa.esFiduciante = 1;
        }else{
          newEmpresa.esProveedor = 1;
        }
        newEmpresa.creador = loggedUser.id;
        await queryClient.invalidateQueries(['empresa', idSociety]);
        const prevData = await queryClient.getQueryData(['empresa', idSociety]);
        const newData = [...prevData, { ...newEmpresa, id: new Date().getTime()}];
        queryClient.setQueryData(['empresa', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['empresa', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['empresa', idSociety]),
    }
  );

  return (
    <>
      <Formik
        initialValues={{
          razonSocial: '',
          CUIT: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          // check cuit
          addEmpresa(values);
          resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            
            <Field
            as={TextField}
            label='CUIT'
            type='string'
            required
            size="small"
            maxLength={11}
            name='CUIT'
            onChange={event => onlyNumbers(event, setFieldValue, 'CUIT')}
          />
          
          <Field as={TextField} required size="small" label='Razón Social' type='string' name='razonSocial' />

            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>
          </Form>
        )}
      </Formik>
      <Prompt
        message="El CUIT no puede estar en blanco"
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
