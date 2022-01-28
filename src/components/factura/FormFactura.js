import { useState } from 'react';
import { useQuery} from 'react-query';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { isNumberUsedDig } from 'src/utils/utils';
import { IconButton, Collapse, Box, FormControlLabel, TextField, Button, Hidden, Checkbox, Autocomplete, Alert } from '@mui/material';
import { getMethod, postMethod } from 'src/utils/api';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { usePrompt } from 'src/utils/usePrompt';
import { yearMonthDayNum } from 'src/utils/utils'; 

export function FormFactura({ idSociety, loggedUser}) {
  //const { Prompt } = usePrompt();
  const { setIsPromptOpen, Prompt } = usePrompt();
  const queryClient = useQueryClient();

  // const [defaultFact, setDefaultFact] = useState(2021112101);

  // const [fblue, setFBlue] = useState(false);
  // var blue = 0;
  var verCheckBlue = false;
  if(loggedUser?.['rol.factura'] ==='total'){/*blue= -1;*/ verCheckBlue = true;}


  const { data: fideicomisos } = useQuery(
    ['fideicomisos'],
    () => getMethod(`fideicomiso/listar/${idSociety.id}`));

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

  const [fideInForm, setFideInForm] = useState(null);
  const [typeInForm, setTypeInForm] = useState(null);
  const [open, setOpen] = useState(false);
  const [chkblue, setChkblue] = useState(true);

  return (
    <>
      <Formik
        initialValues={{
          numero: '',
          montoTotal: '',
          fechaIngreso: new Date(),
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          let existe = await isNumberUsedDig('factura', idSociety.id, values.empresa.id , values.numero)
          if (existe || values.numero ==='') {
            setIsPromptOpen(true);
          }else{
            
            addFactura({
              numero: values.numero,
              montoTotal: values.montoTotal,
              fechaIngreso: values.fechaIngreso,
              empresaId: values.empresa.id,
              fideicomisoId: values.fideicomiso.id,
              moneda: 'ARS',
              blue: values.blue==='on'? 1:0,
              creador: loggedUser.id
            });            
            //resetForm();
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>

            <Field
              as={Autocomplete}
              size={'small'}
              label='Fideicomiso'
              title="Seleccione un fideicomiso."
              disablePortal
              required
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
            title="Seleccione un proveedor."
            disablePortal
            required
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
              title="Cargar número completo de la factura."
              label='Numero'
              type='float'
              required     
              maxLength={11}         
              size="small"
              sx={{ width: '20ch' }}
              name='numero'
              onChange={event => onlyNumbers(event, setFieldValue, 'numero')}
            /> 

          <Field
            as={TextField}
            label='Monto'
            title="Monto total, solo numeros."
            required
            maxLength={9}
            type='float'
            size="small"
            sx={{ width: '20ch' }}
            name='montoTotal'
            onChange={event => onlyNumbers(event, setFieldValue, 'montoTotal')}
          />

          &nbsp;&nbsp;
          <Hidden  smUp={( !verCheckBlue)} >        
          <FormControlLabel 
            control={ <Checkbox  id={'blue'}  name={'blue'}             
            onChange={(event) => onlyCheck(event, setFieldValue, 'blue', chkblue, setChkblue)}
            /> }   label="Blue"  />
          </Hidden>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

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
        message="Ya existe ese número de factura para esa razon social."
        ok
      />
    </>
  );
}

function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,11}(\.\d{0,2})?$/;
  if (regex.test(value.toString())) {
    setFieldValue(typeOfData, value.toString());
  }
}

function onlyCheck(event, setFieldValue, typeOfData, chkblue, setChkblue, setFBlue) {
  event.preventDefault();
  // const { value } = event.target;
  setChkblue(!chkblue);
  if(chkblue){ 
    let f = new Date();
    let n = "" + yearMonthDayNum(f) + "01";
    setFieldValue(typeOfData, 'on');
    setFieldValue('numero', parseInt(n));
    //setFBlue(true);

  }else{

    setFieldValue(typeOfData, 'off');
    setFieldValue('numero', '');
    //setFBlue(false);

  }
  
}



