import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@material-ui/core';
import { LocalizationProvider, DesktopDatePicker } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import PropTypes from 'prop-types';

import { getMethod, postMethod } from 'src/utils/api';
// import { yearMonthDayString } from 'src/utils/dateToString';

function Picker({ field, form }) {
  const { name, value } = field;
  const { setFieldValue } = form;
  let labelF = 'Finalización'
  if(name == 'fechaInicio'){labelF = 'Fecha de inicio'}
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label= {labelF}
        inputFormat='dd/MM/yyyy'
        value={value}
        onChange={value => setFieldValue(name, value)}
        renderInput={params => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

export function ManipularDetalleFideicomiso({ idSociedad },{ idFideicomiso }) {
  
  const queryClient = useQueryClient();

  const { mutate } = useMutation(newData => postMethod(`producto/agregar/${idSociedad}/${idFideicomiso}`, newData), {
    
    onSuccess: () => {      
      queryClient.refetchQueries(['producto', idSociedad, idFideicomiso]);
    },
  });

  return (
    <Formik
      initialValues={{
        nombre: '',
        fechaInicio: null,
        fechaFin: null,
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        let bool = await checkName(idSociedad, idFideicomiso, values.nombre);
        !bool ? mutate(values) : console.log('ya lo tenés'); //cambiar por un pop up

        resetForm();
        setSubmitting(false);
      }}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Field
            as={TextField}
            label='Código'
            type='string'
            maxLength={40}
            name='codigo'
          />

          <Field
            as={TextField}
            label='Tipo'
            type='integer'
            maxLength={100}
            name='tipo'
          />     

          <Field
            as={TextField}
            label='Descripcion'
            type='string'
            maxLength={100}
            name='descripcion'
          />

          <Button type='submit' disabled={isSubmitting}>
            Agregar
          </Button>
        </Form>
      )}
    </Formik>
  );
}

async function checkName(idSociedad, idFideicomiso, nombre) {
  let n = new String(nombre); 
  // controla blanco y espacios
  if(n.trim() ==''){return true}
  // controla si ya existe el nombre
  let url = `producto/mostrar/${idSociedad}/${idFideicomiso}/${nombre}`;
  return Boolean(await getMethod(url));
}

Picker.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

ManipularDetalleFideicomiso.propTypes = {
  idSociedad: PropTypes.number.isRequired,
  idFideicomiso: PropTypes.number.isRequired,
};