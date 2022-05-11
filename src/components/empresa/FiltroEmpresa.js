
  import { useState } from 'react';
  import { TextField, Autocomplete } from '@mui/material';
  import { Formik, Form, Field } from 'formik';

  export function FiltroEmpresa({setFiltRS, idSociety, fideicomisos, proveedores}) {
  

    // var tipos = useContext(TiposContext);
    const [rsInForm, setRsInForm] = useState(null); 
  
    function filterOP(campo, newValue){
  
      let id = -1
      if(newValue?.id){
        id = newValue.id;
      }
      if(campo ==='rs'){setFiltRS(id);}

    }  
    
    return (
      <Formik
        initialValues={{
          
          numero: '',
          montoTotal: '',
          fechaIngreso: new Date(),
  
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
  
          setSubmitting(false);
        }}>
        {({ isSubmitting, setFieldValue }) => (
          <Form>

  
        
            <Field
              as={Autocomplete}
              size={'small'}
              label='Filtrar por Razon Social'
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
              renderInput={params => <TextField variant="standard" {...params} label='Filtrar por Razon Social' />}
            />
            &nbsp;

          
          </Form>
        )}
      </Formik>
    );
  }
  