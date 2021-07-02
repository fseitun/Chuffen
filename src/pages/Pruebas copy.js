import React from 'react';
import { useMutation } from 'react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
// import * as yup from 'yup';
import { TextField, Button } from '@material-ui/core';

let nuevoDolar = {};

function Formulario() {
  // const validationSchema = yup.object({
  //   email: yup
  //     .string('Enter your email')
  //     .email('Enter a valid email')
  //     .required('Email is required'),
  //   password: yup
  //     .string('Enter your password')
  //     .min(8, 'Password should be of minimum 8 characters length')
  //     .required('Password is required')
  // });

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
          nuevoDolar = values;
          setSubmitting(false);
        }}
        // validationSchema={validationSchema}
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
//////////////////////////////////////



function ApiLoco() {
  const mutation = useMutation((nuevoDolar) =>
    axios.post('http://localhost:3000/dolar/agregar/1', nuevoDolar)
  );

  return (
    <div>
      {mutation.isLoading ? (
        'Agregando...'
      ) : (
        <>
          {mutation.isError ? (
            <div>Hubo un error: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Tipo de Cambio agregado</div> : null}

          <button
            onClick={() => {
              mutation.mutate(nuevoDolar);
            }}
          >
            Agregar Tipo de Cambio
          </button>
        </>
      )}
    </div>
  );
}
//////////////////////////////////////

export function Prueba() {
  return (
    <>
      <Formulario />
      <ApiLoco />
    </>
  );
}
