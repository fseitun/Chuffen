import React from 'react';
import { useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
// import esLocale from 'date-fns/locale/es';
import { Formik, Form, Field } from 'formik';
import { RadioGroup, Radio, Grid, FormControlLabel, TextField, Button, Hidden, Autocomplete } from '@mui/material';
import { usePrompt } from 'src/utils/usePrompt';
import { postMethod} from 'src/utils/api';
import { date_to_YYYYMMDD } from 'src/utils/utils'; 

export function FormCesion({idSociety, loggedUser, contratoId, fideicomisoId, personas, empresas, refetch}) {

  const { setIsPromptOpen, Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const { mutate: addItem } = useMutation(
    newItem => postMethod(`cesion/alta/${idSociety.id}`, newItem),
    {
      onMutate: async newItem => {

        await queryClient.invalidateQueries(['cesionItem', idSociety]);
        const prevData = await queryClient.getQueryData(['cesionItem', idSociety]);
        // const newData = [...prevData, { ...newItem, id: new Date().getTime() }];
        // queryClient.setQueryData(['cesionItem', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['cesionItem', idSociety], context),
      onSettled: () => {        
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['cesionItem', idSociety])
        } 
        refetch();
      }
      
      
      
    }
  );

  const [msg, setMsg] = useState("");
  const [iniPersona, setIniPersona] = useState(null);
  const [iniEmpresa, setIniEmpresa] = useState(null);

  const [tipoFidu, setTipoFidu] = useState('persona');
  
  function verFidu(e){
    
    setIniPersona(null);
    setIniEmpresa(null);
    setTipoFidu(e.target.value);
    
  }

  let f =new Date();
  const fecha = date_to_YYYYMMDD(f); 

  /*
  const locale = 'es';
  const localeMap = {es: esLocale};  
  const maskMap = {es: '__/__/____'};
  const [valuef, setValuef] = React.useState(null); */

  return (
    <>
      <Formik
        initialValues={{
          fideicomisoId: null,
          CACbase: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
            // console.log(tipoFidu, iniPersona?.id, iniEmpresa?.id, values?.persona?.id, values?.empresa?.id);
            if(iniPersona?.id === undefined && iniEmpresa?.id === undefined){
              setMsg("Debe seleccionar un fiduciante.");
              setIsPromptOpen(true);
            }else{
       
              addItem({ 
                contratoId: contratoId,
                fecha: fecha, 
                nombre: tipoFidu==="persona"? iniPersona?.nombre:iniEmpresa?.razonSocial,             
                personaId: tipoFidu==="persona"? iniPersona?.id:null, // values.anticipo.id, 
                empresaId: tipoFidu==="empresa"? iniEmpresa?.id:null, // fiduInForm?.id:null,
                fideicomisoId: fideicomisoId,
                // porcentaje: 100. esta en la api harckodeado en 100,
                creador: loggedUser?.id
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
                          
                  <Grid item md={3}> 
                    <Hidden  smUp={tipoFidu==='empresa'} > 
                      <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Fiduciante Persona'
                        title="Seleccione una Persona."
                        disablePortal                        
                        style={{ width: '260px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          setIniPersona(newValue);
                          setFieldValue('persona', newValue);
                        }}
                        value={tipoFidu==='persona'?iniPersona:null}
                        getOptionLabel={option => option.nombre}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={(personas? personas:[])}
                        renderInput={params => <TextField {...params} label='Fiduciante Persona' />}
                      />
                    </Hidden>  
                    <Hidden  smUp={tipoFidu==='persona'} > 
                      <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Fiduciante Empresa'
                        title="Seleccione una Empresa."
                        disablePortal                        
                        style={{ width: '260px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          setIniEmpresa(newValue);
                          setFieldValue('empresa', newValue);
                        }}
                        value={tipoFidu==='empresa'?iniEmpresa:null}
                        getOptionLabel={option => option.razonSocial}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={(empresas? empresas:[])}
                        renderInput={params => <TextField {...params} label='Fiduciante Empresa' />}
                      />
                    </Hidden>
                  </Grid>
                  <Grid item md={3}> 
                    <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          key="tipo_fiduciante"
                          defaultValue={"persona"}                                
                          onChange={event => verFidu(event)}
                          name="tipo_fiduciante"
                              >
                                <FormControlLabel value="persona" control={<Radio />} label="Persona" />
                                <FormControlLabel value="empresa" control={<Radio />} label="Empresa" />

                      </RadioGroup>
                  </Grid>
                  <Grid item md={2}> 
                      <Button type="submit" disabled={isSubmitting} >
                        Nueva Cesión
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
