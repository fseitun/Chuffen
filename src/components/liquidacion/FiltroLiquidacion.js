
  import { useState } from 'react';
  import { TextField, Autocomplete, Hidden } from '@mui/material';
  import { Formik, Form, Field } from 'formik';


  export function FiltroLiquidacion({modo, setFiltFide, setFiltContrato, setFiltPeriodo, fideicomisos, contratos, periodos}) {
 
    const [fideInForm, setFideInForm] = useState(null);    
    const [contInForm, setContInForm] = useState(null);
    const [perInForm, setPerInForm] = useState(null);

  
    function filterOP(campo, newValue){
  
      let id = -1
      if(newValue?.id){
        id = newValue.id;
      }
      
      if(campo ==='fide'){setFiltFide(id);}
      if(campo ==='contrato'){setFiltContrato(id);}
      if(campo ==='periodo'){setFiltPeriodo(id);}

    }  
    
    return (
      <Formik
        initialValues={{
          
          // numero: '',
          //montoTotal: '',
          //fechaIngreso: new Date(),
  
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
  
          setSubmitting(false);
        }}>
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <Hidden  smUp={modo==='contrato'} >
            <Field
              as={Autocomplete}
              size={'small'}
              
              label='Filtrar por Fideicomiso'
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
              renderInput={params => <TextField variant="standard" {...params} label='Filtrar por Fideicomiso' />}
            />

            &nbsp;
            <Field
              as={Autocomplete}
              size={'small'}
              label='Filtrar por Adhesión'
              disablePortal
              style={{ width: '230px', display: 'inline-flex' }}
              onChange={(event, newValue) => {
                setContInForm(newValue);
                filterOP('contrato', newValue);
              }}
              value={contInForm}
              getOptionLabel={option => option.nombre}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={(contratos? contratos:[])}
              renderInput={params => <TextField variant="standard" {...params} label='Filtrar por Adhesión' />}
            />
            &nbsp;
            </Hidden>
            <Field
              as={Autocomplete}
              size={'small'}
              label='Filtrar por Periodo'
              disablePortal
              style={{ width: '230px', display: 'inline-flex' }}
              onChange={(event, newValue) => {
                setPerInForm(newValue);
                filterOP('periodo', newValue);
              }}
              value={perInForm}
              getOptionLabel={option => ("" + option.periodo).slice(0,4) + "-" + ("" + option.periodo).slice(4,6) }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              options={(periodos? periodos:[])}
              renderInput={params => <TextField variant="standard" {...params} label='Filtrar por Periodo' />}
            />
            &nbsp;

          
          </Form>
        )}
      </Formik>
    );
  }
  