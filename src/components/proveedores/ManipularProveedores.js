import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import { getMethod, postMethod } from 'src/utils/api';

export function ManipularProveedores({ idSociety }) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    newData => postMethod(`proveedor/agregar/${idSociety.id}`, newData),
    {
      onSuccess: () => queryClient.refetchQueries(['empresas', idSociety.id]),
    }
  );

  return (
    <Formik
      initialValues={{
        CUIT: '',
        razonSocial: '',
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        !(await checkCuit(idSociety.id, values.CUIT)) ? mutate(values) : void 0; //cambiar por un pop up

        resetForm();
        setSubmitting(false);
      }}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Field
            as={TextField}
            label='CUIT'
            type='string'
            maxLength={11}
            name='CUIT'
            onChange={event => onlyNumbers(event, setFieldValue, 'CUIT')}
          />
          <Field as={TextField} label='Razón Social' type='string' name='razonSocial' />
          <Button type='submit' disabled={isSubmitting}>
            Agregar
          </Button>
        </Form>
      )}
    </Formik>
  );
}

async function checkCuit(idSociety, cuit) {
  let url = `proveedor/mostrar/${idSociety}/${cuit}`;
  return Boolean(await getMethod(url));
}

function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,11}$/;
  if (regex.test(value.toString())) {
    setFieldValue(typeOfData, value.toString());
  }
}

ManipularProveedores.propTypes = {
  idSociety: PropTypes.object,
};
