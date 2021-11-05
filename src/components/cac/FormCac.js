import { TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import { getMethod, postMethod } from 'src/utils/api';
import { dateToStringWithDayEqualToOne } from 'src/utils/utils';

export function FormCac({ idSociety }) {
  const queryClient = useQueryClient();
  const { mutate: addCac } = useMutation(
    newCac => postMethod(`cac/agregar/${idSociety.id}`, newCac),
    {
      onMutate: async newCac => {
        await queryClient.cancelQueries(['cac', idSociety]);
        const prevData = await queryClient.getQueryData(['cac', idSociety]);
        const newData = [...prevData, { ...newCac, id: new Date().getTime() }];
        queryClient.setQueryData(['cac', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['cac', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['cac', idSociety]),
    }
  );

  return (
    <Formik
      initialValues={{
        fecha: new Date(),
        estimado: '',
        definitivo: '',
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        values.fecha = dateToStringWithDayEqualToOne(values.fecha);
        (await isDateUsed(idSociety.id, values.fecha)) || addCac(values);
        resetForm();
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Field component={Picker} label="Fecha" type="date" name="fecha" />
          <Field
            as={TextField}
            label="Estimado"
            type="float"
            maxLength={4}
            name="estimado"
            onChange={event => onlyNumbers(event, setFieldValue, 'estimado')}
          />
          <Field
            as={TextField}
            label="Definitivo"
            type="float"
            name="definitivo"
            onChange={event => onlyNumbers(event, setFieldValue, 'definitivo')}
          />
          <Button type="submit" disabled={isSubmitting}>
            Agregar
          </Button>
        </Form>
      )}
    </Formik>
  );

  async function isDateUsed(idSociety, date) {
    let url = `cac/mostrar/${idSociety}/${date}`;
    return !!(await getMethod(url));
  }

  function onlyNumbers(event, setFieldValue, typeOfData) {
    event.preventDefault();
    const { value } = event.target;
    const regex = /^\d{0,4}(\.\d{0,2})?$/;
    if (regex.test(value.toString())) {
      setFieldValue(typeOfData, value.toString());
    }
  }

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
}