import { useState } from 'react';
import { TextField } from '@mui/material';
import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { SocietyContext } from 'src/App';
                
export function FormDetalleOC({ OCId, formOC, loggedUser, moneda, refetch  }) {

  const idSociety = useContext(SocietyContext);
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const [field, setField] = useState("");


  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) => await postMethod(`OC/modificar/1`, {id,[field]: value,}),
    {
      onMutate: async ({ field, id, value }) => {
        await queryClient.cancelQueries(['OC', idSociety]);
        const prevData = await queryClient.getQueryData(['OC', idSociety]);
        if(prevData){
          
          const newData = [
            ...prevData.filter(_OC => _OC.id !== id),
            { ...prevData.find(_OC => _OC.id === id), [field]: value },
          ];
          queryClient.setQueryData(['OC', idSociety], newData);
          
          return prevData;
        }
      },
      onError: (err, id, context) => queryClient.setQueryData(['OC', idSociety], context),
      onSettled: () => {if(idSociety.id > 0) {
                        queryClient.invalidateQueries(['OCdetalle', idSociety])
                      }
                      refetch()} 
    }
  );

  function onlyNumbers(event, field, setField, OCId) {
   
    event.preventDefault();
    const { value } = event.target;   
  
    // const regex = /^\d{0,11}$/; // es numero sin decimales
    const regex = /^\d{0,5}(\.\d{0,2})?$/;// es numero
    var key = event.which || event.keyCode; // keyCode detection
    var ctrl = event.ctrlKey ? event.ctrlKey : ((key === 17) ? true : false); // ctrl detection
    if(event?.target?.name === field){ // Si el campo a grabar cambio
      if (regex.test(value.toString()) || ctrl ) {
        let id = OCId;
        modifyData({ field, id, value });
      }
      setField("");
    }
  }

  return (
    <>
      <Formik>

        {({ isSubmitting }) => (
          <Form>

            <TextField  
              size={'small'} 
              sx={{ width: '20ch' }} 
              label="CAC Base" 
              type="number" 
              key={formOC?.oc?.CACbase} 
              defaultValue={formOC.oc?.CACbase}  
              name="CACbase" 
              onChange={event => setField('CACbase')} 
              
              onBlur={event => onlyNumbers(event, field, setField, OCId)}  
              /* InputProps={{
                     readOnly: (!acceso || (isConfirmOP===1)?true:false),
                     }} */
            />           
            
          </Form>
        )}
      </Formik>
      <Prompt
        message="Tarea y monto no puede estar en blanco"
        ok
      />
    </>
  );
}