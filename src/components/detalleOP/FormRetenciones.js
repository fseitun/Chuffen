import React, { useState } from 'react'
import { Container, Box, Typography, Grid, Button, IconButton, Collapse, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Helmet } from 'react-helmet';
import { useQueryClient, useMutation } from 'react-query';
import { useContext } from 'react';
import { mostrarFechaMesTXT } from 'src/utils/utils';
import { postMethod } from 'src/utils/api';
import { CondicionIVAContext } from 'src/App';


export function FormRetenciones({ idSociety, OPId, acumulado, fecha, fideicomiso, formOP, categorias, isLoading, error, refetch, loggedUser }) {

  const condIVA = useContext(CondicionIVAContext);
  let noAplica = "NO APLICA (0 cero)";
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  var retencionGAN = 0.0;
  var retencionIVA = 0.0;
  var retencionSUSS = 0.0;

  const { mutate: saveRET } = useMutation(
    
    async () =>
      ( 
      await postMethod(`op/modificar/${idSociety.id}`, {
        id: OPId,
        RET_GAN: retencionGAN,
        RET_IVA: retencionIVA,
        RET_SUSS: retencionSUSS,
      })
      ),
      
    {
      onMutate: async () => {
        await queryClient.cancelQueries(['_op', idSociety]);
        const prevData = queryClient.getQueryData(['_op', idSociety]);

        return prevData;
      },
      onError: (err, id, context) => queryClient.setQueryData(['_op', idSociety], context),
      onSettled: () => {
        setOpen(true)
        if(idSociety.id > 0) {
          queryClient.invalidateQueries(['_op', idSociety])
        }
        refetch()        
      }
    }
  );


  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
  
  //*****************************
  // Gananacias
  //*****************************
  var regimenGAN = "";
  var netoAcumMes = "";
  var retAcumMes = "";
  var msgRetencion = "";
  
  var codigo = "";
  var categoria = categorias?.find(c => c.id === formOP?.empresas[0].categoria);
  
  var minSujRet = parseFloat(categoria?.inscriptosNoRet);
  var tasaIVA = categoria?.inscriptos;
  
  if(acumulado?.letra ==="M" || acumulado?.no_gravados_exentos ===1){
    
    netoAcumMes = noAplica;
    retAcumMes = noAplica;
    codigo = noAplica;
    minSujRet = noAplica;
    tasaIVA = "sin dato";
    let cod = (acumulado?.letra ==="M")? 998:999;

    categoria = categorias?.find(c => c.codigo === parseInt(cod)); 
    tasaIVA = categoria?.inscriptos;
    retencionGAN = categoria.inscriptos * formOP?.neto /100;
    msgRetencion = "" + retencionGAN;
    regimenGAN = categoria?.regimen;


  }else if(categoria?.codigo){

    regimenGAN = categoria?.regimen;
    codigo = categoria?.codigo;
    netoAcumMes = parseFloat(acumulado?.netoAcumMes) + parseFloat(formOP?.neto);
    retAcumMes = parseFloat(acumulado?.netoGAN_Mes);
    retencionGAN = ((netoAcumMes - minSujRet) * categoria.inscriptos / 100) - retAcumMes;
    if(retencionGAN<0){retencionGAN = 0.0;} 
    msgRetencion = "" + retencionGAN;

  }else{
    regimenGAN = "ERROR: FALTA CONFIGURAR LA CATEGORIA DEL PROVEEDOR ";
  }
  var condIVA_Id = parseInt(formOP? formOP?.empresas[0].condIVA:0);
  var condicion_frente_al_iva = condIVA?.find(i => i.id === condIVA_Id).descripcion;


  //*****************************
  // IVA
  //*****************************

  var porcentaje_a_retener = 0;
  
  if(acumulado?.letra ==="M" || acumulado?.no_gravados_exentos ===1){
    porcentaje_a_retener = 100;
    if(acumulado?.no_gravados_exentos===1){
      porcentaje_a_retener = 50;
    }
    retencionIVA = ( parseFloat(formOP?.iva) * porcentaje_a_retener / 100);
  }


  //*****************************
  // SUSS
  //*****************************
  
  var suss = [];
  var msgSUSS = "";
  var netoAcumAnio = 0.0;
  
  var minSujRetSUSS = 0.0;
  var tasaSUSS = 0.0;

  if(formOP?.empresas[0]?.esRetSUSS === 1){ // si hay que retener SUSS

    if(formOP?.conceptoSUSS > 0){ // ARQ, ING o no aplicaS
    
     
      suss = categorias?.find(c => c.codigo === formOP?.conceptoSUSS);
      minSujRetSUSS = parseFloat(suss?.inscriptosNoRet);
      netoAcumAnio = parseFloat(acumulado?.netoAcumAnio);
      
      tasaSUSS =  suss.inscriptos ;
      if((netoAcumAnio + parseFloat(formOP?.neto)) > minSujRetSUSS){
        retencionSUSS = parseFloat(formOP?.neto) * suss.inscriptos /100 ;
        msgSUSS = Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(retencionSUSS)) + " $";
      }else{
        msgSUSS = retencionSUSS = 0.0;
      }
    }else if(formOP?.conceptoSUSS===0){
      msgSUSS = noAplica;
    }
  }

 

  return ( 
      
    
    <div id="MENU" style={{ minHeight: "100vh" }}>
  

      <Helmet>
          <title>
          op:{"numero"} | {idSociety?.nombre}
          </title>
      </Helmet>  
      <>
                  
     
        <Box sx={{backgroundColor: 'background.default',minHeight: '100%',py: 3,}} >
          <Container >

            <Box sx={{ pt: 3 }}>
              <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >
                              
                   
                    <Grid item md={7}>
                      <Typography align="left" color="textPrimary" variant="h4">
                      Pago: {formOP?.numero}&nbsp;&nbsp;&nbsp;&nbsp; Fideicomiso: {fideicomiso} - Razón Social: {formOP?.empresas[0]?.razonSocial}
                      </Typography>     
                    </Grid>

                    <Grid item md={5}>
                          <Typography align="right" color="textPrimary" variant="h5">
                            {mostrarFechaMesTXT(fecha)}
                          </Typography>
                    </Grid>   
                    <Grid item md={12}>
                        &nbsp;  
                    </Grid>           
                     

              </Grid>

              <Grid container spacing={{ xs: .5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >
            
                <Grid item md={12}>
                  <Typography align="left" color="textPrimary" variant="h4">
                        RETENCIONES IMPUESTO A LAS GANANCIAS:
                  </Typography>     
                </Grid>         
                <Grid item md={12}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        Régimen:&nbsp;{regimenGAN}
                  </Typography> 
                </Grid>
                <Grid item md={12}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        {condicion_frente_al_iva} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Código de Régimen:&nbsp;{codigo}
                  </Typography> 
                </Grid>
                <Grid item md={12}>
                  <Typography align="left" color="textPrimary" variant="h5">
                      Tipo de Persona:
                  </Typography> 
                </Grid>

                <Grid item md={1}>&nbsp;</Grid>
                <Grid item md={11}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        Neto gravado acumulado mensual:&nbsp;{netoAcumMes}
                  </Typography> 
                </Grid>

                <Grid item md={1}>&nbsp;</Grid>
                <Grid item md={11}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        Retenciones acumuladas del mes:&nbsp;{retAcumMes}
                  </Typography> 
                </Grid>

                <Grid item md={1}>&nbsp;</Grid>
                <Grid item md={11}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        Mínimo no sujeto a retención:&nbsp;{minSujRet}
                  </Typography> 
                </Grid>

                <Grid item md={1}>&nbsp;</Grid>
                <Grid item md={11}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        Tasa aplicable:&nbsp;{tasaIVA}%
                  </Typography> 
                </Grid>

                <Grid item md={2}>
                  <Typography align="left" color="textPrimary" variant="h5">
                     Retención a practicar:
                </Typography> 
                </Grid>
                <Grid item md={10}>
                  <Typography  style={{textDecorationLine: 'underline'}} align="left" color="green" variant="h4">
                        
                        &nbsp;{Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(msgRetencion)) + " $"}
                  </Typography> 
                </Grid>              

                <Grid item md={12}>
                  <Typography align="left" color="textSecondary" variant="h6">
                    GANANCIAS (resolución 830), Calculo:
                  </Typography>     
                  <Typography align="left" color="textSecondary" variant="h6">
                    ((Neto gravado acumulado mensual - Mínimo no sujeto a retención) * Tasa aplicable) - Retenciones acumuladas del mes
                  </Typography>   
                  <Typography align="left" color="textSecondary" variant="h6">
                    Si el resultado es menor a cero, entonces la Retención a practicar: 0
                  </Typography>   
                  <Typography align="left" color="textSecondary" variant="h6">                  
                    GANANCIAS (régimen particular Clase "M", Clase "A" "Operación sujeto a retención"), Calculo: Monto Neto * Tasa aplicable
                  </Typography>
                </Grid> 

                <Grid item md={12}>
                  &nbsp;    
                </Grid>  
                <Grid item md={12}>
                  <Typography align="left" color="textPrimary" variant="h4">
                        RETENCIONES IMPUESTO IVA:
                  </Typography>     
                </Grid>         
                <Grid item md={12}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        Porcentaje a retener:&nbsp;{porcentaje_a_retener}%
                  </Typography> 
                </Grid>
                <Grid item md={2}>
                  <Typography align="left" color="textPrimary" variant="h5">
                      Retención a practicar:
                  </Typography> 
                </Grid>
                <Grid item md={10}>
                  <Typography  style={{textDecorationLine: 'underline'}} align="left" color="green" variant="h4">
                        &nbsp;{Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(retencionIVA)) + " $"}
                  </Typography> 
                </Grid>
                <Grid item md={12}>                  
                  <Typography align="left" color="textSecondary" variant="h6">                 
                   IVA Resolucion AFIP 1575 (régimen particular Clase "M", Clase "A" "Operación sujeto a retención"), Calculo: % delMonto IVA
                  </Typography>   
                </Grid> 

                <Grid item md={12}>
                  &nbsp;    
                </Grid>  
                <Grid item md={12}>
                  <Typography align="left" color="textPrimary" variant="h4">
                        RETENCIONES IMPUESTO SEGURIDAD SOCIAL:
                  </Typography>     
                </Grid>        
                <Grid item md={12}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        Sujeto retención SUSS :&nbsp;{(formOP?.empresas[0]?.esRetSUSS === 1)?"SI":"NO"}
                  </Typography> 
                </Grid>
       
                <Grid item md={12}>
                  <Typography align="left" color="textPrimary" variant="h5">
                      Tipo de Persona:
                  </Typography> 
                </Grid>

                <Grid item md={1}>&nbsp;</Grid>
                <Grid item md={11}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        Neto gravado acumulado anual:&nbsp;{netoAcumAnio}
                  </Typography> 
                </Grid>

                <Grid item md={1}>&nbsp;</Grid>
                <Grid item md={11}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        Mínimo no sujeto a retención:&nbsp;{minSujRetSUSS}
                  </Typography> 
                </Grid>

                <Grid item md={1}>&nbsp;</Grid>
                <Grid item md={11}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        Tasa aplicable:&nbsp;{tasaSUSS}%
                  </Typography> 
                </Grid>

                <Grid item md={2}>
                  <Typography align="left" color="textPrimary" variant="h5">
                     Retención a practicar:
                </Typography> 
                </Grid>
                <Grid item md={10}>
                  <Typography  style={{textDecorationLine: 'underline'}} align="left" color="green" variant="h4">
                        
                        &nbsp;{msgSUSS}
                  </Typography> 
                </Grid>              

                <Grid item md={12}>
                  <Typography align="left" color="textSecondary" variant="h6">
                    SUSS (Resolución AFIP 2682), Calculo:
                  </Typography>     
                  <Typography align="left" color="textSecondary" variant="h6">
                    Si el Neto gravado es mayor al  Mínimo no sujeto a retención, entonces:  Monto Neto * Tasa aplicable
                  </Typography>   
                
                </Grid> 
                <Grid item md={12}>
                        <Button
                          /*variant="info"*/
                          onClick={() => {
                            saveRET();
                          }}
                        >
                          {"Impactar valores"}
                        </Button>

                        <Collapse in={open}>
                            <Alert
                              action={
                                <IconButton
                                  aria-label="close"
                                  color="inherit"
                                  size="small"
                                  onClick={() => {
                                    setOpen(false);
                                  }}
                                >
                                  <CloseIcon fontSize="inherit" />
                                </IconButton>
                              }
                              sx={{ mb: 2 }}
                            >
                              Acción realizada!
                            </Alert>
                        </Collapse> 
                 
                
                </Grid> 
         

                <Grid item md={12}>
                    &nbsp;                 
                </Grid> 
                <Grid item md={12}>
                  <Typography align="left" color="textSecondary" variant="h6">
                    Monto Neto: {formOP?.neto}, Monto IVA: {formOP?.iva}
                  </Typography>     
                  <Typography align="left" color="textSecondary" variant="h6">
                    Periodo: {acumulado?.mes}, Ejercicio: {acumulado?.anio}
                  </Typography> 
                  <Typography align="left" color="textSecondary" variant="h6">
                    GANANCIAS OPs involucradas, criterio: estado "PAGADA" o "PAGADA PARCIAL" dentro del periodo [numero OP - numero Factura]:

                  </Typography> 
                  <Typography align="left" color="textSecondary" variant="h6">
                    {acumulado?.factrurasMesGAN}
                  </Typography> 
  
  
                
                </Grid> 
              
              </Grid>

            </Box>
            	
  
        
          </Container>            
        </Box>
        
        
      </>
   
    </div>
    
  );  
}
