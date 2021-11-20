import { useState } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
// import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
// import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';

import { getMethod, postMethod } from 'src/utils/api';
// import { yearMonthDayString, isDateUsed } from 'src/utils/utils';
import { usePrompt } from 'src/utils/usePrompt';

export function AgregarFactura({ idSociety, empresaId }) {
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();
  
  const { data: facturas } = useQuery(
    ['facturas'],
    () => getMethod(`factura/listar/${idSociety.id}/opid/0`));

  /*
  {
    //libera la factura con OPId= null
    id: id,
    OPId: null,
  }*/

  const { mutate: addFactura } = useMutation(
    newFactura => postMethod(`factura/modificar/${idSociety.id}/todas/nada`, newFactura),
    {
      onMutate: async newFactura => {
        await queryClient.invalidateQueries(['factura', idSociety]);
        const prevData = await queryClient.getQueryData(['factura', idSociety]);
        const newData = [...prevData, { ...newFactura, id: new Date().getTime() }];
        queryClient.setQueryData(['factura', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['factura', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['factura', idSociety]),
    }
  );

  const [typeInForm, setTypeInForm] = useState(null);

  return (
    <>
      <Formik
        initialValues={{
          numero: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          // values.fecha = yearMonthDayString(values.fecha);
          //if (await isDateUsed('factura', idSociety.id)) {
          //  setIsPromptOpen(true);
          //} else 
          addFactura(values);
          resetForm();
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>

            <Field
              as={Autocomplete}
              size={'small'}
              label='Número Factura'
              disablePortal
              style={{ width: '230px', display: 'inline-flex' }}
              onChange={(event, newValue) => {
                setTypeInForm(newValue);
                setFieldValue('factura', newValue);
              }}
              value={typeInForm}
              getOptionLabel={option => option.numero}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={facturas? facturas?.filter(factura => factura?.empresaId === parseInt(empresaId)):[]}
              renderInput={params => <TextField {...params} label='Número Factura' />}
            />
            
         
            <Button type="submit" disabled={isSubmitting}>
              Agregar Factura
            </Button>
          </Form>
        )}
      </Formik>
      <Prompt
        message="...error"
        ok
      />
    </>
  );
}
