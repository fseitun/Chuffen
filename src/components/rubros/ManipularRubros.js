import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import { getMethod, postMethod } from 'src/utils/api';

export function ManipularRubros({ idSociety }) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(newData => postMethod(`rubro/agregar/${idSociety.id}`, newData), {
    onSuccess: () => queryClient.refetchQueries(['rubros', idSociety.id]),
  });

  return (
    <Formik
      initialValues={{
        rubro: '',
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        !(await checkRubro(idSociety.id, values.Rubro)) ? mutate(values) : void 0; //cambiar por un pop up
        resetForm();
        setSubmitting(false);
      }}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Field as={TextField} label='Rubro' type='string' maxLength={100} name='rubro' />
          <Button type='submit' disabled={isSubmitting}>
            Agregar
          </Button>
        </Form>
      )}
    </Formik>
  );
}

async function checkRubro(idSociety, rubro) {
  let url = `rubro/mostrar/${idSociety}/${rubro}`;
  return Boolean(await getMethod(url));
}

ManipularRubros.propTypes = {
  idSociety: PropTypes.object,
};
