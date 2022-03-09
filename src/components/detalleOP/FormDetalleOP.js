import { useState } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import { Button, TextField, Typography, Grid, Autocomplete, Hidden, Switch} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod, getMethod} from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { isValidDate, yearMonthDayString } from 'src/utils/utils'; 
import { NavLink as RouterLink } from 'react-router-dom';
// import { useQuery, useQueryClient, useMutation } from 'react-query';


export function FormDetalleOP({ idSociety, OPId, loggedUser, estadoOP, confirmada, formOP, isLoading, error, refetch, empresaId, fideicomiso}) {
  
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

  // const { empresaId, fideicomiso } = useParams();


  var acceso = true;

  if(loggedUser?.['rol.op'] ==='vista'){
       acceso =false;
  }

  const { mutate: updateOP } = useMutation(
      async newOP =>
        await postMethod(`op/modificar/${idSociety.id}`, newOP),
      {
        onSuccess: async () => await queryClient.refetchQueries(['formOP', idSociety])
      }
    );

  // por ahora se inicializa en el login
  var estados = JSON.parse(localStorage.getItem("estados"));
  var retenciones = JSON.parse(localStorage.getItem("retenciones"));
  var fondos_s = JSON.parse(localStorage.getItem("fondos_s"));

  const [isConfirmOP, setIsConfirmOP] = useState(parseInt(confirmada));
  const [iniEstado, setIniEstado] = useState(estados[parseInt(estadoOP)]);
  const [iniRet, setIniRet] = useState(retenciones[parseInt(formOP?.estadoRET)]);
  const [iniFondos, setIniFondos] = useState(fondos_s[parseInt(formOP?.fondos)]);

  var bancos = JSON.parse(localStorage.getItem("bs"));
  var banco_en_blanco = {id:0, banco:"", descripcionLarga:"" };
  bancos.push(banco_en_blanco);

  var cuentasbanco = JSON.parse(localStorage.getItem("co"));  
  var cuenta_en_blanco = {id: 0,  bancoId: 0,  cuentaBanco: "",  descripcionLarga: "",  bancos: [{banco: ""}]};
  cuentasbanco.push(cuenta_en_blanco);
    
  // por ahora se inicializa en el login
  var formaPagos = localStorage.getItem("formaPagos").split(",")
  
  var verBotonDesconfirmar = (loggedUser['rol.op'] ==='total' && (isConfirmOP===1))? false:true;
  var verBotonOC = (loggedUser['rol.oc'] !=='no' )? false:true;
   

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
                        <TextField   sx={{ width: '64ch' }} label="Detalle"  defaultValue={formOP?.descripcion || ""} type="float"  name="descripcion" 
                        onChange={event => handleModification(event, setFieldValue, refetch, 'descripcion', idSociety.id, OPId, 0, 0)}
                        /* onFocus={event => formOP.descripcion? handleModification(event, setFieldValue, refetch, 'descripcion', idSociety.id, OPId, 0, 0):false } */
                        InputProps={{
                              maxLength: 90,
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
                  <Grid item md={2}>                        
                        <Typography  align="right" color="textPrimary" variant="h5">
                            Orden de Compra:&nbsp;&nbsp;&nbsp;
                        </Typography>
                  </Grid>
                  <Grid item md={4}>
                            
                    <ComboOC useQuery={useQuery} setFieldValue={setFieldValue} OCId={formOP?.OCId} OPId={OPId} idSociety={idSociety} empresaId={empresaId} fideicomisoId={formOP?.fideicomisoId} />
              
                  </Grid>
                  <Grid item md={4}>
                    <Hidden  smUp={(verBotonOC  || formOP?.OCId < 1)} >
                      <Typography align="center" color="textPrimary" variant="h4">
                        <Button
                            component={RouterLink}                            
                            /* sx={{color: 'primary.main',}}*/
                            to={`../../oc/${formOP?.OCId}/OC Detalle`}
                          >
                            ver compra&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Button>
                      </Typography>
                    </Hidden> 
                  </Grid>

                  <Grid item md={12}>
                  &nbsp;
                  </Grid>

                  <Grid item md={12}>                  
                    <Grid item md={4}>                  
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
                      Estado:&nbsp;&nbsp;&nbsp;
                    </Typography>
                  </Grid>     
                  <Grid item md={4}>                  
                    <Field
                      as={Autocomplete}
                      size={'small'}
                      label='Estado'
                      disabled={!acceso || (isConfirmOP===1)}
                      disablePortal
                      style={{ width: '325px', display: 'inline-flex' }}
                      
                      onChange={(event, newValue) => {
                        // setTypeInForm(newValue);
                       // newValue? setFieldValue('estadoOP', newValue):false;                        
                        onlyNumbers2(event, setFieldValue, setIniEstado, refetch, 'estadoOP', idSociety.id, OPId, 0, newValue)
                      }}
                      value={iniEstado}
                      getOptionLabel={option => option.descripcion}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      options={estados}
                      renderInput={params => <TextField {...params} label='Estado' />}
                      
                    />
                  </Grid>

                  <Grid item md={2}>  
                      <Hidden  smUp={(loggedUser['rol.op'] ==='total'  || (isConfirmOP!==1)?true:false)} >
                          <Typography align="right" color="green" variant="h5">                      
                            {(isConfirmOP===1)?"Confirmada!":""}
                          </Typography> 
                      </Hidden>

                      <Hidden  smUp={(!acceso || (iniEstado.id!==3)  || (isConfirmOP===1)?true:false)} >

                                                    
                           <Typography align="right" color="blue" variant="h5">                      
                            <Switch  onChange={event => confirmarOP(event, setIsConfirmOP,'confirmada', idSociety.id, OPId, 0, 1)}  /> Confirmar
                          </Typography> 
                      </Hidden>

                      <Hidden  smUp={(verBotonDesconfirmar)} >
                      
                          <Typography align="right" color="blue" variant="h5">                      
                            <Switch  defaultChecked onChange={event => confirmarOP(event, setIsConfirmOP,'confirmada', idSociety.id, OPId, 0, 0)}  /> Desconfirmar
                            </Typography> 
                          
                      </Hidden>

                  </Grid>
                  <Grid item md={4}>
                  &nbsp;
                  </Grid>               
                  
                  <Grid item md={12}>
                  &nbsp;
                  </Grid> 

                  <Grid item md={2}   >
                    <Typography  align="right" color="textPrimary" variant="h5">
                      Retención, Fondos:&nbsp;&nbsp;&nbsp;
                    </Typography>
                  </Grid>     
                  <Grid item md={2}>                  
                    <Field
                      as={Autocomplete}
                      size={'small'}
                      label='Estado Retención'
                      disabled={!acceso || (isConfirmOP===1)}
                      disablePortal
                      style={{ width: '160px', display: 'inline-flex' }}
                      
                      onChange={(event, newValue) => {
                        
                        onlyNumbers2(event, setFieldValue, setIniRet, refetch, 'estadoRET', idSociety.id, OPId, 0, newValue)
                      }}
                      value={iniRet}
                      getOptionLabel={option => option.descripcion}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      options={retenciones}
                      renderInput={params => <TextField {...params} label='Estado Retención' />}
                      
                    />
                  </Grid>
                  <Grid item md={2}>  
                    <Field
                        as={Autocomplete}
                        size={'small'}
                        label='Fondos'
                        disabled={!acceso || (isConfirmOP===1)}
                        disablePortal
                        style={{ width: '160px', display: 'inline-flex' }}
                        
                        onChange={(event, newValue) => {
                            
                          onlyNumbers2(event, setFieldValue, setIniFondos, refetch, 'fondos', idSociety.id, OPId, 0, newValue)
                        }}
                        value={iniFondos}
                        getOptionLabel={option => option.descripcion}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        options={fondos_s}
                        renderInput={params => <TextField {...params} label='Fondos' />}
                        
                      />

                  </Grid>
                  <Grid item md={2}>
                        <Typography align="right" color="textPrimary" variant="h5">
                        Forma de Pago:
                        </Typography>
                  </Grid>
                  <Grid item md={4}>
                        <Typography align="left" color="textPrimary" variant="h5">
                        {formOP?.formaPago}
                        </Typography>
                  </Grid>
                
                  <Grid item md={12}>
                  &nbsp;
                  </Grid>    

                  <Grid item md={2}>
                  <Typography align="right" color="textPrimary" variant="h5">
                  Sumatoria Facturas:&nbsp;&nbsp;&nbsp;
                        </Typography>
                  </Grid>
                  <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h4">
                        &nbsp;{Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(formOP?.monto))}
                        </Typography>
                  </Grid>
                  <Grid item md={2}>
                    &nbsp;
                  </Grid>
                  <Grid item md={2}>
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
                  </Grid>               
                  <Grid item md={2}>
                  <TextField  size={'small'} sx={{ width: '20ch' }} label="RET GAN" type="number" key={formOP?.RET_GAN} defaultValue={formOP?.RET_GAN}  name="RET_GAN" onChange={event => onlyNumbers(event, setFieldValue, refetch, 'RET_GAN', idSociety.id, OPId, 0, 0)} 
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
                  </Grid>
                  <Grid item md={2}>                                                                                                                                             
                  <TextField  size={'small'} sx={{ width: '20ch' }} label="Certificado GAN"  key={formOP?.COMP_GAN} defaultValue={formOP?.COMP_GAN}  name="COMP_GAN" onChange={event => handleModification(event, setFieldValue, refetch, 'COMP_GAN', idSociety.id, OPId, 0, 0)} 
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
                  </Grid>
                  <Grid item md={6}>
                  </Grid> 

                  <Grid item md={2}>
                  </Grid>               
                  <Grid item md={2}>
                  <TextField  size={'small'} sx={{ width: '20ch' }} label="RET IVA" type="number" key={formOP?.RET_IVA} defaultValue={formOP?.RET_IVA}  name="RET_IVA" onChange={event => onlyNumbers(event, setFieldValue, refetch, 'RET_IVA', idSociety.id, OPId, 0, 0)} 
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
                  </Grid>
                  <Grid item md={2}>                                                                                                                                             
                  <TextField  size={'small'} sx={{ width: '20ch' }} label="Certificado IVA"  key={formOP?.COMP_IVA} defaultValue={formOP?.COMP_IVA}  name="COMP_IVA" onChange={event => handleModification(event, setFieldValue, refetch, 'COMP_IVA', idSociety.id, OPId, 0, 0)} 
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
                  </Grid>
                  <Grid item md={6}>
                  </Grid>   

                  <Grid item md={2}>
                  </Grid>               
                  <Grid item md={2}>
                  <TextField size={'small'} sx={{ width: '20ch' }} label="RET SUSS" type="number"  key={formOP?.RET_SUSS}  defaultValue={formOP?.RET_SUSS}  name="RET_SUSS"  onChange={event => onlyNumbers(event, setFieldValue, refetch, 'RET_SUSS', idSociety.id, OPId, 0)} 
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
                  </Grid>
                  <Grid item md={2}>                                                                                                                                             
                  <TextField  size={'small'} sx={{ width: '20ch' }} label="Certificado SUSS"  key={formOP?.COMP_SUSS} defaultValue={formOP?.COMP_SUSS}  name="COMP_SUSS" onChange={event => handleModification(event, setFieldValue, refetch, 'COMP_SUSS', idSociety.id, OPId, 0, 0)} 
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
                  </Grid>
                  <Grid item md={6}>
                  </Grid> 


                  <Grid item md={2}>
                        <Typography align="right" color="textPrimary" variant="h5">
                        Monto a Abonar:&nbsp;&nbsp;&nbsp;  
                              </Typography>
                  </Grid>  
                  <Grid item md={2}>
                        <Typography align="left" color="green" variant="h4">
                        &nbsp;{Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(formOP?.monto_a_pagar)) + " " + formOP?.moneda}
                        </Typography>
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
                          Modo
                        </Typography>              
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
                        value={bancos.find(banco => banco.id === parseInt(formOP?.OPpago?.banco1 || 0))}
                        getOptionLabel={option => option.banco}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
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
                       
                        <TextField  size={'small'} sx={{ width: '11ch' }} label="Nro" type="float"  key={formOP?.OPpago.descri12} defaultValue={formOP?.OPpago.descri12} name="descri12"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri12', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/> 

                        <TextField  size={'small'} sx={{ width: '8ch' }} label="Link" type="float"  key={formOP?.OPpago.descri1 + "1"} defaultValue={formOP?.OPpago.descri1} name="descri1"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri1', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/>  

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
                             inputProps={{readOnly: (!acceso || (isConfirmOP===1)?true:false), min: 0, style: { textAlign: 'center' }}}
                             /*InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                  
                            }}*/ />                  
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
                        value={bancos.find(banco => banco.id === parseInt(formOP?.OPpago?.banco2 || 0))}
                        getOptionLabel={option => option.banco}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={bancos? bancos:[]}
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
                        value={cuentasbanco.find(cuenta => cuenta.id === parseInt(formOP?.OPpago.nro2 || 0))}
                        getOptionLabel={option => option.cuentaBanco}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={cuentasbanco.filter(cuenta => cuenta.bancoId === parseInt((formOP?.OPpago.banco2 || 0)))}
                        
                        renderInput={params => <TextField {...params} label='Cuenta' />}
                        
                      />               
                                
                  </Grid>  
                  <Grid item md={2}>

                        <TextField  size={'small'} sx={{ width: '11ch' }} label="Nro" type="float"  key={formOP?.OPpago.descri22} defaultValue={formOP?.OPpago.descri22} name="descri22"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri22', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/> 

                        <TextField  size={'small'} sx={{ width: '8ch' }} label="Link" type="float"  key={formOP?.OPpago.descri2 + "2"} defaultValue={formOP?.OPpago.descri2} name="descri2"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri2', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/>            


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
                            inputProps={{readOnly: (!acceso || (isConfirmOP===1)?true:false), min: 0, style: { textAlign: 'center' }}}
                            /*InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}*/ />                  
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
                        value={bancos.find(banco => banco.id === parseInt(formOP?.OPpago?.banco3 || 0))}
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
                        value={cuentasbanco.find(cuenta => cuenta.id === parseInt(formOP?.OPpago.nro3 || 0))}
                        getOptionLabel={option => option.cuentaBanco}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={cuentasbanco.filter(cuenta => cuenta.bancoId === parseInt((formOP?.OPpago.banco3 || 0)))}
                        
                        renderInput={params => <TextField {...params} label='Cuenta' />}
                        
                      />               
                                
                  </Grid>  
                  <Grid item md={2}>
                        <TextField  size={'small'} sx={{ width: '11ch' }} label="Nro" type="float"  key={formOP?.OPpago.descri32} defaultValue={formOP?.OPpago.descri32} name="descri32"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri32', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/> 

                        <TextField  size={'small'} sx={{ width: '8ch' }} label="Link" type="float"  key={formOP?.OPpago.descri3 + "3"} defaultValue={formOP?.OPpago.descri3} name="descri3"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri3', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/> 

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
                            inputProps={{readOnly: (!acceso || (isConfirmOP===1)?true:false), min: 0, style: { textAlign: 'center' }}}
                            /*InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}*/ />                  
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
                        value={bancos.find(banco => banco.id === parseInt(formOP?.OPpago?.banco4 || 0))}
                        getOptionLabel={option => option.banco}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
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
                        value={cuentasbanco.find(cuenta => cuenta.id === parseInt(formOP?.OPpago.nro4 || 0))}
                        getOptionLabel={option => option.cuentaBanco}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={cuentasbanco.filter(cuenta => cuenta.bancoId === parseInt((formOP?.OPpago.banco4 || 0)))}
                        
                        renderInput={params => <TextField {...params} label='Cuenta' />}
                        
                      />               
                                
                  </Grid>  
                  <Grid item md={2}>
                        <TextField  size={'small'} sx={{ width: '11ch' }} label="Nro" type="float"  key={formOP?.OPpago.descri42} defaultValue={formOP?.OPpago.descri42} name="descri42"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri42', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/> 

                        <TextField  size={'small'} sx={{ width: '8ch' }} label="Link" type="float"  key={formOP?.OPpago.descri4  + "4"} defaultValue={formOP?.OPpago.descri4} name="descri4"  onChange={event => handleModification(event, setFieldValue, refetch, 'descri4', idSociety.id, OPId, 1, 0)}
                             InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}/>                  
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
                            inputProps={{readOnly: (!acceso || (isConfirmOP===1)?true:false), min: 0, style: { textAlign: 'center' }}}
                            /*InputProps={{
                              readOnly: (!acceso || (isConfirmOP===1)?true:false),
                            }}*/ />                  
                  </Grid>

                  <Grid item md={10}>
                                  
                  </Grid>
                  <Grid item md={2}>
                        <Typography align="center" color="textPrimary" variant="h5">
                        
                        {Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number((Math.round(formOP?.OPpago.monto1 * 100)/100 + Math.round(formOP?.OPpago.monto2 * 100)/100 + Math.round(formOP?.OPpago.monto3 * 100)/100 + Math.round(formOP?.OPpago.monto4 * 100)/100)))}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Typography>                 
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


