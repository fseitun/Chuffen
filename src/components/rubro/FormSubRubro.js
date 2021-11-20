import { TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

export function FormSubRubro({ idSociety, idRubro }) {
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const { mutate: addSubRubro } = useMutation(
    newSubRubro => postMethod(`subrubro/agregar/${idSociety.id}/${idRubro}`, newSubRubro),
    {
      onMutate: async newSubRubro => {
        await queryClient.invalidateQueries(['subrubro', idSociety]);
        const prevData = await queryClient.getQueryData(['subrubro', idSociety]);
        const newData = [...prevData, { ...newSubRubro, id: new Date().getTime() }];
        queryClient.setQueryData(['subrubro', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['subrubro', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['subrubro', idSociety]),
    }
  );

  return (
    <>
      <Formik
        initialValues={{
          subRubro: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
     
          addSubRubro(values);
          resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            
            <Field
              as={TextField}
              label="SubRubro"
              type="float"              
              name="subRubro"
            />
         
            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>
          </Form>
        )}
      </Formik>
      <Prompt
        message="El subrubro no puede estar en blanco"
        ok
      />
    </>
  );
}