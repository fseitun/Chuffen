import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import { getMethod, postMethod } from 'src/utils/api';

export function ManipularProveedores({ idSociedad }) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    (newData) =>
      // console.log(newData);
      // console.log(`cac/agregar/${idSociedad}`);

      postMethod(`proveedor/agregar/${idSociedad}`, newData),
    {
      onSuccess: () => queryClient.refetchQueries(['empresas', idSociedad])
    }
  );

  return (
    <Formik
      initialValues={{
        CUIT: '',
        razonSocial: ''
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        !(await checkCuit(idSociedad, values.CUIT))
          ? mutate(values)
          : console.log('ya lo tenés'); //cambiar por un pop up

        resetForm();
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Field
            as={TextField}
            label="CUIT"
            type="number"
            maxLength={11}
            name="CUIT"
            onChange={(event) => onlyNumbers(event, setFieldValue, 'CUIT')}
          />
          <Field
            as={TextField}
            label="Razón Social"
            type="string"
            name="razonSocial"
          />
          <Button type="submit" disabled={isSubmitting}>
            Agregar
          </Button>
        </Form>
      )}
    </Formik>
  );
}

async function checkCuit(idSociedad, cuit) {
  let url = `proveedor/mostrar/${idSociedad}/${cuit}`;
  return Boolean(await getMethod(url));
}

function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,11}$/;
  if (regex.test(value.toString())) {
    setFieldValue(typeOfData, value.toString());
  }
}

ManipularProveedores.propTypes = {
  idSociedad: PropTypes.number.isRequired
};
