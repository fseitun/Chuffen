import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Collapse, Box, TextField, Hidden, FormControlLabel, Checkbox, Button, Autocomplete, Alert } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';

export function ManipularOP({ idSociety, loggedUser, fideicomisos, proveedores, ddfacturas, ddfacturasBlue  }) {

  var verCheckBlue = false;
  if(loggedUser?.['rol.factura'] ==='total'){verCheckBlue = true;}
  const [chkblue, setChkblue] = useState(true);

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
          blue: !chkblue? 1:0,
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
            style={{ width: '230px', display: !chkblue?'none':'inline-flex' }}
            onChange={(event, newValue) => {
              setFactInForm(newValue);
              setFieldValue('factura', newValue);
            }}
            value={factInForm}
            getOptionLabel={option => option.numero}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={ddfacturas? ddfacturas?.filter(factura => factura?.fideicomisoId === fideInForm?.id && factura?.empresaId === rsInForm?.id):[]}
            renderInput={params => <TextField {...params} label='Factura N॰' />}
          />

          <Field
            as={Autocomplete}
            size={'small'}
            label='Factura Blue N॰'
            disablePortal
            style={{ width: '230px', display: chkblue?'none':'inline-flex' }}
            onChange={(event, newValue) => {
              setFactInForm(newValue);
              setFieldValue('factura', newValue);
            }}
            value={factInForm}
            getOptionLabel={option => option.numero}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={ddfacturasBlue? ddfacturasBlue?.filter(factura => factura?.fideicomisoId === fideInForm?.id && factura?.empresaId === rsInForm?.id):[]}
            renderInput={params => <TextField {...params} label='Factura Blue N॰' />}
          />

          &nbsp;&nbsp;          
          <Hidden  smUp={( !verCheckBlue)} >        
          <FormControlLabel 
            control={ <Checkbox  id={'blue'}  name={'blue'}             
            onChange={(event) => onlyCheck(event, setFieldValue, 'blue', chkblue, setChkblue)}
            /> }   label="Blue"  />
          </Hidden>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

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

function onlyCheck(event, setFieldValue, typeOfData, chkblue, setChkblue) {
  event.preventDefault();
  
  setChkblue(!chkblue);
  if(chkblue){ 
    setFieldValue(typeOfData, 'on');
  }else{
    setFieldValue(typeOfData, 'off');
  }
  
}



