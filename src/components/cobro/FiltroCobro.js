
  import { useState } from 'react';
  import { TextField, Autocomplete } from '@mui/material';
  import { Formik, Form, Field } from 'formik';
  // import { useContext } from 'react';
  // import { TiposContext} from 'src/App';

  export function FiltroCobro({setFiltFide, setFiltCont, fideicomisos, contratos}) {
  

    // var tipos = useContext(TiposContext);
    const [fideInForm, setFideInForm] = useState(null);
    const [contInForm, setContInForm] = useState(null);  
  
    function filter(campo, newValue){
  
      let id = -1
      if(newValue?.id){
        id = newValue.id;
      }
      if(campo ==='cont'){setFiltCont(id);}
      if(campo ==='fide'){setFiltFide(id);}

    }  
    
    return (
      <Formik
        initialValues={{
          
          //numero: '',
          //montoTotal: '',
          //fechaIngreso: new Date(),
  
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
  
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
                filter('fide', newValue);
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
              label='Filtrar por contrato'
              disablePortal
              style={{ width: '230px', display: 'inline-flex' }}
              onChange={(event, newValue) => {
                setContInForm(newValue);
                filter('cont', newValue);
              }}
              value={contInForm}
              getOptionLabel={option => option.nombre}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={(contratos? contratos:[])}
              renderInput={params => <TextField variant="standard" {...params} label='Filtrar por contrato' />}
            />
            &nbsp;

          
          </Form>
        )}
      </Formik>
    );
  }
  