
  import { useState } from 'react';
  import { TextField, Autocomplete } from '@mui/material';
  import { Formik, Form, Field } from 'formik';
  
  export function FiltroFactura({setFiltComp, setFiltFide, setFiltRS, idSociety, fideicomisos, proveedores}) {
  
    var tipos = JSON.parse(localStorage.getItem("tipos"));
    
    const [fideInForm, setFideInForm] = useState(null);
    const [rsInForm, setRsInForm] = useState(null);
    const [compInForm, setCompInForm] = useState(null);  
  
    function filterOP(campo, newValue){
  
      // let arr = filt;
      let id = -1
      if(newValue?.id){
        id = newValue.id;
      }
      if(campo ==='comp'){setFiltComp(id);}
      if(campo ==='fide'){setFiltFide(id);}
      if(campo ==='rs'){setFiltRS(id);}
 
      // setFilt(arr);
      console.log(2222, id);
    }  
    
    return (
      <Formik
        initialValues={{
          
          numero: '',
          montoTotal: '',
          fechaIngreso: new Date(),
  
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
           
          // 
  
          setSubmitting(false);
        }}>
        {({ isSubmitting, setFieldValue }) => (
          <Form>

            <Field
              as={Autocomplete}
              size={'small'}
              label='Filtar por Tipo Comprobante'
              disablePortal
              style={{ width: '230px', display: 'inline-flex' }}
              onChange={(event, newValue) => {
                setCompInForm(newValue);
                filterOP('comp', newValue);
              }}
              value={compInForm}
              getOptionLabel={option => option.descripcion}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={(tipos? tipos:[])}
              renderInput={params => <TextField variant="standard" {...params} label='Filtar por Tipo Comprobante' />}
            />
            &nbsp;
  
            <Field
              as={Autocomplete}
              size={'small'}
              
              label='Filtar por Fideicomiso'
              disablePortal
              style={{ width: '230px', display: 'inline-flex' }}
              onChange={(event, newValue) => {
                setFideInForm(newValue);
                filterOP('fide', newValue);
              }}
              value={fideInForm}
              getOptionLabel={option => option.nombre}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={(fideicomisos? fideicomisos:[])}
              renderInput={params => <TextField variant="standard" {...params} label='Filtar por Fideicomiso' />}
            />
            
            &nbsp;
            <Field
              as={Autocomplete}
              size={'small'}
              label='Filtar por Razon Social'
              disablePortal
              style={{ width: '230px', display: 'inline-flex' }}
              onChange={(event, newValue) => {
                setRsInForm(newValue);
                filterOP('rs', newValue);
              }}
              value={rsInForm}
              getOptionLabel={option => option.razonSocial}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={(proveedores? proveedores:[])}
              renderInput={params => <TextField variant="standard" {...params} label='Filtar por Razon Social' />}
            />
            &nbsp;

          
          </Form>
        )}
      </Formik>
    );
  }
  