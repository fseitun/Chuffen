import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@material-ui/core';
import { LocalizationProvider, DesktopDatePicker } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import PropTypes from 'prop-types';

import { getMethod, postMethod } from 'src/utils/api';
import { yearMonthDayString } from 'src/utils/dateToString';

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

export function ManipularDolar({ idSociedad }) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(newData => postMethod(`dolar/agregar/${idSociedad}`, newData), {
    onSuccess: () => {
      queryClient.refetchQueries(['dolar', idSociedad]);
    },
  });

  return (
    <Formik
      initialValues={{
        fecha: new Date(),
        mep: '',
        BCRA: '',
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        let bool = await checkDate(idSociedad, values.fecha);
        console.log(bool);
        // !(await checkDate(idSociedad, values.fecha))
        !bool ? mutate(values) : console.log('ya lo tenés'); //cambiar por un pop up

        resetForm();
        setSubmitting(false);
      }}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Field component={Picker} label='Fecha' type='date' name='fecha' />
          <Field
            as={TextField}
            label='BCRA'
            type='float'
            maxLength={4}
            name='BCRA'
            onChange={event => onlyNumbers(event, setFieldValue, 'BCRA')}
          />
          <Field
            as={TextField}
            label='MEP'
            type='float'
            name='mep'
            onChange={event => onlyNumbers(event, setFieldValue, 'mep')}
          />
          <Button type='submit' disabled={isSubmitting}>
            Agregar
          </Button>
        </Form>
      )}
    </Formik>
  );
}

async function checkDate(idSociedad, date) {
  let url = `dolar/mostrar/${idSociedad}/${yearMonthDayString(date)}`;
  console.log(url);
  return Boolean(await getMethod(url));
}

function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,3}(\.\d{0,2})?$/;
  if (regex.test(value.toString())) {
    setFieldValue(typeOfData, value.toString());
  }
}

Picker.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

ManipularDolar.propTypes = {
  idSociedad: PropTypes.number.isRequired,
};
