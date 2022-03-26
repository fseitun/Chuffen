import { useState } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { getMethod, postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

                
export function FormDetalleFide({ idSociety, loggedUser, tipo }) {
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();
  const [typeInForm, setTypeInForm] = useState(null);

  const typesOfProducts = [ 
        {
          id: 7,
          descripcion: 'UF',
          codigo: 1,
          descripcionLarga: 'Unidad funcional',
        },
        {
          id: 8,
          descripcion: 'Cod. Nom.',
          codigo: 2,
          descripcionLarga: 'Código de nomenclatura',
        },
        {
          id: 9,
          descripcion: 'Cochera',
          codigo: 3,
          descripcionLarga: 'Cochera Auto',
        },
        {
          id: 10,
          descripcion: 'Cochera Moto',
          codigo: 4,
          descripcionLarga: 'Cochera Moto',
        },
        {
          id: 11,
          descripcion: 'Baulera',
          codigo: 5,
          descripcionLarga: 'Baulera',
        },
        {
          id: 12,
          descripcion: 'Local',
          codigo: 6,
          descripcionLarga: 'Local comercial',
        },
        {
          id: 13,
          descripcion: 'Lote',
          codigo: 7,
          descripcionLarga: 'Lote, terreno',
        },
        {
          id: 14,
          descripcion: 'Casa',
          codigo: 8,
          descripcionLarga: 'Casa',
        },
        {
          id: 15,
          descripcion: 'Bungalo',
          codigo: 9,
          descripcionLarga: 'Bungalo',
        },
      ];
    
  const { mutate: addProducto } = useMutation(
    newProducto => postMethod(`producto/agregar/${idSociety.id}`, newProducto),
    {
      onMutate: async newProducto => {
        if(tipo===1){
          newProducto.esFiduciante = 1;
        }else{
          newProducto.esProveedor = 1;
        }
        newProducto.creador = loggedUser.id;
        await queryClient.invalidateQueries(['producto', idSociety]);
        const prevData = await queryClient.getQueryData(['producto', idSociety]);
        const newData = [...prevData, { ...newProducto, id: new Date().getTime()}];
        queryClient.setQueryData(['producto', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['producto', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['producto', idSociety]),
    }
  );

  return (
    <>
      <Formik
        initialValues={{
          razonSocial: '',
          CUIT: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          // check cuit
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
            name="code"
          />

          <Field
            as={Autocomplete}
            size={'small'}
            label="Tipo"
            //disablePortal
            style={{ width: '230px', display: 'inline-flex' }}
            onChange={(event, newValue) => {
              setTypeInForm(newValue);
              setFieldValue('type', newValue);
            }}
            value={typeInForm}
            getOptionLabel={option => option.descripcion}
            isOptionEqualToValue={(option, value) => option.descripcion === value.descripcion}
            options={typesOfProducts}
            renderInput={params => <TextField {...params} label="Tipo" />}
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

function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,11}$/;
  if (regex.test(value.toString())) {
    setFieldValue(typeOfData, value.toString());
  }
}
