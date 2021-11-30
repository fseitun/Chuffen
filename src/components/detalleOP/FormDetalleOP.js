import { TextField, Typography, Grid} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
// import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { getMethod, postMethod } from 'src/utils/api';
// import { yearMonthDayString } from 'src/utils/utils';
import { usePrompt } from 'src/utils/usePrompt';

export function FormDetalleOP({ idSociety, OPId}) {
  
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const {
      data: miOP,
      isLoading,
      error,
    } = useQuery(['opForm', idSociety.id], () =>
     getMethod(`op/mostrar/${idSociety.id}/${OPId}`)
  );  

  const { mutate: updateOP } = useMutation(
      async newOP =>
        await postMethod(`op/modificar/${idSociety.id}`, newOP),
      {
        onSuccess: async () =>
          await queryClient.refetchQueries(['opForm', idSociety]),
      }
    );

  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
    return (
    <>

      <Formik
        initialValues={{
          id: OPId,
          flagPago: 1,// es para avisarle a la api que se modifica OPpagos
          
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          updateOP(values);
          resetForm();
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>

                <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >                  

                  <Grid item md={12}>                  
                    <Grid item md={12}>                  
                      <Typography align="left" color="textPrimary" variant="h4">
                      Aprobación Técnica 
                      </Typography>
                    </Grid>                 
                  </Grid>

                  <Grid item md={12}>
                  &nbsp;
                  </Grid>

                  <Grid item md={6}>
                        <Field as={TextField} sx={{ width: '61ch' }} label="Detalle"  defaultValue={miOP?.descripcion} type="float"  name="descripcion" 
                        onChange={event => handleModification(event, setFieldValue, 'descripcion', idSociety.id, OPId, 0)} />
                  
                  </Grid>                 
                  <Grid item md={2}>
                        <Typography align="right" color="textPrimary" variant="h5">
                        Aprobado por:
                        </Typography>
                  </Grid>
                  <Grid item md={4}>
                        <Typography align="left" color="textPrimary" variant="h5">                        
                        {miOP?.auth_obra?miOP.auth_obra[0].usuarios[0].user:''}
                        </Typography>
                  </Grid>

                  <Grid item md={12}>
                  &nbsp;
                  </Grid>

                  <Grid item md={12}>                  
                    <Grid item md={12}>                  
                      <Typography align="left" color="textPrimary" variant="h4">
                      Aprobación Administrativa
                      </Typography>
                    </Grid>                 
                  </Grid>

                  <Grid item md={12}>
                  &nbsp;
                  </Grid>

                  <Grid item md={2}>
                  <Typography align="left" color="textPrimary" variant="h5">
                  Sumatoria Facturas:
                        </Typography>
                  </Grid>     
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                        &nbsp;{miOP?.monto}
                        </Typography>
                  </Grid>
                  <Grid item md={4}>
                        <Typography align="right" color="textPrimary" variant="h5">
                        Aprobado por:
                        </Typography>
                  </Grid>
                  <Grid item md={4}>
                        <Typography align="left" color="textPrimary" variant="h5">
                        {miOP?.auth_adm?miOP.auth_adm[0].usuarios[0].user:''}
                        </Typography>
                  </Grid>

                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                        Monto a Abonar: 
                              </Typography>
                  </Grid> 
                  <Grid item md={10}>
                        <Typography align="left" color="textPrimary" variant="h5">
                        &nbsp;{miOP?.monto_a_pagar}
                        </Typography>
                  </Grid> 

                  <Grid item md={12}>
                  &nbsp;
                  </Grid>

                  <Grid item md={2}>
                  <Field as={TextField} sx={{ width: '20ch' }} label="RET IIBB" type="float" defaultValue={miOP?.RET_IVA}  name="RET_IVA" onChange={event => onlyNumbers(event, setFieldValue, 'RET_IVA', idSociety.id, OPId, 0)} />
                  </Grid>                 
                  <Grid item md={2}>
                  <Field as={TextField} sx={{ width: '20ch' }} label="RET GAN" type="float"  defaultValue={miOP?.RET_GAN}  name="RET_GAN" onChange={event => onlyNumbers(event, setFieldValue, 'RET_GAN', idSociety.id, OPId, 0)} />
                  </Grid>
                  <Grid item md={2}>
                  <Field as={TextField} sx={{ width: '20ch' }} label="RET SUSS" type="float"  defaultValue={miOP?.RET_SUSS}  name="RET_SUSS"  onChange={event => onlyNumbers(event, setFieldValue, 'RET_SUSS', idSociety.id, OPId, 0)} />
                  </Grid>
                  <Grid item md={6}>
                  &nbsp;
                  </Grid>

                  <Grid item md={12}>
                  &nbsp;
                  </Grid>

                  <Grid item md={12}>                  
                    <Grid item md={12}>                  
                      <Typography align="left" color="textPrimary" variant="h4">
                      Pago
                      </Typography>
                    </Grid>                 
                  </Grid>

                  <Grid item md={12}>
                  &nbsp;
                  </Grid>

                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          Banco
                        </Typography>
                  </Grid>
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          NRO Cuenta
                        </Typography>                
                  </Grid>  
                  <Grid item md={4}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          Descripción
                        </Typography>              
                  </Grid>  
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          Fecha
                        </Typography>                      
                  </Grid>  
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          Monto
                        </Typography>                
                  </Grid>  


                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Banco" type="float"  defaultValue={miOP?.OPpago.banco1} name="banco1" onChange={event => handleModification(event, setFieldValue, 'banco1', idSociety.id, OPId, 1)} />                  
                  </Grid>
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="NRO" type="float"  defaultValue={miOP?.OPpago.nro1} name="nro1" onChange={event => handleModification(event, setFieldValue, 'nro1', idSociety.id, OPId, 1)} />                  
                  </Grid>  
                  <Grid item md={4}>
                        <Field as={TextField} sx={{ width: '40ch' }} label="Descripción" type="float"  defaultValue={miOP?.OPpago.descri1} name="descri1"  onChange={event => handleModification(event, setFieldValue, 'descri1', idSociety.id, OPId, 1)} />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Fecha" type="float"  defaultValue={miOP?.OPpago.fecha1} name="fecha1"  onChange={event => handleModification(event, setFieldValue, 'fecha1', idSociety.id, OPId, 1)} />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Monto" type="float"  defaultValue={miOP?.OPpago.monto1} name="monto1" onChange={event => onlyNumbers(event, setFieldValue, 'monto1', idSociety.id, OPId, 1)} />                  
                  </Grid>

                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Banco" type="float"  defaultValue={miOP?.OPpago.banco2} name="banco2" onChange={event => handleModification(event, setFieldValue, 'banco2', idSociety.id, OPId, 1)} />                  
                  </Grid>
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="NRO" type="float"  defaultValue={miOP?.OPpago.nro2} name="nro2"  onChange={event => handleModification(event, setFieldValue, 'nro2', idSociety.id, OPId, 1)} />                  
                  </Grid>  
                  <Grid item md={4}>
                        <Field as={TextField} sx={{ width: '40ch' }} label="Descripción" type="float"  defaultValue={miOP?.OPpago.descri2} name="descri2"  onChange={event => handleModification(event, setFieldValue, 'descri2', idSociety.id, OPId, 1)} />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Fecha" type="float"  defaultValue={miOP?.OPpago.fecha2} name="fecha2"  onChange={event => handleModification(event, setFieldValue, 'fecha2', idSociety.id, OPId, 1)}  />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Monto" type="float"  defaultValue={miOP?.OPpago.monto2} name="monto2" onChange={event => onlyNumbers(event, setFieldValue, 'monto2', idSociety.id, OPId, 1)} />                  
                  </Grid>     

                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Banco" type="float"  defaultValue={miOP?.OPpago.banco3} name="banco3"  onChange={event => handleModification(event, setFieldValue, 'banco3', idSociety.id, OPId, 1)} />                  
                  </Grid>
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="NRO" type="float"  defaultValue={miOP?.OPpago.nro3} name="nro3"  onChange={event => handleModification(event, setFieldValue, 'nro3', idSociety.id, OPId, 1)} />                  
                  </Grid>  
                  <Grid item md={4}>
                        <Field as={TextField} sx={{ width: '40ch' }} label="Descripción" type="float"  defaultValue={miOP?.OPpago.descri3} name="descri3"   onChange={event => handleModification(event, setFieldValue, 'descri3', idSociety.id, OPId, 1)} />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Fecha" type="float"  defaultValue={miOP?.OPpago.fecha3} name="fecha3"  onChange={event => handleModification(event, setFieldValue, 'fecha3', idSociety.id, OPId, 1)} />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Monto" type="float"  defaultValue={miOP?.OPpago.monto3} name="monto3" onChange={event => onlyNumbers(event, setFieldValue, 'monto3', idSociety.id, OPId, 1)} />                  
                  </Grid>                
                
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Banco" type="float"  defaultValue={miOP?.OPpago.banco4} name="banco4"  onChange={event => handleModification(event, setFieldValue, 'banco4', idSociety.id, OPId, 1)} />                  
                  </Grid>
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="NRO" type="float"  defaultValue={miOP?.OPpago.nro4} name="nro4"  onChange={event => handleModification(event, setFieldValue, 'nro4', idSociety.id, OPId, 1)} />                  
                  </Grid>  
                  <Grid item md={4}>
                        <Field as={TextField} sx={{ width: '40ch' }} label="Descripción" type="float"  defaultValue={miOP?.OPpago.descri4} name="descri4"  onChange={event => handleModification(event, setFieldValue, 'descri4', idSociety.id, OPId, 1)}  />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Fecha" type="float"  defaultValue={miOP?.OPpago.fecha4} name="fecha4" onChange={event => handleModification(event, setFieldValue, 'fecha4', idSociety.id, OPId, 1)} />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Monto" type="float"  defaultValue={miOP?.OPpago.monto4} name="monto4" onChange={event => onlyNumbers(event, setFieldValue, 'monto4', idSociety.id, OPId, 1)} />  

                  </Grid>  
              
                </Grid>
            
          </Form>
        )}
      </Formik>
      <Prompt
        message="Ya existe un tipo de cambio en esa fecha, por favor editar u eliminar el registro"
        ok
      />
    </>
  );
}



