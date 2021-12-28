import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Collapse, Box, TextField, Button, Autocomplete, Alert } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { getMethod, postMethod } from 'src/utils/api';



export function ManipularOP({ idSociety, loggedUser  }) {

  const { data: fideicomisos } = useQuery(
    ['fideicomisos'],
    () => getMethod(`fideicomiso/listar/${idSociety.id}`));


  const { data: proveedores } = useQuery(
    ['proveedores'],
    () => getMethod(`proveedor/listar/${idSociety.id}`));


  const { data: ddfacturas } = useQuery(
    ['ddfacturas'],
    () => getMethod(`factura/listar/${idSociety.id}/opid/0`));

  const queryClient = useQueryClient();

  const { mutate: addOP } = useMutation(
    newData => postMethod(`OP/agregar/${idSociety.id}`, newData),
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['OP', idSociety])
    }
  );


  const [fideInForm, setFideInForm] = useState(null);
  const [rsInForm, setRsInForm] = useState(null);
  const [factInForm, setFactInForm] = useState(null);  
  const [open, setOpen] = useState(false);
  
  return (
    <Formik
      initialValues={{
        
        numero: '',
        montoTotal: '',
        fechaIngreso: new Date(),

      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        
        addOP({
          fideicomisoId: values.fideicomiso.id,
          empresaId: values.empresa.id,
          rubroId: values.empresa.rubroId,
          subRubroId: values.empresa.subrubroId,
          facturaId: values.factura.id,
          creador: loggedUser.id ,
                    
        });

        //resetForm();
        setOpen(true);
        setSubmitting(false);
      }}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>

          <Field
            as={Autocomplete}
            size={'small'}
            label='Fideicomiso'
            disablePortal
            style={{ width: '230px', display: 'inline-flex' }}
            onChange={(event, newValue) => {
              setFideInForm(newValue);
              setFieldValue('fideicomiso', newValue);
            }}
            value={fideInForm}
            getOptionLabel={option => option.nombre}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={(fideicomisos? fideicomisos:[])}
            renderInput={params => <TextField {...params} label='Fideicomiso' />}
          />
          

          <Field
            as={Autocomplete}
            size={'small'}
            label='Razon Social'
            disablePortal
            style={{ width: '230px', display: 'inline-flex' }}
            onChange={(event, newValue) => {
              setRsInForm(newValue);
              setFieldValue('empresa', newValue);
            }}
            value={rsInForm}
            getOptionLabel={option => option.razonSocial}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={(proveedores? proveedores:[])}
            renderInput={params => <TextField {...params} label='Razon Social' />}
          />

          <Field
            as={Autocomplete}
            size={'small'}
            label='Factura N॰'
            disablePortal
            style={{ width: '230px', display: 'inline-flex' }}
            onChange={(event, newValue) => {
              setFactInForm(newValue);
              setFieldValue('factura', newValue);
            }}
            value={factInForm}
            getOptionLabel={option => option.numero}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={ddfacturas? ddfacturas?.filter(factura => factura?.empresaId === rsInForm?.id):[]}
            renderInput={params => <TextField {...params} label='Factura N॰' />}
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



