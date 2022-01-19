import { TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { useParams } from 'react-router-dom';

export function FormCuentaBanco({ idSociety, loggedUser }) {

  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();
  const { idBanco } = useParams();

  const { mutate: addCuentaBanco } = useMutation(
    newCuentaBanco => postMethod(`cuentabanco/agregar/${idSociety.id}/${idBanco}`, newCuentaBanco),
    {
      onMutate: async newCuentaBanco => {
        newCuentaBanco.creador = loggedUser.id;
        await queryClient.invalidateQueries(['cuentabanco', idSociety]);
        const prevData = await queryClient.getQueryData(['cuentabanco', idSociety]);
        const newData = [...prevData, { ...newCuentaBanco, id: new Date().getTime() }];
        queryClient.setQueryData(['cuentabanco', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['cuentabanco', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['cuentabanco', idSociety]),
    }
  );

  return (
    <>
      <Formik
        initialValues={{
          cuentaBanco: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
     
          addCuentaBanco(values);
          resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            
            <Field
              as={TextField}
              label="Cuenta"
              required
              size="small"
              type="float"              
              name="cuentaBanco"
            />
         
            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>
          </Form>
        )}
      </Formik>
      <Prompt
        message="El cuentabanco no puede estar en blanco"
        ok
      />
    </>
  );
}