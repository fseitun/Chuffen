import React from 'react';
import { TextField, Typography, Grid, Hidden } from '@mui/material';
import { useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form } from 'formik';
import { postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { SocietyContext } from 'src/App';


export function FormOC({ OCId, formOC, loggedUser, refetch  }) {

  var acceso = true;
  if(loggedUser?.['rol.oc'] ==='vista'){acceso =false}

  const idSociety = useContext(SocietyContext);
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();


  const { mutate: modifyData } = useMutation(
    async ({ field, id, value }) => await postMethod(`OC/modificar/${idSociety.id}`, {id,[field]: value,}),
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

  function save(event, field, id) {    

    const { value } = event.target;
    modifyData({ field, id, value });
  
  }

  return (
    <>
      <Formik>

        {({ isSubmitting }) => (
          <Form>
            <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} > 


              <Grid item md={8}>                  

                <TextField  size={'small'} sx={{ width: '85ch' }} label="Link a contrato / documentación"  
                  key={formOC.oc?.link} 
                  defaultValue={formOC.oc?.link}  
                  name="link" 
                                                    
                  onChange={event => save(event, 'link', OCId)} 
                    InputProps={{
                      readOnly: (!acceso),
                    }}
                />
              </Grid>
              <Grid item md={1}>
              
                  <Hidden  smUp={!(formOC.oc?.link)} >

                    <Typography align="left" variant="overline"  >
                          <a href={ formOC.oc?.link }  rel="noreferrer" target="_blank" >ver</a>
                    </Typography> 

                  </Hidden>
               
              </Grid>

              <Grid item md={12}>   
  
                <TextField  
                  size={'small'} 
          

                  label="Notas, aclaraciones, observaciones"                   
                  placeholder="Notas, aclaraciones, observaciones"

                  multiline
                  rows={20}
                  maxRows={30}

                  disabled={!acceso}
                  style={{ width: '815px', display: 'inline-flex' }}
                  key={formOC?.oc?.nota} 
                  defaultValue={formOC.oc?.nota}  
                  name="nota" 
                  //onChange={event => setField('nota')}               
                  onBlur={event => save(event, 'nota', OCId)}  
        
                />        
              </Grid> 
             

            </Grid>  
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