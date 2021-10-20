import { TextField, Button } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';

import { getMethod, postMethod } from 'src/utils/api';

export function ManipularOP({ idSociety }) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    newData => postMethod(`OP/agregar/${idSociety.id}`, newData),
    {
      onSuccess: () => {
        queryClient.refetchQueries(['OP', idSociety.id]);
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
        let bool = await checkIfNameExists(idSociety.id, values.nombre);
        !bool && mutate(values);

        resetForm();
        setSubmitting(false);
      }}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Field
            as={TextField}
            label='Nombre OP'
            type='string'
            maxLength={40}
            name='nombre'
          />
          <Field name='fechaInicio'>
            {({ field: { value, name }, form: { setFieldValue } }) => (
              <Picker label='Inicio' value={value} setFieldValue={setFieldValue} name={name} />
            )}
          </Field>
          <Field name='fechaFin'>
            {({ field: { value, name }, form: { setFieldValue } }) => (
              <Picker
                label='Finalizacion'
                value={value}
                setFieldValue={setFieldValue}
                name={name}
              />
            )}
          </Field>

          <Button type='submit' disabled={isSubmitting}>
            Agregar
          </Button>
        </Form>
      )}
    </Formik>
  );

  function Picker({ value, name, setFieldValue, label }) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DesktopDatePicker
          label={label}
          value={value}
          inputFormat='dd/MM/yyyy'
          renderInput={params => <TextField {...params} />}
          onChange={value => setFieldValue(name, value)}
        />
      </LocalizationProvider>
    );
  }

  async function checkIfNameExists(idSociety, nombre) {
    return Boolean(await getMethod(`OP/mostrar/${idSociety}/${nombre}`));
  }
}
