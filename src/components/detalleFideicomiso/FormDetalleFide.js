import { TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

                
export function FormDetalleFide({ idSociety, loggedUser }) {
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const { mutate: addProveedor } = useMutation(
    newProveedor => postMethod(`proveedor/agregar/${idSociety.id}`, newProveedor),
    {
      onMutate: async newProveedor => {
        newProveedor.creador = loggedUser.id;
        await queryClient.invalidateQueries(['proveedor', idSociety]);
        const prevData = await queryClient.getQueryData(['proveedor', idSociety]);
        const newData = [...prevData, { ...newProveedor, id: new Date().getTime()}];
        queryClient.setQueryData(['proveedor', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['proveedor', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['proveedor', idSociety]),
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
          addProveedor(values);
          resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            
            <Field
            as={TextField}
            label='CUIT'
            type='string'
            required
            size="small"
            maxLength={11}
            name='CUIT'
            onChange={event => onlyNumbers(event, setFieldValue, 'CUIT')}
          />
          
          <Field as={TextField} required size="small" label='Razón Social' type='string' name='razonSocial' />

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
/* USAR !!!
async function checkCuit(idSociety, cuit) {
  let url = `proveedor/mostrar/${idSociety}/${cuit}`;
  ///return Boolean(await getMethod(url));
  return false;
}*/

function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,11}$/;
  if (regex.test(value.toString())) {
    setFieldValue(typeOfData, value.toString());
  }
}
