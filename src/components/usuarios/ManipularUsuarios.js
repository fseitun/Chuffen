import { TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';

import { getMethod, postMethod } from 'src/utils/api';

export function ManipularUsuarios({ idSociety }) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    newData => postMethod(`usuario/agregar/${idSociety.id}`, newData),
    {
      onSuccess: () => queryClient.refetchQueries(['usuarios', idSociety.id]),
    }
  );

  return (
    <Formik
      initialValues={{
        Usuario: '',
        Mail: '',
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        !(await checkMail(idSociety.id, values.mail)) ? mutate(values) : void 0; //cambiar por un pop up

        // resetForm();
        setSubmitting(false);
      }}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Field as={TextField} label='Usuario' type='string' maxLength={30} name='user' />
          <Field as={TextField} label='Mail' type='mail' name='mail' />
          <Button type='submit' disabled={isSubmitting}>
            Agregar
          </Button>
        </Form>
      )}
    </Formik>
  );
}

async function checkMail(idSociety, mail) {
  let url = `usuario/mostrar/${idSociety}/${mail}`;
  return Boolean(await getMethod(url));
}