function handleModification(event, setFieldValue, typeOfData, idSociety, OPId, flagPago) {
      event.preventDefault();
      const { value } = event.target;
      setFieldValue(typeOfData, value.toString());
      let newData = {
            id: OPId,
            [typeOfData]: value,
          };
      if(flagPago===1){
            newData.flagPago = 1;
      }    
      console.log(newData);    
      postMethod(`op/modificar/${idSociety}`, newData);
}

function onlyNumbers(event, setFieldValue, typeOfData, idSociety, OPId, flagPago) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,7}(\.\d{0,2})?$/;
  if (regex.test(value.toString())) {
    setFieldValue(typeOfData, value.toString());
    handleModification(event, setFieldValue, typeOfData, idSociety, OPId, flagPago);

  }
}



/*
function onlyNumbers2(event, setFieldValue, typeOfData) {
      event.preventDefault();
      const { value } = event.target;

  
      //if (regex.test(value.toString())) {
      //  setFieldValue(typeOfData, value.toString());
      //}
    }*/

/*
function Picker({ field, form }) {
  const { name, value } = field;
  const { setFieldValue } = form;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label="Fecha"
        inputFormat="dd/MM/yyyy"
        value={value}
        onChange={value => setFieldValue(name, value)}
        renderInput={params => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}*/
