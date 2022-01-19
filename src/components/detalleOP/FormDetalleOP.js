import { useState } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import { TextField, Typography, Grid, Autocomplete, Hidden, Switch} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { getMethod, postMethod } from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { isValidDate, yearMonthDayString } from 'src/utils/utils'; 


export function FormDetalleOP({ idSociety, OPId, loggedUser, estadoOP, confirmada}) {
  
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  var acceso = true;

  if(loggedUser?.['rol.op'] ==='vista'){
       acceso =false;
  }

  const{
      data: formOP,
      isLoading,
      error,
      refetch
    } = useQuery(['formOP', idSociety.id], () =>
     getMethod(`op/mostrar/${idSociety.id}/${OPId}`,{fetchPolicy: 'network-only'})
  ); 

  /*
  setTimeout(() => {
    setGan(formOP?.RET_GAN);
    console.log(7777, formOP?.RET_GAN);
  }, 700)*/

  const { mutate: updateOP } = useMutation(
      async newOP =>
        await postMethod(`op/modificar/${idSociety.id}`, newOP),
      {
        onSuccess: async () => await queryClient.refetchQueries(['formOP', idSociety])
      }
    );

  // por ahora se inicializa en el login
  var estados = JSON.parse(localStorage.getItem("estados"));
  const [isConfirmOP, setIsConfirmOP] = useState(parseInt(confirmada));
  const [typeInForm, setTypeInForm] = useState(estados[parseInt(estadoOP)]);



  var bancos = JSON.parse(localStorage.getItem("bancos"));
  var banco_en_blanco = {id:0, banco:"", descripcionLarga:"" };
  bancos.push(banco_en_blanco);

  /*

    <div>
      <button
        onClick={() => {refetch()}}
      >
        Refetch
      </button>
      <p></p>
    </div>

*/

  var cuentasbanco = JSON.parse(localStorage.getItem("cuentasbanco"));  
  var cuenta_en_blanco = {id: 0,  bancoId: 0,  cuentaBanco: "",  descripcionLarga: "",  bancos: [{banco: ""}]};
  cuentasbanco.push(cuenta_en_blanco);
  
  // por ahora se inicializa en el login
  var formaPagos = localStorage.getItem("formaPagos").split(",")
  
  var verBotonDesconfirmar = (loggedUser['rol.op'] ==='total' && (isConfirmOP===1))? false:true;
//console.log(999999, isValidDate("2021-12-13"));

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
          // resetForm();
          setSubmitting(false);
          // refetch();
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form  >
            
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
                        <TextField   sx={{ width: '68ch' }} label="Detalle"  defaultValue={formOP?.descripcion || ""} type="float"  name="descripcion" 
                        onChange={event => handleModification(event, setFieldValue, refetch, 'descripcion', idSociety.id, OPId, 0, 0)}
                        /* onFocus={event => formOP.descripcion? handleModification(event, setFieldValue, refetch, 'descripcion', idSociety.id, OPId, 0, 0):false } */
                        InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}

                        />                  
                  </Grid>                 
                  <Grid item md={2}>
                        <Typography align="right" color="textPrimary" variant="h5">
                        Aprobado por:
                        </Typography>
                  </Grid>
                  <Grid item md={4}>
                        <Typography align="left" color="textPrimary" variant="h5">                        
                        {formOP?.auth_obra?formOP.auth_obra[0]?.usuarios[0]?.user:''}
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

                  <Grid item md={2}   >
                  <Typography  align="right" color="textPrimary" variant="h5">
                  Estado:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Typography>
                  </Grid>     
                  <Grid item md={2}>                  
                    <Field
                      as={Autocomplete}
                      size={'small'}
                      label='Estado'
                      disabled={!acceso || (isConfirmOP===1)}
                      disablePortal
                      style={{ width: '160px', display: 'inline-flex' }}
                      onChange={(event, newValue) => {
                        setTypeInForm(newValue);
                        setFieldValue('estadoOP', newValue);                        
                        onlyNumbers(event, setFieldValue, refetch, 'estadoOP', idSociety.id, OPId, 0, newValue.id)
                      }}
                      value={typeInForm}
                      getOptionLabel={option => option.descripcion}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      options={estados}
                      renderInput={params => <TextField {...params} label='Estado' />}
                      
                    />
                  </Grid> 

                  <Grid item md={3}>  
                      <Hidden  smUp={(loggedUser['rol.op'] ==='total'  || (isConfirmOP!==1)?true:false)} >
                          <Typography align="center" color="green" variant="h5">                      
                            {(isConfirmOP===1)?"Confirmada!":""}
                          </Typography> 
                      </Hidden>

                      <Hidden  smUp={(!acceso || (typeInForm.id!==3)  || (isConfirmOP===1)?true:false)} >

                                                    
                           <Typography align="left" color="blue" variant="h5">                      
                           <Switch  onChange={event => confirmarOP(event, setIsConfirmOP,'confirmada', idSociety.id, OPId, 0, 1)}  /> Confirmar
                          </Typography> 
                      </Hidden>

                      <Hidden  smUp={(verBotonDesconfirmar)} >
                      
                          <Typography align="left" color="blue" variant="h5">                      
                              <Switch  defaultChecked onChange={event => confirmarOP(event, setIsConfirmOP,'confirmada', idSociety.id, OPId, 0, 0)}  /> Desconfirmar
                              </Typography> 
                          
                          </Hidden>

                  </Grid>
                  <Grid item md={5}>                           
                  </Grid>
             

                  <Grid item md={2}>
                  <Typography align="right" color="textPrimary" variant="h5">
                  Sumatoria Facturas:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Typography>
                  </Grid>     
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                        &nbsp;{formOP?.monto}
                        </Typography>
                  </Grid>
                  <Grid item md={4}>
                        <Typography align="right" color="textPrimary" variant="h5">
                        Forma de Pago:
                        </Typography>
                  </Grid>
                  <Grid item md={4}>
                        <Typography align="left" color="textPrimary" variant="h5">
                        {formOP?.formaPago}
                        </Typography>
                  </Grid>



                  <Grid item md={2}>
                        <Typography align="right" color="textPrimary" variant="h5">
                        Monto a Abonar:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  
                              </Typography>
                  </Grid>  
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                        &nbsp;{formOP?.monto_a_pagar}
                        </Typography>
                  </Grid>
                  <Grid item md={4}>
                        <Typography align="right" color="textPrimary" variant="h5">
                        Aprobado por:
                        </Typography>
                  </Grid>
                  <Grid item md={4}>
                        <Typography align="left" color="textPrimary" variant="h5">
                        {formOP?.auth_adm?formOP.auth_adm[0]?.usuarios[0]?.user:''}
                        </Typography>
                  </Grid>              



                  <Grid item md={12}>
                  &nbsp;
                  </Grid>

                                 
                  <Grid item md={2}>
                  <TextField  size={'small'} sx={{ width: '20ch' }} label="RET GAN" type="number" key={formOP?.RET_GAN} defaultValue={formOP?.RET_GAN}  name="RET_GAN" onChange={event => onlyNumbers(event, setFieldValue, refetch, 'RET_GAN', idSociety.id, OPId, 0, 0)} 
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
                  </Grid>
                  <Grid item md={2}>
                  <TextField  size={'small'} sx={{ width: '20ch' }} label="RET IVA" type="number" key={formOP?.RET_IVA} defaultValue={formOP?.RET_IVA}  name="RET_IVA" onChange={event => onlyNumbers(event, setFieldValue, refetch, 'RET_IVA', idSociety.id, OPId, 0, 0)} 
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
                  </Grid>  
                  <Grid item md={2}>
                  <TextField size={'small'} sx={{ width: '20ch' }} label="RET SUSS" type="number"  key={formOP?.RET_SUSS}  defaultValue={formOP?.RET_SUSS}  name="RET_SUSS"  onChange={event => onlyNumbers(event, setFieldValue, refetch, 'RET_SUSS', idSociety.id, OPId, 0)} 
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
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
                          Nro Cuenta
                        </Typography>                
                  </Grid>  
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          Comprobante
                        </Typography>              
                  </Grid>  
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h5">
                          Modo
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

                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Banco'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '160px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTbanco1(newValue);
                          setFieldValue('banco1', newValue);
                          onlyNumbers(event, setFieldValue, refetch, 'banco1', idSociety.id, OPId, 1, newValue.id)
                        }}
                        value={bancos.find(banco => banco.id === (formOP?.OPpago.banco1 || 0))}
                        getOptionLabel={option => option.banco}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={bancos}
                        renderInput={params => <TextField {...params} label='banco' />}
                        
                      />

                                  
                  </Grid>
                  <Grid item md={2}>
                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='NRO'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '165px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTnro1(newValue);
                          setFieldValue('nro1', newValue);
                          onlyNumbers(event, setFieldValue, refetch, 'nro1', idSociety.id, OPId, 1, newValue.id)
                        }}
                        value={cuentasbanco.find(cuenta => cuenta.id === (formOP?.OPpago.nro1 || 0))}
                        getOptionLabel={option => option.cuentaBanco}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={cuentasbanco.filter(cuenta => cuenta.bancoId === parseInt((formOP?.OPpago.banco1 || 0)))}
                        
                        renderInput={params => <TextField {...params} label='Cuenta' />}
                        
                      />               
                                
                  </Grid>  
                  <Grid item md={2}>
                        <TextField  size={'small'} sx={{ width: '20ch' }} label="Descripción" type="float"  key={formOP?.OPpago.descri1} defaultValue={formOP?.OPpago.descri1} name="descri1"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri1', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/>                  
                  </Grid>  
                  <Grid item md={2}>
                    <Field
                          as={Autocomplete}
                          size={'small'}
                          label='Modo'
                          disabled={!acceso || (isConfirmOP===1)}
                          disablePortal
                          style={{ width: '160px', display: 'inline-flex' }}
                          onChange={(event, newValue) => {
    
                            onlyNumbers(event, setFieldValue, refetch, 'modo1', idSociety.id, OPId, 1, newValue)
                          }}
                          value={formOP?.OPpago.modo1 || formaPagos[0]}
                          getOptionLabel={option => option}
                          isOptionEqualToValue={(option, value) => option === value}
                          options={formaPagos}
                          renderInput={params => <TextField {...params} label='Modo' />}
                          
                        />            
                  </Grid>  
                  <Grid item md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                          label="Fecha"
                          inputFormat="dd/MM/yyyy"
                          // moment.isDate(obj)
                          value={isValidDate(formOP?.OPpago.fecha1)? formOP?.OPpago.fecha1:null}
                          name="fecha1"
                          InputProps={{
                            readOnly: (!acceso || (isConfirmOP===1)?true:false),
                          }} 

                          onChange={event => handleModification(event, setFieldValue, refetch, 'fecha1', idSociety.id, OPId, 2, 0)}
                          // onChange={value => setFieldValue(name, value)}
                          renderInput={params => <TextField required size="small" {...params} />}
                        />
                      </LocalizationProvider>
                   
                                  
                  </Grid>  
                  <Grid item md={2}>
                        <TextField  name="monto1" size={'small'}sx={{ width: '20ch' }} label="Monto" type="float"  key={formOP?.OPpago.monto1}  defaultValue={formOP?.OPpago.monto1}  onChange={event => onlyNumbers(event, setFieldValue, refetch, 'monto1', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }} />                  
                  </Grid>

                  <Grid item md={2}>

                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Banco'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '160px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTbanco2(newValue);
                          setFieldValue('banco2', newValue);
                          onlyNumbers(event, setFieldValue, refetch, 'banco2', idSociety.id, OPId, 1, newValue.id)
                        }}
                        value={bancos.find(banco => banco.id === (formOP?.OPpago.banco2 || 0))}
                        getOptionLabel={option => option.banco}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={bancos}
                        renderInput={params => <TextField {...params} label='banco' />}
                        
                      />

                                  
                  </Grid>
                  <Grid item md={2}>
                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='NRO'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '165px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTnro2(newValue);
                          setFieldValue('nro2', newValue);
                          onlyNumbers(event, setFieldValue, refetch, 'nro2', idSociety.id, OPId, 1, newValue.id)
                        }}
                        value={cuentasbanco.find(cuenta => cuenta.id === (formOP?.OPpago.nro2 || 0))}
                        getOptionLabel={option => option.cuentaBanco}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={cuentasbanco.filter(cuenta => cuenta.bancoId === parseInt((formOP?.OPpago.banco2 || 0)))}
                        
                        renderInput={params => <TextField {...params} label='Cuenta' />}
                        
                      />               
                                
                  </Grid>  
                  <Grid item md={2}>
                        <TextField  size={'small'} sx={{ width: '20ch' }} label="Descripción" type="float"  key={formOP?.OPpago.descri2} defaultValue={formOP?.OPpago.descri2} name="descri2"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri2', idSociety.id, OPId, 1, 0)}
                            InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/>                  
                  </Grid>  
                  <Grid item md={2}>
                    <Field
                          as={Autocomplete}
                          size={'small'}
                          label='Modo'
                          disabled={!acceso || (isConfirmOP===1)}
                          disablePortal
                          style={{ width: '160px', display: 'inline-flex' }}
                          onChange={(event, newValue) => {

                            onlyNumbers(event, setFieldValue, refetch, 'modo2', idSociety.id, OPId, 1, newValue)
                          }}
                          value={formOP?.OPpago.modo2 || formaPagos[0]}
                          getOptionLabel={option => option}
                          isOptionEqualToValue={(option, value) => option === value}
                          options={formaPagos}
                          renderInput={params => <TextField {...params} label='Modo' />}
                          
                        />            
                  </Grid>  
                  <Grid item md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                          label="Fecha"
                          inputFormat="dd/MM/yyyy"
                          // moment.isDate(obj)
                          value={isValidDate(formOP?.OPpago.fecha2)? formOP?.OPpago.fecha2:null}
                          name="fecha2"
                          InputProps={{
                            readOnly: (!acceso || (isConfirmOP===1)?true:false),
                          }} 

                          onChange={event => handleModification(event, setFieldValue, refetch, 'fecha2', idSociety.id, OPId, 2, 0)}
                          // onChange={value => setFieldValue(name, value)}
                          renderInput={params => <TextField required size="small" {...params} />}
                        />
                      </LocalizationProvider>

                                  
                  </Grid>  
                  <Grid item md={2}>
                        <TextField  name="monto2" size={'small'}sx={{ width: '20ch' }} label="Monto" type="float"  key={formOP?.OPpago.monto2}  defaultValue={formOP?.OPpago.monto2}   onChange={event => onlyNumbers(event, setFieldValue, refetch, 'monto2', idSociety.id, OPId, 1, 0)}
                            InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }} />                  
                  </Grid>

                  <Grid item md={2}>

                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Banco'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '160px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTbanco3(newValue);
                          setFieldValue('banco3', newValue);
                          onlyNumbers(event, setFieldValue, refetch, 'banco3', idSociety.id, OPId, 1, newValue.id)
                        }}
                        value={bancos.find(banco => banco.id === (formOP?.OPpago.banco3 || 0))}
                        getOptionLabel={option => option.banco}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={bancos}
                        renderInput={params => <TextField {...params} label='banco' />}
                        
                      />

                                  
                  </Grid>
                  <Grid item md={2}>
                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='NRO'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '165px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTnro3(newValue);
                          setFieldValue('nro3', newValue);
                          onlyNumbers(event, setFieldValue, refetch, 'nro3', idSociety.id, OPId, 1, newValue.id)
                        }}
                        value={cuentasbanco.find(cuenta => cuenta.id === (formOP?.OPpago.nro3 || 0))}
                        getOptionLabel={option => option.cuentaBanco}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={cuentasbanco.filter(cuenta => cuenta.bancoId === parseInt((formOP?.OPpago.banco3 || 0)))}
                        
                        renderInput={params => <TextField {...params} label='Cuenta' />}
                        
                      />               
                                
                  </Grid>  
                  <Grid item md={2}>
                        <TextField  size={'small'} sx={{ width: '20ch' }} label="Descripción" type="float"  key={formOP?.OPpago.descri3} defaultValue={formOP?.OPpago.descri3} name="descri3"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri3', idSociety.id, OPId, 1, 0)}
                            InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/>                  
                  </Grid>  
                  <Grid item md={2}>
                    <Field
                          as={Autocomplete}
                          size={'small'}
                          label='Modo'
                          disabled={!acceso || (isConfirmOP===1)}
                          disablePortal
                          style={{ width: '160px', display: 'inline-flex' }}
                          onChange={(event, newValue) => {

                            onlyNumbers(event, setFieldValue, refetch, 'modo3', idSociety.id, OPId, 1, newValue)
                          }}
                          value={formOP?.OPpago.modo3 || formaPagos[0]}
                          getOptionLabel={option => option}
                          isOptionEqualToValue={(option, value) => option === value}
                          options={formaPagos}
                          renderInput={params => <TextField {...params} label='Modo' />}
                          
                        />            
                  </Grid>  
                  <Grid item md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                          label="Fecha"
                          inputFormat="dd/MM/yyyy"
                          // moment.isDate(obj)
                          value={isValidDate(formOP?.OPpago.fecha3)? formOP?.OPpago.fecha3:null}
                          name="fecha3"
                          InputProps={{
                            readOnly: (!acceso || (isConfirmOP===1)?true:false),
                          }} 

                          onChange={event => handleModification(event, setFieldValue, refetch, 'fecha3', idSociety.id, OPId, 2, 0)}
                          // onChange={value => setFieldValue(name, value)}
                          renderInput={params => <TextField required size="small" {...params} />}
                        />
                      </LocalizationProvider>

                                  
                  </Grid>  
                  <Grid item md={2}>
                        <TextField  name="monto3" size={'small'}sx={{ width: '20ch' }} label="Monto" type="float"  key={formOP?.OPpago.monto3}  defaultValue={formOP?.OPpago.monto3}   onChange={event => onlyNumbers(event, setFieldValue, refetch, 'monto3', idSociety.id, OPId, 1, 0)}
                            InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }} />                  
                  </Grid>

                  <Grid item md={2}>

                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Banco'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '160px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTbanco4(newValue);
                          setFieldValue('banco4', newValue);
                          onlyNumbers(event, setFieldValue, refetch, 'banco4', idSociety.id, OPId, 1, newValue.id)
                        }}
                        value={bancos.find(banco => banco.id === (formOP?.OPpago.banco4 || 0))}
                        getOptionLabel={option => option.banco}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={bancos}
                        renderInput={params => <TextField {...params} label='banco' />}
                        
                      />

                                  
                  </Grid>
                  <Grid item md={2}>
                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='NRO'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '165px', display: 'inline-flex' }}
                        onChange={(event, newValue) => {
                          // setTnro4(newValue);
                          setFieldValue('nro4', newValue);
                          onlyNumbers(event, setFieldValue, refetch, 'nro4', idSociety.id, OPId, 1, newValue.id)
                        }}
                        value={cuentasbanco.find(cuenta => cuenta.id === (formOP?.OPpago.nro4 || 0))}
                        getOptionLabel={option => option.cuentaBanco}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={cuentasbanco.filter(cuenta => cuenta.bancoId === parseInt((formOP?.OPpago.banco4 || 0)))}
                        
                        renderInput={params => <TextField {...params} label='Cuenta' />}
                        
                      />               
                                
                  </Grid>  
                  <Grid item md={2}>
                        <TextField  size={'small'} sx={{ width: '20ch' }} label="Descripción" type="float"  key={formOP?.OPpago.descri4}  defaultValue={formOP?.OPpago.descri4} name="descri4"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri4', idSociety.id, OPId, 1, 0)}
                            InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/>                  
                  </Grid>  
                  <Grid item md={2}>
                    <Field
                          as={Autocomplete}
                          size={'small'}
                          label='Modo'
                          disabled={!acceso || (isConfirmOP===1)}
                          disablePortal
                          style={{ width: '160px', display: 'inline-flex' }}
                          onChange={(event, newValue) => {

                            onlyNumbers(event, setFieldValue, refetch, 'modo4', idSociety.id, OPId, 1, newValue)
                          }}
                          value={formOP?.OPpago.modo4 || formaPagos[0]}
                          getOptionLabel={option => option}
                          isOptionEqualToValue={(option, value) => option === value}
                          options={formaPagos}
                          renderInput={params => <TextField {...params} label='Modo' />}
                          
                        />            
                  </Grid>  
                  <Grid item md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                          label="Fecha"
                          inputFormat="dd/MM/yyyy"
                          // moment.isDate(obj)
                          value={isValidDate(formOP?.OPpago.fecha4)? formOP?.OPpago.fecha4:null}
                          name="fecha4"
                          InputProps={{
                            readOnly: (!acceso || (isConfirmOP===1)?true:false),
                          }} 

                          onChange={event => handleModification(event, setFieldValue, refetch, 'fecha4', idSociety.id, OPId, 2, 0)}
                          // onChange={value => setFieldValue(name, value)}
                          renderInput={params => <TextField required size="small" {...params} />}
                        />
                      </LocalizationProvider>

                                  
                  </Grid>  
                  <Grid item md={2}>
                        <TextField  name="monto4" size={'small'}sx={{ width: '20ch' }} label="Monto" type="float"  key={formOP?.OPpago.monto4}  defaultValue={formOP?.OPpago.monto4}   onChange={event => onlyNumbers(event, setFieldValue, refetch, 'monto4', idSociety.id, OPId, 1, 0)}
                            InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }} />                  
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


