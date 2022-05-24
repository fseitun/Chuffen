import { useState } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { useContext } from 'react';
import { LetrasContext} from 'src/App';
                
export function FormPersona({ idSociety, loggedUser }) {
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  var letras = useContext(LetrasContext);
  // const [letra, setLetra] = useState({id: 0, descripcion: '-'});
  const [letra, setLetra] = useState(null);

  const { mutate: addPersona } = useMutation(
    newPersona => postMethod(`persona/agregar/${idSociety.id}`, newPersona),
    {
      onMutate: async newPersona => {
        newPersona.letra = newPersona.letra.id;
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
          CUIT: '',
          mail: '',
          // letra: {id: 0, descripcion: '-'},
          telefono: '',
          domicilio: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {

          if(letra){
            // check cuit
            addPersona(values);
            resetForm();
            //setLetra({id: 0, descripcion: '-'});
            setLetra(null);
            setSubmitting(false);
          }
          
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
              <Field required size="small" style={{ width: '160px'}}  as={TextField} label="Nombre" type="string" maxLength={40} name="nombre" />
              <Field
                  as={Autocomplete}
                  size={'small'}
                  label='Tipo'
                  title="Tipo"
                  disablePortal
                  required
                  style={{ width: '100px', display: 'inline-flex' }}
                  onChange={(event, newValue) => {
                    setLetra(newValue);
                    setFieldValue('letra', newValue);
                  }}
                  value={letra}
                  getOptionLabel={option => option.descripcion}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  options={(letras? letras:[])}
                  renderInput={params => <TextField {...params} label='Tipo *' />}
              />

            
            
            <Field
              as={TextField}
              label='CUIT'
              type='string'
              required
              size="small"
              maxLength={11}
              style={{ width: '150px'}}
              name='CUIT'
              onChange={event => onlyNumbers(event, setFieldValue, 'CUIT')}
            />
            
            <Field required size="small" as={TextField} label="Email" type="string" maxLength={100} name="mail" />
            <Field  size="small" style={{ width: '150px'}} as={TextField} label="Teléfono" type="string" maxLength={11} name="telefono" />
              
            <Field size="small" as={TextField} label="Domicilio" type="string" maxLength={40} name="domicilio" />

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


function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,11}$/;
  if (regex.test(value.toString())) {
    setFieldValue(typeOfData, value.toString());
  }
}
