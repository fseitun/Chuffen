import React from 'react';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { Grid, TextField, Button, Autocomplete } from '@mui/material';
import { usePrompt } from 'src/utils/usePrompt';
import { postMethod, getMethod} from 'src/utils/api';
// import { date_to_YYYYMMDD } from 'src/utils/utils'; 

export function FormProducto({idSociety, loggedUser, contratoId, fideicomisoId, refetch}) {

  const [msg, setMsg] = useState("");
  const [producto, setProducto] = useState(null);
  const { setIsPromptOpen, Prompt } = usePrompt();
  const queryClient = useQueryClient();


  const {data: productos} = useQuery(['producto', idSociety], () => getMethod(`producto/listar/${idSociety.id}/${fideicomisoId}`));

  console.log(444444, productos); 

  const { mutate: addItem } = useMutation(
    newItem => postMethod(`producto/modificar/${idSociety.id}`, newItem),
    {
      onMutate: async newItem => {

        await queryClient.invalidateQueries(['producto', idSociety]);
        const prevData = await queryClient.getQueryData(['producto', idSociety]);
        // const newData = [...prevData, { ...newItem, id: new Date().getTime() }];
        // queryClient.setQueryData(['cesionItem', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['producto', idSociety], context),
      onSettled: () => {        
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['producto', idSociety])
        } 
        refetch();
      }
      
      
      
    }
  );


  return (
    <>
      <Formik
        initialValues={{
          fideicomisoId: null,
          CACbase: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
           
            if(producto?.id === undefined && !producto){
              setMsg("Debe seleccionar un producto.");
              setIsPromptOpen(true);
            }else{
       
              addItem({ 
                contratoId: contratoId,
                id: producto?.id
                // fideicomisoId: fideicomisoId,
                // creador: loggedUser?.id
              });
              setSubmitting(false);
            }
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>

            <Grid container spacing={{ xs: 0, md: 0 }} columns={{ xs: 4, sm: 8, md: 12 }} > 

                  <Grid item md={12}>
                      &nbsp;
                  </Grid>   
                          
               
               
                  <Grid item md={2}> 
                      <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Producto'
                        title="Producto"
                        disablePortal
                        required
                        style={{ width: '180px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          setProducto(newValue);
                          // setFieldValue('tipo', newValue);
                        }}
                        value={producto}
                        getOptionLabel={option => option.codigo}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={(productos? productos.filter(p => !p?.contratoId):[])}
                        renderInput={params => <TextField {...params} label='Producto' />}
                      />
                  </Grid>
                  <Grid item md={2}> 
                      <Button type="submit" disabled={isSubmitting} >
                        Agregar
                      </Button> 
                  </Grid>               
              
              <Grid item md={12}>
                  &nbsp;
              </Grid>      
              <Grid item md={12} sx={{ p: 2, borderTop: 2, borderColor: 'primary.main' }} >                      
              </Grid>  

            </Grid>

          </Form>
        )}
      </Formik>
      <Prompt
        message={msg}
        ok
      />
    </>
  );
}
