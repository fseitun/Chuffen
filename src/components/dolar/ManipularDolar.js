import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button } from '@material-ui/core';
import { LocalizationProvider, DesktopDatePicker } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
// import * as Yup from 'yup';
import PropTypes from 'prop-types';

import { loadDollar } from 'src/components/API';

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

export function ManipularDolar({ idSociedad }) {
  const queryClient = useQueryClient();

  const { mutate: sendValues } = useMutation(
    (nuevoDolar) => loadDollar(idSociedad, nuevoDolar),
    {
      onSuccess: () => {
        queryClient.refetchQueries(['dolar', idSociedad]);
      }
    }
  );

  return (
    <Formik
      initialValues={{
        fecha: formatDate(new Date()),
        mep: '',
        BCRA: ''
      }}
      // validationSchema={Yup.object({
      //   BCRA: Yup.number()
      //     .positive()
      //     .lessThan(1000)
      //     //.test((number) => number.toFixed(2))
      //     .required('Required')
      // })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        sendValues(values);
        resetForm();
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Field component={Picker} label="Fecha" type="date" name="fecha" />
          <Field
            as={TextField}
            label="BCRA"
            type="float"
            maxLength={4}
            name="BCRA"
            onChange={(event) => onlyNumbers(event, setFieldValue, 'BCRA')}
          />
          <Field
            as={TextField}
            label="MEP"
            type="float"
            name="mep"
            onChange={(event) => onlyNumbers(event, setFieldValue, 'mep')}
          />
          <Button type="submit" disabled={isSubmitting}>
            Agregar
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

function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^[0-9.\b]+$/;
  if (regex.test(value.toString())) {
    setFieldValue(typeOfData, value.toString().slice(0, 6));
  }
}

Picker.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired
};

ManipularDolar.propTypes = {
  idSociedad: PropTypes.number.isRequired
};
