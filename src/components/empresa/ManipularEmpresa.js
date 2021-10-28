import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@mui/material';

import { getMethod, postMethod } from 'src/utils/api';

export function ManipularEmpresa({ idSociety }) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(newData => postMethod(`empresa/agregar/${idSociety}`, newData), {
    onSuccess: () => queryClient.refetchQueries(['empresas', idSociety]),
  });

  return (
    <Formik
      initialValues={{
        razonSocial: '',
        mail: '',
        telefono: '',
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        !(await checkCuit(idSociety, values.CUIT))
          ? mutate(values) // console.log('ya lo tenés'); //cambiar por un pop up
          : resetForm();
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Field as={TextField} label="Razón Social" type="string" name="razonSocial" />
          <Field as={TextField} label="Email" type="string" name="mail" />

          <Field
            as={TextField}
            label="Teléfono"
            type="string"
            maxLength={11}
            name="telefono"
            onChange={event => onlyNumbers(event, setFieldValue, 'telefono')}
          />

          <Button type="submit" disabled={isSubmitting}>
            Agregar
          </Button>
        </Form>
      )}
    </Formik>
  );
}

async function checkCuit(idSociety, cuit) {
  let url = `empresa/mostrar/${idSociety}/${cuit}`;
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
