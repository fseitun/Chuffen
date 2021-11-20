import { TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

export function FormRubro({ idSociety }) {
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const { mutate: addRubro } = useMutation(
    newRubro => postMethod(`rubro/agregar/${idSociety.id}`, newRubro),
    {
      onMutate: async newRubro => {
        await queryClient.invalidateQueries(['rubro', idSociety]);
        const prevData = await queryClient.getQueryData(['rubro', idSociety]);
        const newData = [...prevData, { ...newRubro, id: new Date().getTime() }];
        queryClient.setQueryData(['rubro', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['rubro', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['rubro', idSociety]),
    }
  );

  return (
    <>
      <Formik
        initialValues={{
          rubro: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
     
          addRubro(values);
          resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            
            <Field
              as={TextField}
              label="Rubro"
              type="float"              
              name="rubro"
            />
         
            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>
          </Form>
        )}
      </Formik>
      <Prompt
        message="El rubro no puede estar en blanco"
        ok
      />
    </>
  );
}