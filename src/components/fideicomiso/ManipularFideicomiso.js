import { TextField, Button } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';

import { getMethod, postMethod } from 'src/utils/api';

function Picker({ field, form }) {
  const { name, value } = field;
  const { setFieldValue } = form;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label={1}
        inputFormat='dd/MM/yyyy'
        value={value}
        onChange={value => setFieldValue(name, value)}
        renderInput={params => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

export function ManipularFideicomiso({ idSociety }) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    newData => postMethod(`fideicomiso/agregar/${idSociety.id}`, newData),
    {
      onSuccess: () => {
        queryClient.refetchQueries(['fideicomiso', idSociety.id]);
      },
    }
  );

  return (
    <Formik
      initialValues={{
        nombre: '',
        fechaInicio: null,
        fechaFin: null,
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        let bool = await checkName(idSociety.id, values.nombre);
        !bool && mutate(values); //cambiar por un pop up

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

async function checkName(idSociety, nombre) {
  let n = new String(nombre);
  // controla blanco y espacios
  if (n.trim() == '') {
    return true;
  }
  // controla si ya existe el nombre
  let url = `fideicomiso/mostrar/${idSociety}/${nombre}`;
  return Boolean(await getMethod(url));
}
