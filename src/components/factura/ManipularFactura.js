import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Collapse, Box, TextField, Button, Autocomplete, Alert } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { getMethod, postMethod } from 'src/utils/api';

export function ManipularFactura({ idSociety, loggedUser }) {
  
  const { data: proveedores } = useQuery(
    ['proveedores'],
    () => getMethod(`proveedor/listar/${idSociety.id}`));



  const queryClient = useQueryClient();

  const { mutate: addFactura } = useMutation(
    newData => postMethod(`factura/agregar/${idSociety.id}`, newData),
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['facturas', idSociety])
    }
  );


  const [typeInForm, setTypeInForm] = useState(null);
  const [open, setOpen] = useState(false);

  return (
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

        resetForm();
        setOpen(true);
        setSubmitting(false);
      }}>
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

      

          <Button id='bagregar' variant="text" type='submit' disabled={isSubmitting}>
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
