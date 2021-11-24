import { useState } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { getMethod, postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

export function AgregarFactura({ idSociety, empresaId, OPId }) {
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
    async factura =>
      await postMethod(`factura/modificar/${idSociety.id}`, 
      {id: factura?.factura?.id,
      OPId: OPId
      }),
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['facturas', idSociety]),
    }
  );

/*
  const { mutate: addFactura } = useMutation(
    
    async ({ id, value }) =>
       console.log('newDataddddd', id, value)/*
      await postMethod(`factura/modificar/${idSociety.id}`, {
        id,
        opid: value,
      }),
    {
      onMutate: async ({ id, value }) => {
        await queryClient.cancelQueries(['facturas', idSociety]);
        const prevData = queryClient.getQueryData(['facturas', idSociety]);
        // console.log('prevData', prevData);
        const newData = [
          ...prevData.filter(facturas => facturas.id !== id),
          { ...prevData.find(facturas => facturas.id === id), opid: 7 },
        ];
        // console.log('newData', newData);
        queryClient.setQueryData(['facturas', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['facturas', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['facturas', idSociety]),
    }
  );*/


  const [typeInForm, setTypeInForm] = useState(null);

  return (
    <>
      <Formik
        initialValues={{
          factura: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
       
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
