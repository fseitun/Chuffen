import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Collapse, Box, TextField, Hidden, FormControlLabel, Checkbox, Button, Autocomplete, Alert } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';

export function ManipularOP({ idSociety, loggedUser, fideicomisos, proveedores, ddfacturas, ddfacturasBlue  }) {


  const queryClient = useQueryClient();

  var verCheckBlue = false;
  if(loggedUser?.['rol.op'] ==='total'){verCheckBlue = true;}


  const { mutate: addOP } = useMutation(
    newOP => postMethod(`OP/agregar/${idSociety.id}`, newOP),
    {
      onMutate: async newOP => {
        
        await queryClient.invalidateQueries(['OP', idSociety]);
        const prevData = await queryClient.getQueryData(['OP', idSociety]);
        const newData = [...prevData, { ...newOP, id: new Date().getTime() }];
        queryClient.setQueryData(['OP', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['OP', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['OP', idSociety]),
    }
  );

  const [fideInForm, setFideInForm] = useState(null);
  const [rsInForm, setRsInForm] = useState(null);
  const [factInForm, setFactInForm] = useState(null);  
  const [open, setOpen] = useState(false);

  
  let verCheckBlueDis = false;
  // let iniNumber = '';
  let iniBlue = true;
  let alwaysBlue = false;
  if(loggedUser?.['rol.op'] ==='blue'){
    // iniNumber = n
    iniBlue = false;
    verCheckBlueDis = true;
    verCheckBlue = false;
    alwaysBlue = true;
  }
  const [chkblue, setChkblue] = useState(iniBlue);


  return (
    <Formik
      initialValues={{
        
        numero: '',
        montoTotal: '',
        fechaIngreso: new Date(),

      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        if(values.fideicomiso.id > 0 && values.empresa.id > 0 && values.factura.id >0 && fideInForm.id > 0 && rsInForm.id > 0 && factInForm.id > 0 ){
          addOP({

            fideicomisoId: values.fideicomiso.id,
            empresaId: values.empresa.id,
            rubroId: values.empresa.rubroId,
            subRubroId: values.empresa.subrubroId,
            facturaId: values.factura.id,
            blue: !chkblue? 1:(alwaysBlue? 1:0),
            creador: loggedUser.id ,
                      
          });
          
          //resetForm();
          setOpen(true);
          setSubmitting(false);
        }else{console.log("no entro", values.fideicomiso.id, values.empresa.id, values.factura.id, fideInForm.id, rsInForm.id, factInForm.id);}
      }}>
      {({ isSubmitting, setFieldValue }) => (
        <Form>

          <Field
            as={Autocomplete}
            size={'small'}
            required
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
            required
            disablePortal
            style={{ width: '230px', display: 'inline-flex' }}
            onChange={(event, newValue) => {
              setRsInForm(newValue);
              setFactInForm(null);
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
          <Hidden  smUp={( !verCheckBlueDis)} >        
                <FormControlLabel 
                  control={ <Checkbox  disabled defaultChecked id={'blue'}  name={'blue2'}
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



