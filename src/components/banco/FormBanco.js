import { TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

export function FormBanco({ idSociety, loggedUser }) {
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const { mutate: addBanco } = useMutation(
    newBanco => postMethod(`banco/agregar/${idSociety.id}`, newBanco),
    {
      onMutate: async newBanco => {
        newBanco.creador = loggedUser.id;
        await queryClient.invalidateQueries(['banco', idSociety]);
        const prevData = await queryClient.getQueryData(['banco', idSociety]);
        const newData = [...prevData, { ...newBanco, id: new Date().getTime()}];
        queryClient.setQueryData(['banco', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['banco', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['banco', idSociety]),
    }
  );

  return (
    <>
      <Formik
        initialValues={{
          banco: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
     
          addBanco(values);
          resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            
            <Field
              as={TextField}
              label="Banco"
              required
              size="small"
              type="float"              
              name="banco"
            />

            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>
            

          </Form>
        )}
      </Formik>
      <Prompt
        message="El Banco no puede estar en blanco"
        ok
      />
    </>
  );
}