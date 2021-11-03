import { TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';

import { getMethod, postMethod } from 'src/utils/api';

export function FormUsuarios({ idSociety }) {
  const queryClient = useQueryClient();
  const { mutate: addUser } = useMutation(
    newUser => postMethod(`usuario/agregar/${idSociety.id}`, newUser),
    {
      onMutate: async newUser => {
        console.log(newUser);
        await queryClient.cancelQueries(['usuarios', idSociety]);
        const prevData = await queryClient.getQueryData(['usuarios', idSociety]);
        const newData = [...prevData, { ...newUser, id: new Date().getTime() }];
        queryClient.setQueryData(['usuarios', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['usuarios', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['usuarios', idSociety]),
    }
  );

  return (
    <Formik
      initialValues={{
        user: '',
        mail: '',
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        (await isMailUsed(idSociety.id, values.mail)) || addUser(values);
        resetForm();
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field as={TextField} label="Usuario" type="string" maxLength={30} name="user" />
          <Field as={TextField} label="Mail" type="mail" name="mail" />
          <Button type="submit" disabled={isSubmitting}>
            Agregar
          </Button>
        </Form>
      )}
    </Formik>
  );
}

async function isMailUsed(idSociety, mail) {
  let url = `usuario/mostrar/${idSociety}/${mail}`;
  return !!(await getMethod(url));
}
