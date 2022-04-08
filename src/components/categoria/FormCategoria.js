import { TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
// import { Hidden } from '@material-ui/core';

export function FormCategoria({ idSociety, loggedUser }) {
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const { mutate: addCategoria } = useMutation(
    newCategoria => postMethod(`categoria/agregar/${idSociety.id}`, newCategoria),
    {
      onMutate: async newCategoria => {
        newCategoria.creador = loggedUser.id;
        await queryClient.invalidateQueries(['categoria', idSociety]);
        const prevData = await queryClient.getQueryData(['categoria', idSociety]);
        const newData = [...prevData, { ...newCategoria, id: new Date().getTime()}];
        queryClient.setQueryData(['categoria', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['categoria', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['categoria', idSociety]),
    }
  );

  return (
     <>
      <Formik
        initialValues={{
          codigo: '',
          concepto: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
     
          addCategoria(values);
          resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
         <Form>
            
         <Field
           as={TextField}
           label="Código"
           required
           size="small"
           type="number"              
           name="codigo"
         />

          <Field
           as={TextField}
           label="Concepto"
           required
           size="small"
           // type="float"              
           name="concepto"
         />

         <Button type="submit" disabled={isSubmitting}>
           Agregar
         </Button>
       </Form>
     )}
   </Formik>
   <Prompt
     message="El Código no puede estar en blanco"
     ok
   />
 </>
);
}