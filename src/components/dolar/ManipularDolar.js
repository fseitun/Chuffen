import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik'; //traer yup para validar
import { TextField, Button } from '@material-ui/core';
import { LocalizationProvider, DesktopDatePicker } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import PropTypes from 'prop-types';

import { cargarDolar } from 'src/components/API';
import { eliminarDolar } from 'src/components/API';

function Picker({ field, form }) {
  const { name, value } = field;
  const { setFieldValue } = form;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label="Fecha"
        inputFormat="dd/MM/yyyy"
        value={value}
        onChange={(value) => setFieldValue(name, value)}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

export function ManipularDolar({ idSociedad, selectedRows }) {
  // console.log(`variable de date de useState: ${date}`);
  const queryClient = useQueryClient();

  const { mutate: mutateCargar } = useMutation(
    (nuevoDolar) => cargarDolar(idSociedad, nuevoDolar),
    {
      onSuccess: () => {
        queryClient.refetchQueries(['dolar', idSociedad]);
      }
    }
  );

  const { mutate: mutateEliminar } = useMutation(
    async () => {
      await eliminarDolar(idSociedad, selectedRows);
    },
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['dolar', idSociedad])
    }
  );

  return (
    <Formik
      initialValues={{
        fecha: formatDate(new Date()),
        mep: '',
        BCRA: ''
      }}
      onSubmit={(values, { setSubmitting }) => {
        console.log(
          `el values que manda formik a mutate: ${JSON.stringify(
            values,
            null,
            2
          )}`
        );
        mutateCargar(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field component={Picker} label="Fecha" type="date" name="fecha" />
          <ErrorMessage name="fecha" component="div" />
          <Field as={TextField} label="BCRA" type="float" name="BCRA" />
          <ErrorMessage name="BCRA" component="div" />
          <Field as={TextField} label="MEP" type="float" name="mep" />
          <ErrorMessage name="mep" component="div" />
          <Button type="submit" disabled={isSubmitting}>
            Agregar
          </Button>
          <Button
            onClick={() => {
              mutateEliminar(selectedRows);
            }}
          >
            Eliminar
          </Button>
        </Form>
      )}
    </Formik>
  );
}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

Picker.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired
};

ManipularDolar.propTypes = {
  idSociedad: PropTypes.number.isRequired,
  selectedRows: PropTypes.array.isRequired
};
