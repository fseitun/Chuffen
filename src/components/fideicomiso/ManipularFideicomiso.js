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

export function ManipularFideicomiso({ idSociedad }) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(newData => postMethod(`fideicomiso/agregar/${idSociedad}`, newData), {
    
    onSuccess: () => {      
      queryClient.refetchQueries(['fideicomiso', idSociedad]);
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
        let bool = await checkName(idSociedad, values.nombre);
        !bool ? mutate(values) : console.log('ya lo tenés'); //cambiar por un pop up

        resetForm();
        setSubmitting(false);
      }}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Field
            as={TextField}
            label='Nombre Fideicomiso'
            type='string'
            maxLength={40}
            name='nombre'
          />
          <Field component={Picker} label='Inicio' type='date' name='fechaInicio' />
          <Field component={Picker} label='Finalizacion' type='date' name='fechaFin' />
       
       
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
  if(n.trim() ==''){return true}
  // controla si ya existe el nombre
  let url = `fideicomiso/mostrar/${idSociedad}/${nombre}`;
  return Boolean(await getMethod(url));
}

Picker.propTypes = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
};

ManipularFideicomiso.propTypes = {
  idSociedad: PropTypes.number.isRequired,
};
