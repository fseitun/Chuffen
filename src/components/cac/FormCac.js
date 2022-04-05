import { TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { dateToStringWithDayEqualToOne, isDateUsed } from 'src/utils/utils';

export function FormCac({ idSociety, loggedUser }) {
  const { Prompt, setIsPromptOpen } = usePrompt();
  const queryClient = useQueryClient();

  const { mutate: addCac } = useMutation(
    newCac => postMethod(`cac/agregar/${idSociety.id}`, newCac),
    {
      onMutate: async newCac => {
        newCac.creador = loggedUser.id;
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
    <>
      <Formik
        initialValues={{
          fecha: new Date(),
          estimado: '',
          definitivo: '',
          materiales: '',
          manodeobra: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          values.fecha = dateToStringWithDayEqualToOne(values.fecha);
          if (await isDateUsed('cac', idSociety.id, values.fecha)) {
            setIsPromptOpen(true);
          } else addCac(values);
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
              required
              type="float"
              style={{ width: '140px'}}
              size="small"
              maxLength={4}
              name="estimado"
              onChange={event => onlyNumbers(event, setFieldValue, 'estimado')}
            />
            <Field
              as={TextField}
              label="Definitivo"
              required
              type="float"
              size="small"
              style={{ width: '140px'}}
              name="definitivo"
              onChange={event => onlyNumbers(event, setFieldValue, 'definitivo')}
            />
            <Field
              as={TextField}
              label="Materiales"
              required
              type="float"
              size="small"
              style={{ width: '140px'}}
              name="materiales"
              onChange={event => onlyNumbers(event, setFieldValue, 'materiales')}
            />
            <Field
              as={TextField}
              label="Mano de obra"
              required
              type="float"
              size="small"
              style={{ width: '140px'}}
              name="manodeobra"
              onChange={event => onlyNumbers(event, setFieldValue, 'manodeobra')}
            />
            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>
          </Form>
        )}
      </Formik>
      <Prompt
        message="Ya hay un mes con información, por favor editar el mes desde la grilla."
        ok
      />
    </>
  );

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
          renderInput={params => <TextField required size="small" {...params} />}
        />
      </LocalizationProvider>
    );
  }
}
