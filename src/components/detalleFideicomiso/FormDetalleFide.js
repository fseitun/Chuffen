import { useState } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { useContext } from 'react';
import { TipoProductosContext} from 'src/App';
 

export function FormDetalleFide({ idSociety, loggedUser, fideicomisoId, refetch }) {
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();
  const [tipoInForm, setTipoInForm] = useState(null);

  var tipoProductos = useContext(TipoProductosContext);

    
  const { mutate: addProducto } = useMutation(
    newProducto => postMethod(`producto/agregar/${idSociety.id}`, newProducto),
    {
      onMutate: async newProducto => {
        newProducto.fideicomisoId = parseInt(fideicomisoId);
        newProducto.creador = loggedUser.id;
                
        await queryClient.invalidateQueries(['producto', idSociety]);
        const prevData = await queryClient.getQueryData(['producto', idSociety]);
        /*const newData = [...prevData, { ...newProducto, id: new Date().getTime()}];
        queryClient.setQueryData(['producto', idSociety], newData);*/
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['producto', idSociety], context),
      onSettled: () => {
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['producto', idSociety])
        }
        refetch()        
      }
    }
  );

  return (
    <>
      <Formik
        initialValues={{
          codigo: '',
          descripcion: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {

          values.tipo = values._tipo.id;
          addProducto(values);
          // resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>

              <Field
                as={Autocomplete}
                size={'small'}
                label='Tipo'
                required
                disablePortal
                style={{ width: '230px', display: 'inline-flex' }}
                onChange={(event, newValue) => {
                  setTipoInForm(newValue);
                  //setFactInForm(null);
                  setFieldValue('_tipo', newValue);
                }}
                value={tipoInForm}
                getOptionLabel={option => option.descripcion}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={(tipoProductos? tipoProductos:[])}
                renderInput={params => <TextField {...params} label='Tipo' />}
              />
            
              <Field
                as={TextField}
                label="Unidad"
                key="codigo"
                type="string"
                maxLength={40}
                size={'small'}
                name="codigo"
              />
      
              <Field
                as={TextField}
                label='m² Cubierto'
                title="m² Cubierto, solo numeros."                  
                maxLength={9}
                type='float'
                size="small"
                style={{ width: '160px', display: 'inline-flex' }}
                name='mtCubiertos'
                onChange={event => onlyNumbers(event, setFieldValue, 'mtCubiertos')}
              />   

              <Field
                as={TextField}
                label='m² SemiCubierto'
                title="m² SemiCubierto, solo numeros."                  
                maxLength={9}
                type='float'
                size="small"
                style={{ width: '160px', display: 'inline-flex' }}
                name='mtSemiCubiertos'
                onChange={event => onlyNumbers(event, setFieldValue, 'mtSemiCubiertos')}
              />   

              <Field
                as={TextField}
                label='m² Terraza'
                title="m² Terraza, solo numeros."                  
                maxLength={9}
                type='float'
                size="small"
                style={{ width: '160px', display: 'inline-flex' }}
                name='mtTerraza'
                onChange={event => onlyNumbers(event, setFieldValue, 'mtTerraza')}
              />     

            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>
          </Form>
        )}
      </Formik>
      <Prompt
        message="El CUIT no puede estar en blanco"
        ok
      />
    </>
  );
}

function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,11}(\.\d{0,2})?$/;

  var key = event.which || event.keyCode; // keyCode detection
  var ctrl = event.ctrlKey ? event.ctrlKey : ((key === 17) ? true : false); // ctrl detection

  if (regex.test(value.toString()) || ctrl) {  
    setFieldValue(typeOfData, value.toString());
  }
}