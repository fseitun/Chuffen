import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import { getMethod, postMethod } from 'src/utils/api';

export function ManipularUsuarios({ idSociedad }) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(newData => postMethod(`usuario/agregar/${idSociedad}`, newData), {
    onSuccess: () => queryClient.refetchQueries(['usuarios', idSociedad]),
  });

  return (
    <Formik
      initialValues={{
        Usuario: '',
        Mail: '',
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        !(await checkMail(idSociedad, values.mail)) ? mutate(values) : console.log('ya lo tenés'); //cambiar por un pop up

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

async function checkMail(idSociedad, mail) {
  let url = `usuario/mostrar/${idSociedad}/${mail}`;
  return Boolean(await getMethod(url));
}

ManipularUsuarios.propTypes = {
  idSociedad: PropTypes.number.isRequired,
};
