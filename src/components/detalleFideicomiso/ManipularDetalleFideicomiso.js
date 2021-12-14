import { useState } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';

import { getMethod, postMethod } from 'src/utils/api';

export function ManipularDetalleFideicomiso({ idSociety, selectedFideicomisoData }) {
  // console.log('selectedFideicomisoData', selectedFideicomisoData);
  const { data: typesOfProducts } = useQuery(
    ['typesOfProducts'],
    () => getMethod(`configuracion/listar/${idSociety.id}/tipo_producto`),
    {
      initialData: [
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
      ],
    }
  );
  // console.log('typesOfProducts:', typesOfProducts);

  const queryClient = useQueryClient();
  const { mutate: addProduct } = useMutation(
    newData => postMethod(`producto/agregar/${idSociety.id}`, newData),
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['productos', idSociety, selectedFideicomisoData]),
    }
  );

  const [typeInForm, setTypeInForm] = useState(null);

  return (
    <Formik
      initialValues={{
        code: '',
        type: '',
        description: '',
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        // console.log('values:', values);
        addProduct({
          fideicomisoId: selectedFideicomisoData.id,
          codigo: values.code,
          descripcion: values.description,
          tipo: values.type.codigo,
        });
        resetForm();
        setTypeInForm(null);
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
  );
}
