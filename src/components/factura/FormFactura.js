import { useState } from 'react';

import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { isNumberUsedDig } from 'src/utils/utils';
import { IconButton, Collapse, Box, Grid, FormControlLabel, TextField, Button, Hidden, Checkbox, Autocomplete, Alert } from '@mui/material';
import { postMethod } from 'src/utils/api';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { usePrompt } from 'src/utils/usePrompt';
import { yearMonthDayNum } from 'src/utils/utils'; 

export function FormFactura({ idSociety, loggedUser, fideicomisos, proveedores}) {

  const { setIsPromptOpen, Prompt } = usePrompt();
  const queryClient = useQueryClient();

  var verCheckBlue = false;
  if(loggedUser?.['rol.factura'] ==='total'){/*blue= -1;*/ verCheckBlue = true;}


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

  var tipos = JSON.parse(localStorage.getItem("tipos"));


  const [tipoInForm, setTipoInForm] = useState({id: 0, descripcion: 'Factura'});
  const [fideInForm, setFideInForm] = useState(null);
  const [typeInForm, setTypeInForm] = useState(null);
  const [open, setOpen] = useState(false);

  let verCheckBlueDis = false;
  let iniNumber = '';
  let iniBlue = true;
  let alwaysBlue = false;

  let f = new Date();
  let n = "" + yearMonthDayNum(f) + "01";

  if(loggedUser?.['rol.descripcion'] ==='blue'){
    iniNumber = n
    iniBlue = false;
    verCheckBlueDis = true;
    verCheckBlue = false;
    alwaysBlue = true;
  }


  const [chkblue, setChkblue] = useState(iniBlue);


  return (
    <>
      <Formik
        initialValues={{
          numero: iniNumber,
          montoTotal: '',
          fechaIngreso: new Date(),
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {

          if(values?.tipo === undefined){values.tipo = tipoInForm;}
  
          let existe = await isNumberUsedDig('factura', idSociety.id, values.empresa.id , values.numero)
          if (existe || values.numero ==='') {
          
            setIsPromptOpen(true);
          }else{
            
            let tot = parseFloat(values.neto)
            if(values.iva){tot +=parseFloat(values.iva);}
            if(values.percepciones){tot +=parseFloat(values.percepciones);}

            addFactura({
              numero: values.numero,
              neto: values.neto,
              iva: values.iva,
              percepciones: values.percepciones,
              montoTotal: values.tipo.id===2? (-1 * tot):tot,
              fechaIngreso: values.fechaIngreso,
              tipo: values.tipo.id,
              empresaId: values.empresa.id,
              fideicomisoId: values.fideicomiso.id,
              moneda: 'ARS',
              blue: values.blue==='on'? 1:(alwaysBlue? 1:0),
              creador: loggedUser.id
            });          
            //resetForm();
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>

            <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >                  

              <Grid item md={12}>      

                <Field
                as={Autocomplete}
                size={'small'}
                label='Tipo'
                title="Tipo de comprobante"
                disablePortal
                required
                style={{ width: '180px', display: 'inline-flex' }}
                onChange={(event, newValue) => {
                  setTipoInForm(newValue);
                  setFieldValue('tipo', newValue);
                  setNumber((newValue?.id===3), setFieldValue)
                }}
                value={tipoInForm}
                getOptionLabel={option => option.descripcion}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={(tipos? tipos:[])}
                renderInput={params => <TextField {...params} label='Tipo de comprobante' />}
              />

              <Field
                as={Autocomplete}
                size={'small'}
                label='Fideicomiso'
                title="Seleccione un fideicomiso."
                disablePortal
                required
                style={{ width: '180px', display: 'inline-flex' }}
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

              <Button type="submit" disabled={isSubmitting}>
                Agregar
              </Button>            
                
              </Grid>
              <Grid item md={12}> 

                <Field
                  as={TextField}
                  label='Neto'
                  title="Monto , solo numeros."
                  required
                  maxLength={9}
                  type='float'
                  size="small"
                  style={{ width: '180px', display: 'inline-flex' }}
                  name='neto'
                  onChange={event => onlyNumbers(event, setFieldValue, 'neto')}
                />       
                <Field
                  as={TextField}
                  label='Iva'
                  title="Iva, solo numeros."                  
                  maxLength={9}
                  type='float'
                  size="small"
                  style={{ width: '180px', display: 'inline-flex' }}
                  name='iva'
                  onChange={event => onlyNumbers(event, setFieldValue, 'iva')}
                />  
                    <Field
                  as={TextField}
                  label='Percepciones'
                  title="Percepciones, solo numeros."                  
                  maxLength={9}
                  type='float'
                  size="small"
                  style={{ width: '230px', display: 'inline-flex' }}
                  name='percepciones'
                  onChange={event => onlyNumbers(event, setFieldValue, 'percepciones')}
                />            
                
              </Grid>

            </Grid>    

            

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
  // var regex2 = /[\x08\x0D\d]/;
  var key = event.which || event.keyCode; // keyCode detection
  var ctrl = event.ctrlKey ? event.ctrlKey : ((key === 17) ? true : false); // ctrl detection
  // if (regex.test(value.toString()) || regex2.test(value.toString())) {
    if (regex.test(value.toString()) || ctrl) {  
    setFieldValue(typeOfData, value.toString());
  }
}

function setNumber(val, setFieldValue){

  if(val){
    let f = new Date();
    let n = "" + yearMonthDayNum(f) + "01";
    setFieldValue('numero', parseInt(n));
  }else{
    setFieldValue('numero', '');
  }
}

function onlyCheck(event, setFieldValue, typeOfData, chkblue, setChkblue, setFBlue) {
  event.preventDefault();
  // const { value } = event.target;
  setChkblue(!chkblue);
  if(chkblue){ 

    setNumber(true, setFieldValue);
    setFieldValue(typeOfData, 'on');    
    //setFBlue(true);

  }else{

    setFieldValue(typeOfData, 'off');
    setNumber(false, setFieldValue);
    
    //setFBlue(false);

  }
  
}



