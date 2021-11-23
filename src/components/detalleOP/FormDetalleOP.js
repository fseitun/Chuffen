import { TextField } from '@mui/material';
import { Typography, Grid } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
// import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { postMethod } from 'src/utils/api';
import { yearMonthDayString, isDateUsed } from 'src/utils/utils';
import { usePrompt } from 'src/utils/usePrompt';

export function FormDetalleOP({ idSociety }) {

 //     const { data } = useQuery(['fideicomiso', idSociety.id], () =>
 //     getMethod(`fideicomiso/listar/${idSociety.id}`)
 //   );
      
  const { setIsPromptOpen, Prompt } = usePrompt();
  const queryClient = useQueryClient();

  const { mutate: addOP } = useMutation(
    newOP => postMethod(`op/agregar/${idSociety.id}`, newOP),
    {
      onMutate: async newOP => {
        await queryClient.invalidateQueries(['op', idSociety]);
        const prevData = await queryClient.getQueryData(['op', idSociety]);
        const newData = [...prevData, { ...newOP, id: new Date().getTime() }];
        queryClient.setQueryData(['op', idSociety], newData);
        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['op', idSociety], context),
      onSettled: () => queryClient.invalidateQueries(['op', idSociety]),
    }
  );

  return (
    <>

      <Formik
        initialValues={{
          fecha: new Date(),
          mep: '',
          BCRA: '',
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          values.fecha = yearMonthDayString(values.fecha);
          if (await isDateUsed('op', idSociety.id, values.fecha)) {
            setIsPromptOpen(true);
          } else addOP(values);
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

                  <Grid item md={4}>
                        <Field as={TextField} sx={{ width: '41ch' }} label="Detalle" type="float"  name="detalle" />
                  
                  </Grid>                 
                  <Grid item md={4}>
                        <Typography align="right" color="textPrimary" variant="h5">
                        Aprobado:
                        </Typography>
                  </Grid>
                  <Grid item md={4}>
                        <Typography align="left" color="textPrimary" variant="h5">
                        Joaquin
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

                  <Grid item md={4}>
                  <Typography align="left" color="textPrimary" variant="h5">
                  Sumatoria Facturas: 321321
                        </Typography>
                  </Grid>                 
                  <Grid item md={4}>
                        <Typography align="right" color="textPrimary" variant="h5">
                        Aprobado:
                        </Typography>
                  </Grid>
                  <Grid item md={4}>
                        <Typography align="left" color="textPrimary" variant="h5">
                        Tomas
                        </Typography>
                  </Grid>

                  <Grid item md={12}>
                  <Typography align="left" color="textPrimary" variant="h5">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Monto a Abonar: 321321
                        </Typography>
                  </Grid> 

                  <Grid item md={2}>
                  <Field as={TextField} sx={{ width: '20ch' }} label="RET IIBB" type="float"  name="iibb" />
                  </Grid>                 
                  <Grid item md={2}>
                  <Field as={TextField} sx={{ width: '20ch' }} label="RET GAN" type="float"  name="gan" />
                  </Grid>
                  <Grid item md={2}>
                  <Field as={TextField} sx={{ width: '20ch' }} label="RET SUSS" type="float"  name="suss" />
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
                        <Typography align="center" color="textPrimary" variant="h5">
                          Banco
                        </Typography>
                  </Grid>
                  <Grid item md={2}>
                        <Typography align="center" color="textPrimary" variant="h5">
                          NRO Cuenta
                        </Typography>                
                  </Grid>  
                  <Grid item md={4}>
                        <Typography align="center" color="textPrimary" variant="h5">
                          Descripción
                        </Typography>              
                  </Grid>  
                  <Grid item md={2}>
                        <Typography align="center" color="textPrimary" variant="h5">
                          Fecha
                        </Typography>                      
                  </Grid>  
                  <Grid item md={2}>
                        <Typography align="center" color="textPrimary" variant="h5">
                          Monto
                        </Typography>                
                  </Grid>  


                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Banco" type="float"  name="banco1" />                  
                  </Grid>
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="NRO" type="float"  name="nro1" />                  
                  </Grid>  
                  <Grid item md={4}>
                        <Field as={TextField} sx={{ width: '40ch' }} label="Descripción" type="float"  name="descro1" />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Fecha" type="float"  name="fecha1" />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Monto" type="float"  name="monto1" />                  
                  </Grid>

                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Banco" type="float"  name="banco2" />                  
                  </Grid>
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="NRO" type="float"  name="nro2" />                  
                  </Grid>  
                  <Grid item md={4}>
                        <Field as={TextField} sx={{ width: '40ch' }} label="Descripción" type="float"  name="descro2" />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Fecha" type="float"  name="fecha2" />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Monto" type="float"  name="monto2" />                  
                  </Grid>     

                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Banco" type="float"  name="banco3" />                  
                  </Grid>
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="NRO" type="float"  name="nro3" />                  
                  </Grid>  
                  <Grid item md={4}>
                        <Field as={TextField} sx={{ width: '40ch' }} label="Descripción" type="float"  name="descro3" />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Fecha" type="float"  name="fecha3" />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Monto" type="float"  name="monto3" />                  
                  </Grid>                
                
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Banco" type="float"  name="banco4" />                  
                  </Grid>
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="NRO" type="float"  name="nro4" />                  
                  </Grid>  
                  <Grid item md={4}>
                        <Field as={TextField} sx={{ width: '40ch' }} label="Descripción" type="float"  name="descro4" />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Fecha" type="float"  name="fecha4" />                  
                  </Grid>  
                  <Grid item md={2}>
                        <Field as={TextField} sx={{ width: '20ch' }} label="Monto" type="float"  name="monto4" />                  
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
/*
function onlyNumbers(event, setFieldValue, typeOfData) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,3}(\.\d{0,2})?$/;
  if (regex.test(value.toString())) {
    setFieldValue(typeOfData, value.toString());
  }
}

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
