import { TextField, Button } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';

                
export function FormPersona({ idSociety, loggedUser }) {
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const { mutate: addPersona } = useMutation(
    newPersona => postMethod(`persona/agregar/${idSociety.id}`, newPersona),
    {
      onMutate: async newPersona => {
  
        newPersona.creador = loggedUser.id;
        await queryClient.invalidateQueries(['persona', idSociety]);
        const prevData = await queryClient.getQueryData(['persona', idSociety]);
        const newData = [...prevData, { ...newPersona, id: new Date().getTime()}];
        queryClient.setQueryData(['persona', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['persona', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['persona', idSociety]),
    }
  );

  return (
    <>
      <Formik
        initialValues={{
          nombre: '',
          mail: '',
          telefono: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          // check cuit
          addPersona(values);
          resetForm();
          setSubmitting(false);
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>

            <Field required size="small" as={TextField} label="Nombre" type="string" maxLength={40} name="nombre" />
            <Field required size="small" as={TextField} label="Email" type="string" maxLength={100} name="mail" />
            <Field  size="small" as={TextField} label="Teléfono" type="string" maxLength={11} name="telefono" />
              

            <Button type="submit" disabled={isSubmitting}>
              Agregar
            </Button>
          </Form>
        )}
      </Formik>
      <Prompt
        message="El nombre y el mail no pueden estar en blanco"
        ok
      />
    </>
  );
}
/*
function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,11}$/;
  if (regex.test(value.toString())) {
    setFieldValue(typeOfData, value.toString());
  }
}*/
