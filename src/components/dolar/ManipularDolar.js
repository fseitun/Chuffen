import { TextField, Button } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';

import { getMethod, postMethod } from 'src/utils/api';
import { mostrarFecha, yearMonthDayString, yearMonthOneString } from 'src/utils/utils';

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

export function ManipularDolar({ idSociety }) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(newData => postMethod(`dolar/agregar/${idSociety.id}`, newData), {
    onSuccess: () => {
      queryClient.refetchQueries(['dolar', idSociety.id]);
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
        let bool = await checkDate(idSociety.id, values.fecha);
        !bool && mutate(values); //cambiar por un pop up

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

async function checkDate(idSociety, date) {
  let url = `dolar/mostrar/${idSociety}/${yearMonthDayString(date)}`;
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
