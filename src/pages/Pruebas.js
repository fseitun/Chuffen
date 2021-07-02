import React from 'react';
import { useMutation } from 'react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik'; //traer yup para validar
import axios from 'axios';
import { TextField, Button } from '@material-ui/core';

export function Formulario() {
  const { mutate } = useMutation((nuevoDolar) =>
    axios.post('http://localhost:3000/dolar/agregar/1', nuevoDolar)
  );

  return (
    <>
      <Formik
        initialValues={{
          fecha: '2000-01-01',
          mep: 99,
          blue: 99,
          BCRA: 99
        }}
        onSubmit={(values, { setSubmitting }) => {
          mutate(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field as={TextField} type="date" name="fecha" />
            <ErrorMessage name="fecha" component="div" />
            <Field as={TextField} type="float" name="mep" />
            <ErrorMessage name="mep" component="div" />
            <Field as={TextField} type="float" name="blue" />
            <ErrorMessage name="blue" component="div" />
            <Field as={TextField} type="float" name="BCRA" />
            <ErrorMessage name="BCRA" component="div" />
            <Button type="submit" disabled={isSubmitting}>
              Enviar
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}
