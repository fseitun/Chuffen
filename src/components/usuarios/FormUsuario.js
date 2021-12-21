import { TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

export function FormUsuario({ idSociety, loggedUser}) {
  //const { setIsPromptOpen, Prompt } = usePrompt();
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const { mutate: addUsuario } = useMutation(
    newUsuario => postMethod(`usuario/agregar/${idSociety.id}`, newUsuario),
    {
      onMutate: async newUsuario => {
        newUsuario.creador = loggedUser.id;
        await queryClient.invalidateQueries(['usuario', idSociety]);
        const prevData = await queryClient.getQueryData(['usuario', idSociety]);
        const newData = [...prevData, { ...newUsuario, id: new Date().getTime() }];
        queryClient.setQueryData(['usuario', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['usuario', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['usuario', idSociety]),
    }
  );

  return (
    <>
      <Formik
        initialValues={{
          user: '',
          mail: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          // checkear mail duplicado !!
          //if (values.mail.trim() ==='') {
          //  setIsPromptOpen(true);
          //} else addUsuario(values);
          addUsuario(values);
          resetForm();
          setSubmitting(false);
        }}
      >
        
        {({ isSubmitting }) => (
          <Form>
                 <Field as={TextField} label='Usuario' type='string' maxLength={30} name='user' />
          <Field as={TextField} label='Mail' type='mail' name='mail' />  
            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>
          </Form>
        )}
      </Formik>
      <Prompt
        message="Ya existe un tipo de cambio en esa fecha, por favor editar u eliminar el registro"
        ok
      />
    </>
  );
}