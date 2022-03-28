import { useState } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

                
export function FormDetalleFide({ idSociety, loggedUser, fideicomisoId, refetch }) {
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();
  const [tipoInForm, setTipoInForm] = useState(null);

  var tipoProductos = JSON.parse(localStorage.getItem("tipoProductos"));


    
  const { mutate: addProducto } = useMutation(
    newProducto => postMethod(`producto/agregar/${idSociety.id}`, newProducto),
    {
      onMutate: async newProducto => {
       //  console.log(newProducto, idSociety);
       //  let aa = newProducto.id;
        newProducto.fideicomisoId = parseInt(fideicomisoId);
        newProducto.creador = loggedUser.id;
        // newProducto.tipo = newProducto?.tipo?.id;
        newProducto.tipo = tipoInForm;
        console.log(22, newProducto)
        // newProducto.tipo = newProducto?.tipo?.id;
        
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
          tipo: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          // check cuit
          console.log(1111, values, idSociety);
          addProducto(values);
          resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            
            <Field
            as={TextField}
            label="Código"
            type="string"
            maxLength={40}
            size={'small'}
            name="codigo"
          />

    

          <Field
            as={TextField}
            size={'small'}
            label="Descripcion"
            type="string"
            maxLength={100}
            name="description"
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