
  import { useState } from 'react';
  import { TextField, Autocomplete } from '@mui/material';
  import { Formik, Form, Field } from 'formik';
  import { useContext } from 'react';
  import { SocietyContext, EstadosContext, FormaPagosContext, RetencionesContext, FondosContext} from 'src/App';

  
  export function PrincipalDetalleFide({setFiltComp, setFiltFide, setFiltRS, idSociety, fideicomisos, proveedores}) {
  
    var tipos = useContext(TiposContext);

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
              label='Filtrar por Tipo Comprobante'
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
              renderInput={params => <TextField variant="standard" {...params} label='Filtrar por Tipo Comprobante' />}
            />
            &nbsp;
  
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
  