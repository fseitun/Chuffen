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

  //var tipoProductos = JSON.parse(localStorage.getItem("tipoProductos"));
  var tipoProductos = useContext(TipoProductosContext);

  //const [rsInForm, setRsInForm] = useState(null);
    
  const { mutate: addProducto } = useMutation(
    newProducto => postMethod(`producto/agregar/${idSociety.id}`, newProducto),
    {
      onMutate: async newProducto => {
        newProducto.fideicomisoId = parseInt(fideicomisoId);
        newProducto.creador = loggedUser.id;
        console.log(22, newProducto)
        
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
            as={TextField}
            label="Código"
            key="codigo"
            type="string"
            maxLength={40}
            size={'small'}
            name="codigo"
          />

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
            label="Descripción"
            key="descripcion"
            type="string"
            // maxLength={40}
            size={'small'}
            name="descripcion"
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