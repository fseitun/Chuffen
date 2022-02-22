import { useState } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import { Formik, Form, Field } from 'formik';

export function FiltroOT({setFiltFide, setFiltRS, setFiltEst, idSociety, loggedUser,  fideicomisos, proveedores, ddfacturas, ddfacturasBlue  }) {

  var estados = JSON.parse(localStorage.getItem("estados"));
  
  const [fideInForm, setFideInForm] = useState(null);
  const [rsInForm, setRsInForm] = useState(null);
  const [estadoInForm, setEstadoInForm] = useState(null);  

  function filterOT(campo, newValue){

    // let arr = filt;
    let id = -1
    if(newValue?.id){
      id = newValue.id;
    }
    
    if(campo ==='fide'){setFiltFide(id);}
    if(campo ==='rs'){setFiltRS(id);}
    if(campo ==='estado'){setFiltEst(id);}

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
            
            label='Filtrar por Fideicomiso'
            disablePortal
            style={{ width: '230px', display: 'inline-flex' }}
            onChange={(event, newValue) => {
              setFideInForm(newValue);
              filterOT('fide', newValue);
            }}
            value={fideInForm}
            getOptionLabel={option => option.nombre}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={(fideicomisos? fideicomisos:[])}
            renderInput={params => <TextField variant="standard" {...params} label='Filtrar por Fideicomiso' />}
          />
          
          &nbsp;
          <Field
            as={Autocomplete}
            size={'small'}
            label='Filtrar por Razon Social'
            disablePortal
            style={{ width: '230px', display: 'inline-flex' }}
            onChange={(event, newValue) => {
              setRsInForm(newValue);
              filterOT('rs', newValue);
            }}
            value={rsInForm}
            getOptionLabel={option => option.razonSocial}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            options={(proveedores? proveedores:[])}
            renderInput={params => <TextField variant="standard" {...params} label='Filtrar por Razon Social' />}
          />
          &nbsp;

        
        </Form>
      )}
    </Formik>
  );
}
