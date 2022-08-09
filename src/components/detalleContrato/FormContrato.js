import React from 'react'
import { useContext } from 'react';
import { TextField } from '@mui/material';
import { Formik, Form } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { SocietyContext } from 'src/App';
import { buscarCAC } from 'src/utils/utils';

export function FormContrato({CACs, acceso, contrato, isLoading, error}) {

  const idSociety = useContext(SocietyContext);
  const { Prompt } = usePrompt();


  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else

  return (
    <>
      <Formik

        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
              
              <TextField  
                size={'small'}
                sx={{ width: '20ch' }}
                label="Utilizar el CAC de su adhesión" 
                title="Preferentemente no tocar, si ud. fuerza otro valor, deja de ser dinámico"
                type="float"  
                defaultValue={contrato?.CACbase > 10.? contrato?.CACbase:buscarCAC(CACs, contrato?.adhesion, "Construción")}
                key={contrato?.CACbase}
                name="CACbase1"      
                onChange={event => onlyNumbers(event, 'CACbase', idSociety.id, contrato?.id)} 
                inputProps={{readOnly: (!acceso?true:false), min: 0, style: { textAlign: 'center' }}}
              />

           
          </Form>
        )}
      </Formik>
      <Prompt
        message="Ingrese un valor numérico"
        ok
      />
    </>
  );
}


function handleModification(event, typeOfData, idSociety, contratoId) {
  
  const { value } = event.target;

  let newData = {
        id: contratoId,
        [typeOfData]: value,
      };
  
  postMethod(`contrato/modificar/${idSociety}`, newData);

}


function onlyNumbers(event, typeOfData, idSociety, contratoId) {
    
    event.preventDefault();
    const { value } = event.target;
    const regex = /^\d{0,9}(\.\d{0,2})?$/;
    
    
    if(value!==undefined){
      if (regex.test(value.toString())) {

        handleModification(event, typeOfData, idSociety, contratoId);

      }else{
        return false;
      }    
    }else{
      return false;
    }

}