function onlyNumbers2(event, setFieldValue, setTypeInForm, refetch, typeOfData, idSociety, OPId, flagPago, newValue) {
  
  // console.log(event.target);
  const { value } = event.target;
  console.log(value, newValue?.id);
  if(value===0){
    console.log(11);
    event.preventDefault();
    // const { value } = event.target;
    const regex = /^\d{0,7}(\.\d{0,2})?$/;
    // console.log(regex.test(value.toString()));
    if (regex.test(value.toString())) {
      console.log(22, typeOfData);
      setTypeInForm(newValue);
      setFieldValue(typeOfData, value.toString());
      handleModification(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, newValue?.id);

    }else{
      return false;
    }
  }
}

function onlyNumbers(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, valorCombo) {

  
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,7}(\.\d{0,2})?$/;
  // console.log(regex.test(value.toString()));
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
    if(typeOfData==='OCId' || typeOfData==='estadoOP' || typeOfData==='estadoRET' || typeOfData==='fondos'){
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
    if(refetch){
      refetch();
      console.log("refetch");
    }
  }, 2000)

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

function ComboOC({idSociety, setFieldValue, empresaId,fideicomisoId, OPId, OCId, useQuery}) {

  var oc_en_blanco = {id: 0, fideicomisoId: 0, empresaId: 0, descripcion1: "-"};

  const{
      data: ordenes,
      isLoading,
      error,
      refetch
    } = useQuery(['ordenes', idSociety.id], () =>
        getMethod(`oc/listarCombo/${idSociety.id}/0/0`)
  );

  const [selectedOC, setSelectedOC] = useState(oc_en_blanco);
 
  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else

  var ordenesConBlanco = [
    ...ordenes.filter(el => el.fideicomisoId === parseInt(fideicomisoId) && el.empresaId === parseInt(empresaId)), oc_en_blanco
    ];

  if(ordenesConBlanco.length > 1 ){ 
    if((parseInt(OCId) > 0 && selectedOC?.id === 0) || (parseInt(OCId) === 0 && selectedOC?.id > 0)){  
      setSelectedOC(ordenesConBlanco.find(item => item.id===parseInt(OCId)));
    }
  }

  return (

    <Field
      as={Autocomplete}
      size={'small'}
      label='Orden de Compra'
      // disabled={!acceso || (isConfirmOP===1)}
      disablePortal
      style={{ width: '325px', display: 'inline-flex' }}
      
      onChange={(event, newValue) => {
        // setTypeInForm(newValue);
        // newValue? setFieldValue('estadoOP', newValue):false;                        
        onlyNumbers2(event, setFieldValue, setSelectedOC, refetch, 'OCId', idSociety.id, OPId, 0, newValue)
      }}
      value={selectedOC}
      getOptionLabel={option => option?.descripcion1}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      options={ordenesConBlanco}
      renderInput={params => <TextField {...params} label='Orden de Compra' />}
      
    />

  );  
  
}