function onlyNumbers(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, valorCombo) {
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,7}(\.\d{0,2})?$/;
  console.log(regex.test(value.toString()));
  if (regex.test(value.toString())) {

    setFieldValue(typeOfData, value.toString());
    handleModification(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, valorCombo);

  }else{
    return false;
  }
}

function handleModification(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flag, valorCombo) {

  
  let val = null;
 
  if(flag === 2){ // si es una fecha
    
    val = yearMonthDayString(event) + " 03:00:00";
  }else{  
    event.preventDefault();
    const { value } = event.target;
    setFieldValue(typeOfData, value.toString());

    val = value;
    if(typeOfData==='estadoOP'){
      val = valorCombo;
    }
    if(typeOfData==='banco1' || typeOfData==='banco2' || typeOfData==='banco3' || typeOfData==='banco4'){
      val = valorCombo;
    }
    if(typeOfData==='nro1' || typeOfData==='nro2' || typeOfData==='nro3' || typeOfData==='nro4'){
      val = valorCombo;
    }
    if(typeOfData==='modo1' || typeOfData==='modo2' || typeOfData==='modo3'  || typeOfData==='modo4'){
      val = valorCombo;
    }
  }

  let newData = {
        id: OPId,
        [typeOfData]: val,
      };
  if(flag > 0){
        newData.flagPago = 1;
  }    
    
  postMethod(`op/modificar/${idSociety}`, newData);
  setTimeout(() => {
    refetch();
    console.log("refetch");
  }, 500)


}

function confirmarOP(event, setIsConfirmOP, typeOfData, idSociety, OPId, flagPago, valor) {
  event.preventDefault();

  setIsConfirmOP(valor);
  let newData = {
        id: OPId,
        [typeOfData]: valor,
      };
  if(flagPago===1){
        newData.flagPago = 1;
  }    
    
  postMethod(`op/modificar/${idSociety}`, newData);


}

