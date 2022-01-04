import { useState } from 'react';
import { useQuery} from 'react-query';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { IconButton, Collapse, Box, TextField, Button, Autocomplete, Alert } from '@mui/material';
import { getMethod, postMethod } from 'src/utils/api';
import CloseIcon from '@mui/icons-material/Close';
import { usePrompt } from 'src/utils/usePrompt';

export function FormFactura({ idSociety, loggedUser}) {
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const { data: proveedores } = useQuery(
    ['proveedores'],
    () => getMethod(`proveedor/listar/${idSociety.id}`));

  const { mutate: addFactura } = useMutation(
    newFactura => postMethod(`factura/agregar/${idSociety.id}`, newFactura),
    {
      onMutate: async newFactura => {
        newFactura.creador = loggedUser.id;
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
  const [open, setOpen] = useState(false);

  return (
    <>
      <Formik
        initialValues={{
          numero: '',
          montoTotal: '',
          fechaIngreso: new Date(),
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {

          addFactura({
            numero: values.numero,
            montoTotal: values.montoTotal,
            fechaIngreso: values.fechaIngreso,
            empresaId: values.empresa.id,
            moneda: 'ARS',
            creador: loggedUser.id
          });
          
          //resetForm();   
     
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>

            
             <Field
            as={Autocomplete}
            size={'small'}
            label='Razon Social'
            disablePortal
            style={{ width: '230px', display: 'inline-flex' }}
            onChange={(event, newValue) => {
              setTypeInForm(newValue);
              setFieldValue('empresa', newValue);
            }}
            value={typeInForm}
            getOptionLabel={option => option?.razonSocial}
            isOptionEqualToValue={(option, value) => option?.id === value.id}
            options={(proveedores? proveedores:[])}
            renderInput={params => <TextField {...params} label='Razon Social' />}
          />

          <Field
            as={TextField}
            label='Numero'
            type='float'
            maxLength={8}
            name='numero'
            onChange={event => onlyNumbers(event, setFieldValue, 'numero')}
          />

          <Field
            as={TextField}
            label='Monto'
            type='float'
            name='montoTotal'
            onChange={event => onlyNumbers(event, setFieldValue, 'montoTotal')}
          />
            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>

            <Box sx={{ width: '100%' }}>
            <Collapse in={open}>
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                Acción realizada!
              </Alert>
            </Collapse>         
          </Box>

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

function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,9}(\.\d{0,2})?$/;
  if (regex.test(value.toString())) {
    setFieldValue(typeOfData, value.toString());
  }
}

