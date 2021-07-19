import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik'; //traer yup para validar
import { TextField, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import { cargarDolar } from 'src/components/API';
import { eliminarDolar } from 'src/components/API';

export function ManipularDolar({ idSociedad, selectedRows }) {
  const queryClient = useQueryClient();

  const { mutate: mutateCargar } = useMutation(
    (nuevoDolar) => cargarDolar(idSociedad, nuevoDolar),
    {
      onSuccess: () => {
        queryClient.refetchQueries(['dolar', idSociedad]);
        // queryClient.invalidateQueries();
      }
      //hay dos formas más eficientes: 1) con queryCache.setQueryData ya que no vuelve al api y 2) con onMutate queryCache.setQueryData pq ni siquiere espera a mandar al api
    }
  );

  const { mutate: mutateEliminar } = useMutation(
    async () => {
      await eliminarDolar(idSociedad, selectedRows);
    },
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['dolar', idSociedad])
      //hay dos formas más eficientes: 1) con queryCache.setQueryData ya que no vuelve al api y 2) con onMutate queryCache.setQueryData pq ni siquiere espera a mandar al api
    }
  );

  return (
    <>
      <Formik
        initialValues={{
          fecha: '2000-01-01',
          mep: 99,
          // blue: 99,
          BCRA: 99
        }}
        onSubmit={(values, { setSubmitting }) => {
          mutateCargar(values);
          setSubmitting(false); //todo: ver de mandarlo a onSuccess
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field as={TextField} type="date" name="fecha" />
            <ErrorMessage name="fecha" component="div" />
            <Field as={TextField} type="float" name="mep" />
            <ErrorMessage name="mep" component="div" />
            {/* <Field as={TextField} type="float" name="blue" />
            <ErrorMessage name="blue" component="div" /> */}
            <Field as={TextField} type="float" name="BCRA" />
            <ErrorMessage name="BCRA" component="div" />
            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>
          </Form>
        )}
      </Formik>
      <Button
        onClick={() => {
          mutateEliminar(selectedRows);
        }}
      >
        Eliminar
      </Button>
    </>
  );
}
ManipularDolar.propTypes = {
  idSociedad: PropTypes.number.isRequired,
  selectedRows: PropTypes.array.isRequired
};
