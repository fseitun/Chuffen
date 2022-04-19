import { useState } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import { Button, RadioGroup, Radio, FormControlLabel, TextField, Typography, Grid, Autocomplete, Hidden, Switch} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field } from 'formik';
import { postMethod, getMethod} from 'src/utils/api';
import { usePrompt } from 'src/utils/usePrompt';
import { isValidDate, yearMonthDayString } from 'src/utils/utils'; 
import { NavLink as RouterLink } from 'react-router-dom';
import { useContext } from 'react';
import { SocietyContext, EstadosContext, FormaPagosContext, RetencionesContext, FondosContext} from 'src/App';

export function FormRetenciones({ OPId, ba, cu, loggedUser, estadoOP, confirmada, formOP, isLoading, error, refetch, empresaId, fideicomiso}) {
  
  const idSociety = useContext(SocietyContext);

  
  const { Prompt } = usePrompt();
  const queryClient = useQueryClient();

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

  const [isConfirmOP, setIsConfirmOP] = useState(parseInt(confirmada));


  const [flagField, setFlagField] = useState("");


  var verBotonDesconfirmar = (loggedUser['rol.op'] ==='total' && (isConfirmOP===1))? false:true;

   


  
  

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
                        <TextField   sx={{ width: '64ch' }} label="Detalle"  key={formOP?.descripcion}  defaultValue={formOP?.descripcion} type="float"  name="descripcion" 
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

                  <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >  
                  
                    <Grid item md={2}>                        
                          <Typography  align="right" color="textPrimary" variant="h5">
                              Orden de Compra:&nbsp;&nbsp;&nbsp;
                          </Typography>
                    </Grid>
                    <Grid item md={4}>
                              
                      <ComboOC useQuery={useQuery} setFieldValue={setFieldValue} OCId={formOP?.OCId} OPId={OPId} idSociety={idSociety} empresaId={empresaId} fideicomisoId={formOP?.fideicomisoId} />
                
                    </Grid>
                    <Grid item md={6}>
                      
                    </Grid>

                

                    
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

           

                  <Grid item md={2}>  
                      <Hidden  smUp={(loggedUser['rol.op'] ==='total'  || (isConfirmOP!==1)?true:false)} >
                          <Typography align="right" color="green" variant="h5">                      
                            {(isConfirmOP===1)?"Confirmada!":""}
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

                  <TextField  size={'small'} sx={{ width: '20ch' }} label="RET GAN" type="number" key={formOP?.RET_GAN} defaultValue={formOP?.RET_GAN}  name="RET_GAN" onChange={event => setFlagField('RET_GAN')} onBlur={event => onlyNumbers3(event, setFieldValue, refetch, 'RET_GAN', idSociety.id, OPId, 0, 0,null, flagField)}  
                       InputProps={{
                        readOnly: (!acceso || (isConfirmOP===1)?true:false),
                      }}
                  />
                  </Grid>
                  <Grid item md={2}>                                                                                                                                             
                  <TextField  size={'small'} sx={{ width: '20ch' }} label="Certificado GAN"  key={formOP?.COMP_GAN} defaultValue={formOP?.COMP_GAN}  name="COMP_GAN" onChange={event => handleModification(event, setFieldValue, refetch, 'COMP_GAN', idSociety.id, OPId, 0, 0, null)} 
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
                  <TextField  size={'small'} sx={{ width: '20ch' }} label="RET IVA" type="number" key={formOP?.RET_IVA} defaultValue={formOP?.RET_IVA}  name="RET_IVA" onChange={event => setFlagField('RET_IVA')}  onBlur={event => onlyNumbers3(event, setFieldValue, refetch, 'RET_IVA', idSociety.id, OPId, 0, 0, null, flagField)} 
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
                  <TextField size={'small'} sx={{ width: '20ch' }} label="RET SUSS" type="number"  key={formOP?.RET_SUSS}  defaultValue={formOP?.RET_SUSS}  name="RET_SUSS"  onChange={event => setFlagField('RET_SUSS')}  onBlur={event => onlyNumbers3(event, setFieldValue, refetch, 'RET_SUSS', idSociety.id, OPId, 0, 0, null, flagField)} 
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
                        <Typography  align="right" color="textPrimary" variant="h5">
                        Monto a Abonar:&nbsp;&nbsp;&nbsp;  
                              </Typography>
                  </Grid>  
                  <Grid item md={2}>
                        <Typography  style={{textDecorationLine: 'underline'}} align="left" color="green" variant="h4">
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
      handleModification(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, newValue?.id, null);

    }else{
      return false;
    }
  }
}


function onlyNumbers3(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, valorCombo, formOP, flagField) {

  if(typeOfData===flagField){
    
    event.preventDefault();
    const { value } = event.target;
    const regex = /^\d{0,9}(\.\d{0,2})?$/;
    // console.log(regex.test(value.toString()));
    
    if(value!==undefined){
      if (regex.test(value.toString())) {

        setFieldValue(typeOfData, value.toString());
        handleModification(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, valorCombo, formOP);

      }else{
        return false;
      }    
    }else{
      return false;
    }
  }else{
    return false;
  }
}

function onlyNumbers4(event, setFieldValue, setMonedaOC, refetch, typeOfData, idSociety, OPId, flagPago, valorCombo, formOP){

    const { value } = event.target;
    setMonedaOC(value);
    handleModification(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, valorCombo, formOP);

}

function onlyNumbers(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, valorCombo, formOP) {

  
  event.preventDefault();
  const { value } = event.target;
  const regex = /^\d{0,9}(\.\d{0,2})?$/;
  
  if(value!==undefined){
    if (regex.test(value.toString())) {

      setFieldValue(typeOfData, value.toString());
      handleModification(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flagPago, valorCombo, formOP);

    }else{
      return false;
    }    
  }else{
    return false;
  }
}

function handleModification(event, setFieldValue, refetch, typeOfData, idSociety, OPId, flag, valorCombo, formOP) {
  
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
    if(typeOfData.toString().substring(0,5)==='banco'){
      val = valorCombo;
    }
    if(typeOfData.toString().substring(0,3)==='nro'){
      val = valorCombo;
    }
    if(typeOfData.toString().substring(0,4)==='modo'){
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
  
  if(valorCombo==="Retenciones"){
    let r = parseFloat(formOP?.RET_GAN) + parseFloat(formOP?.RET_IVA) + parseFloat(formOP?.RET_SUSS);
    if(typeOfData==='modo1'){newData.monto1 = r;}
    if(typeOfData==='modo2'){newData.monto2 = r;}
    if(typeOfData==='modo3'){newData.monto3 = r;}
    if(typeOfData==='modo4'){newData.monto4 = r;}
    if(typeOfData==='modo5'){newData.monto5 = r;}
    if(typeOfData==='modo6'){newData.monto6 = r;}
    if(typeOfData==='modo7'){newData.monto7 = r;}
    
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
      disablePortal
      style={{ width: '325px', display: 'inline-flex' }}
      
      onChange={(event, newValue) => {                      
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
