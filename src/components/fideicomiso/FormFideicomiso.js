import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { Box, TextField, Button } from '@material-ui/core';
// import { Box, Container, Typography } from '@material-ui/core';
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

export function FormFideicomiso({ idSociedad }) {
  const queryClient = useQueryClient();
  const idFideicomiso = '1'; // params.queryClient.fide;
  const { mutate } = useMutation(newData => 
    postMethod(`fideicomiso/modificar_DIR/${idSociedad}/${idFideicomiso}`, newData), {
    
    onSuccess: () => {      
      queryClient.refetchQueries(['fideicomiso', idSociedad]);
    },
  });

  return (
    <Formik
      initialValues={{
        localizacionId: 'Av Livertador 3256',
        personaId: 23,
        fechaInicio: '2021-01-01',
        fechaFin: '2022-11-01',
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        resetForm();
        setSubmitting(false);
      }}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Box sx={{ pt: 3 }}>
            <Field
                as={TextField}
                label='Dirección de Obra'
                type='string'
                //width='200'
                maxLength={200}
                name='localizacionId'
            />

            <Field
                as={TextField}
                label='Contacto'
                //width='200'
                type='integer'
                // maxLength={40}
                name='personaId'
            />
            &nbsp;&nbsp;&nbsp;lalalala@gmail.com
          </Box>
          <Box sx={{ pt: 3 }}>
            <Field component={Picker} label='Inicio' type='date' name='fechaInicio' />
            <Field component={Picker} label='Finalizacion' type='date' name='fechaFin' />
        
        
            <Button type='submit' disabled={isSubmitting}>
                Actualizar
            </Button>
          </Box>
          
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

FormFideicomiso.propTypes = {
  idSociedad: PropTypes.number.isRequired,
};
