import { TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { postMethod } from 'src/utils/api';
import { yearMonthDayString, isDateUsed } from 'src/utils/utils';
import { usePrompt } from 'src/utils/usePrompt';
// import useUser from "../../hooks/useUser";

export function FormDolar({ idSociety, loggedUser}) {
  const { setIsPromptOpen, Prompt } = usePrompt();
  const queryClient = useQueryClient();
  /*
  const user = useUser();
  console.log(user); */

  const { mutate: addDolar } = useMutation(
    newDolar => postMethod(`dolar/agregar/${idSociety.id}`, newDolar),
    {
      onMutate: async newDolar => {
        newDolar.creador = loggedUser.id;
        await queryClient.invalidateQueries(['dolar', idSociety]);
        const prevData = await queryClient.getQueryData(['dolar', idSociety]);
        const newData = [...prevData, { ...newDolar, id: new Date().getTime() }];
        queryClient.setQueryData(['dolar', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['dolar', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['dolar', idSociety]),
    }
  );

  return (
    <>
      <Formik
        initialValues={{
          fecha: new Date(),
          mep: '',
          BCRA: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          values.fecha = yearMonthDayString(values.fecha);
          if (await isDateUsed('dolar', idSociety.id, values.fecha)) {
            setIsPromptOpen(true);
          } else addDolar(values);
          resetForm();
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <Field component={Picker} label="Fecha" type="date" name="fecha" />
            <Field
              as={TextField}
              label="BCRA"
              size="small"
              type="float"
              maxLength={4}
              name="BCRA"
              onChange={event => onlyNumbers(event, setFieldValue, 'BCRA')}
            />
            <Field
              as={TextField}
              label="MEP"
              size="small"
              type="float"
              name="mep"
              onChange={event => onlyNumbers(event, setFieldValue, 'mep')}
            />
            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>
          </Form>
        )}
      </Formik>
      <Prompt
        message="Ya existe un tipo de cambio en esa fecha, por favor editar u eliminar el registro"
        ok
      />
    </>
  );
}

function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,3}(\.\d{0,2})?$/;
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
        renderInput={params => <TextField required size="small" {...params} />}
      />
    </LocalizationProvider>
  );
}