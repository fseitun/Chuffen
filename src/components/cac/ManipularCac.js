import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@material-ui/core';
import { LocalizationProvider, DesktopDatePicker } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import PropTypes from 'prop-types';

import { getMethod, postMethod } from 'src/utils/api';
import { yearMonthOneString } from 'src/utils/dateToString';

function Picker({ field, form }) {
  const { name, value } = field;
  const { setFieldValue } = form;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label='Fecha'
        inputFormat='dd/MM/yyyy'
        value={value}
        onChange={value => setFieldValue(name, value)}
        renderInput={params => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

export function ManipularCac({ idSociety }) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(newData => postMethod(`cac/agregar/${idSociety}`, newData), {
    onSuccess: () => queryClient.refetchQueries(['cac', idSociety]),
  });

  return (
    <Formik
      initialValues={{
        fecha: new Date(),
        estimado: '',
        definitivo: '',
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        values.fecha = yearMonthOneString(values.fecha);
        !(await checkDate(idSociety, values.fecha)) ? mutate(values) : void(0); //cambiar por un pop up

        resetForm();
        setSubmitting(false);
      }}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Field component={Picker} label='Fecha' type='date' name='fecha' />
          <Field
            as={TextField}
            label='Estimado'
            type='float'
            maxLength={4}
            name='estimado'
            onChange={event => onlyNumbers(event, setFieldValue, 'estimado')}
          />
          <Field
            as={TextField}
            label='Definitivo'
            type='float'
            name='definitivo'
            onChange={event => onlyNumbers(event, setFieldValue, 'definitivo')}
          />
          <Button type='submit' disabled={isSubmitting}>
            Agregar
          </Button>
        </Form>
      )}
    </Formik>
  );
}

async function checkDate(idSociety, date) {
  let url = `cac/mostrar/${idSociety}/${date}`;
  return Boolean(await getMethod(url));
}

function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,4}(\.\d{0,2})?$/;
  if (regex.test(value.toString())) {
    setFieldValue(typeOfData, value.toString());
  }
}

Picker.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

ManipularCac.propTypes = {
  idSociety: PropTypes.object,
};
