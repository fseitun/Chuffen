import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@mui/material';
import { LocalizationProvider, DesktopDatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
/// import FormControlLabel from '@mui/material/FormControlLabel';

import { getMethod, postMethod } from 'src/utils/api';
// import { yearMonthDayString } from 'src/utils/dateToString';

export function ManipularPersona({ idSociedad }) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(newData => postMethod(`persona/agregar/${idSociedad}`, newData), {
    onSuccess: () => {
      queryClient.refetchQueries(['persona', idSociedad]);
    },
  });

  return (
    <Formik
      initialValues={{
        nombre: '',
        mail: null,
        telefono: null,
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        let bool = await checkName(idSociedad, values.nombre);
        !bool ? mutate(values) : console.log('ya lo tenés'); //cambiar por un pop up

        resetForm();
        setSubmitting(false);
      }}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Field as={TextField} label='Nombre' type='string' maxLength={40} name='nombre' />
          <Field as={TextField} label='Email' type='string' maxLength={100} name='mail' />
          <Field as={TextField} label='Teléfono' type='string' maxLength={11} name='telefono' />

          <Button type='submit' disabled={isSubmitting}>
            Agregar
          </Button>
        </Form>
      )}
    </Formik>
  );
}

async function checkName(idSociedad, nombre) {
  let n = new String(nombre);
  // controla blanco y espacios
  if (n.trim() == '') {
    return true;
  }
  // controla si ya existe el nombre
  let url = `persona/mostrar/${idSociedad}/${nombre}`;
  return Boolean(await getMethod(url));
}
