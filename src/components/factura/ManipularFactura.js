import { useState } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';

import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';

import { getMethod, postMethod } from 'src/utils/api';
import { mostrarFecha, yearMonthDayString, yearMonthOneString } from 'src/utils/utils';

function Picker({ field, form }) {
  const { name, value } = field;
  const { setFieldValue } = form;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label="Fecha"
        inputFormat="dd/MM/yyyy"
        value={value}
        onChange={value => setFieldValue(name, value)}
        renderInput={params => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

export function ManipularFactura({ idSociety }) {
  const { data: proveedores } = useQuery(['proveedores'], () =>
    getMethod(`proveedor/listar/${idSociety.id}`)
  );

  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    newData => postMethod(`factura/agregar/${idSociety.id}`, newData),
    {
      onSuccess: () => {
        queryClient.refetchQueries(['factura', idSociety.id]);
      },
    }
  );

  const [typeInForm, setTypeInForm] = useState(null);

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
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Field
            as={Autocomplete}
            label="Razon Social"
            disablePortal
            style={{ width: '230px', display: 'inline-flex' }}
            onChange={(event, newValue) => {
              //TODO resolver
              setTypeInForm(newValue);
              setFieldValue('type', newValue);
            }}
            value={typeInForm}
            getOptionLabel={option => option.razonSocial}
            isOptionEqualToValue={(option, value) => option.razonSocial === value.razonSocial}
            options={proveedores} //TODO resolver quilombo de opciones "ForwardRef"
            renderInput={params => <TextField {...params} label="Razon Social" />}
          />

          <Field
            as={TextField}
            label="Numero"
            type="float"
            maxLength={4}
            name="numero"
            onChange={event => onlyNumbers(event, setFieldValue, 'numero')}
          />

          <Field
            as={TextField}
            label="Monto"
            type="float"
            name="montoTotal"
            onChange={event => onlyNumbers(event, setFieldValue, 'montoTotal')}
          />

          <Button type="submit" disabled={isSubmitting}>
            Agregar
          </Button>
        </Form>
      )}
    </Formik>
  );
}

async function checkDate(idSociety, date) {
  let url = `factura/mostrar/${idSociety}/${yearMonthDayString(date)}`;
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
