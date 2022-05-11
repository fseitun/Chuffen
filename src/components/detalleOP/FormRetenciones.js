import React, { useState } from 'react'
import { Container, Box, Typography, Grid, Button, IconButton, Collapse, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Helmet } from 'react-helmet';
import { useQueryClient, useMutation } from 'react-query';
import { useContext } from 'react';
import { mostrarFechaMesTXT, txt_to_DDMMAAAA, date_to_YYYYMMDD, date_to_YYYYMMDD_s, formato_moneda } from 'src/utils/utils';
import { postMethod } from 'src/utils/api';
import { CondicionIVAContext } from 'src/App';
import { pdf } from "@react-pdf/renderer";
import RepCertificado from "src/components/reportes/certificados/certificado";

export function FormRetenciones({ idSociety, OPId, acumulado, item, fecha, fideicomiso, OP, certificado, categorias, isLoading, error, refetch, loggedUser }) {

  const condIVA = useContext(CondicionIVAContext);
  let noAplica = "NO APLICA (0 cero)";
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  var retencionGAN = 0.0;
  var retencionIVA = 0.0;
  var retencionSUSS = 0.0;

  //1- Guarda los valores de las retenciones en la OP
  //2- LLama guardar_cert_en_server
  const { mutate: saveRET_1_of_4 } = useMutation(
    
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
        if(idSociety.id > 0) {
          createPDF_2_of_4()
        }  
        refetch(); // eliminar     
      }
    }
  );

  var general = {};
  const [dataGAN, setDataGAN] = useState({});
  const [dataIVA, setDataIVA] = useState({});
  const [dataSUSS, setDataSUSS] = useState({});

  const GanDocument = () => {
    return (
      <RepCertificado data={dataGAN} />
    )
  }

  const IvaDocument = () => {
    return (
      <RepCertificado data={dataIVA} />
    )
  }

  const SUSSDocument = () => {
    return (
      <RepCertificado data={dataSUSS} />
    )
  }

  var condIVA_Id = parseInt(OP? OP?.empresas[0].condIVA:0);
  var condicion_frente_al_iva = condIVA?.find(i => i.id === condIVA_Id).descripcion;

  var categoriaGAN =  null;
  var categoriaSUSS = null;
  
  // En el clidk del boton "IMPACTAR VALORES"
  // Paso 1: saveRET_1_of_4 graba en tabla OPs campos RET_GAN, RET_IVA, RET_SUSS
  // Paso 2: createPDF_2_of_4 formData es el archivo y los parametros (usando el reporte de certificados)
  // Paso 3: savePDF_3_of_4 guarda el pdf en sociedades/idcliente/certificados
  // Paso 4: saveCERT_4_of_4 Si sube bien el pdf, en la tabla certificados se guarda el nombre del archivo

  const createPDF_2_of_4 = async () =>   {

    let nom, ret = "";

    // GANANCIAS
    // Si existe una retencion en Ganancias
    if(retencionGAN > 0.1){    

      let blobPdf = await pdf(GanDocument()).toBlob();
      let formData = new FormData();
      formData.append('file', blobPdf);
      ret = "CERT_GAN_OP_";
      let r = OP?.empresas[0]?.razonSocial;
      r = r.replace(/ /g,"_"); //returns my_name
      nom = ret + + OP?.numero + "_" + fideicomiso + "_" + r + "_" + txt_to_DDMMAAAA(fecha);
     
      formData.append('path', `./sociedades/${idSociety.id}/certificados/`); // guarda archivo en carpeta
      formData.append('fileName', nom);     

      savePDF_3_of_4({formData});
      
    }

    // IVA
    // Si existe una retencion en Ganancias
    if(retencionIVA > 0.1){ 
        

      let blobPdf = await pdf(IvaDocument()).toBlob();
      let formData = new FormData();
      formData.append('file', blobPdf);
      ret = "CERT_IVA_OP_";
      let r = OP?.empresas[0]?.razonSocial;
      r = r.replace(/ /g,"_"); //returns my_name
      nom = ret + OP?.numero + "_" + fideicomiso + "_" + r + "_" + txt_to_DDMMAAAA(fecha);
     
      formData.append('path', `./sociedades/${idSociety.id}/certificados/`); // guarda archivo en carpeta
      formData.append('fileName', nom);
     
      savePDF_3_of_4({formData});
      
    }

    // SUSS
    // Si existe una retencion en Ganancias
    if(retencionSUSS > 0.1){ 
   
      let blobPdf = await pdf(SUSSDocument()).toBlob();
      let formData = new FormData();
      formData.append('file', blobPdf);
      ret = "CERT_SUSS_OP_";
      let r = OP?.empresas[0]?.razonSocial;
      r = r.replace(/ /g,"_"); //returns my_name
      nom = ret + OP?.numero + "_" + fideicomiso + "_" + r + "_" + txt_to_DDMMAAAA(fecha);
     
      formData.append('path', `./sociedades/${idSociety.id}/certificados/`); // guarda archivo en carpeta
      formData.append('fileName', nom);
     
      savePDF_3_of_4({formData});
      
    }
    
  }

  const { mutate: savePDF_3_of_4 } = useMutation(
      async ({formData}) => 
          await postMethod(`utilidades/uploadpdf/${idSociety.id}`, formData),          
        {
          onMutate: async ({ formData }) => {
            await queryClient.cancelQueries(['pdfFile', idSociety]);
            const prevData = queryClient.getQueryData(['pdfFile', idSociety]);
            return prevData;
          },
          onError: (err, id, context) => queryClient.setQueryData(['pdfFile', idSociety], context),
          onSettled: (fileName) => {
            if(idSociety.id > 0) {
              queryClient.invalidateQueries(['pdfFile', idSociety])
            }
            // guarda nombre del archivo en tabla certificados
            saveCERT_4_of_4({data: {OPId: OPId, tipo:fileName.slice(5, 8), nombre: fileName, creador: loggedUser.id, id: certificado?.find(i => i.tipo === fileName.slice(5, 8))?.id}})
          }
        }     
  );

  // si existe lo modifica y sino lo crea
  const { mutate: saveCERT_4_of_4 } = useMutation(
    async ({data}) =>    
          certificado?.find(i => i.tipo === data.tipo)?.id > 0? await postMethod(`certificado/modificar/${idSociety.id}`, data):
                                                                await postMethod(`certificado/agregar/${idSociety.id}`, data),          
      {
        onMutate: async ({ data }) => {
          await queryClient.cancelQueries(['certificado', idSociety]);
          const prevData = queryClient.getQueryData(['certificado', idSociety]);
          return prevData;
        },
        onError: (err, id, context) => queryClient.setQueryData(['certificado', idSociety], context),
        onSettled: () => {
          if(idSociety.id > 0) {
            queryClient.invalidateQueries(['certificado', idSociety])
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
  var netoAcumMes = 0.0;
  var retAcumMes = 0.0;
  
  var codigo = "";
  categoriaGAN = categorias?.find(c => c.id === OP?.empresas[0].categoria);
  
  var minSujRet = parseFloat(categoriaGAN?.inscriptosNoRet);
  if(!minSujRet){minSujRet=0.0;}
  
  var tasaGAN = categoriaGAN?.inscriptos? categoriaGAN?.inscriptos:0  + " %";

  
  if(acumulado?.letra ==="M" || acumulado?.letra ==="A_SUJ_RET"){
    
    netoAcumMes = noAplica;
    retAcumMes = noAplica;
    codigo = noAplica;
    minSujRet = noAplica;
    tasaGAN = "sin dato";
    let cod = (acumulado?.letra ==="M")? 998:999;

    categoriaGAN = categorias?.find(c => c.codigo === parseInt(cod)); 
    tasaGAN = categoriaGAN?.inscriptos;
    retencionGAN = categoriaGAN.inscriptos * OP?.neto /100;
    
    regimenGAN = categoriaGAN?.regimen;
    

  }else if(categoriaGAN?.codigo){

    regimenGAN = categoriaGAN?.regimen;
    codigo = categoriaGAN?.codigo;

    if(categoriaGAN?.codigo===116){

      netoAcumMes = noAplica;
      retAcumMes = noAplica;
      minSujRet = noAplica;
      let neto = parseFloat(OP?.neto);
      let arrMonto = [];
      let arrPor = [];
      arrMonto = categoriaGAN?.escalaMonto.split(",");
      arrPor = categoriaGAN?.escalaPorcentaje.split(",");
      
      let i = 0;
      let esc1 = parseFloat(arrMonto[i+1]) * parseFloat(arrPor[i]) /100;
      i ++;
      let esc2 = esc1 + (parseFloat(arrMonto[i+1]) - parseFloat(arrMonto[i]))   * parseFloat(arrPor[i]) /100;
      i ++;
      let esc3 = esc2 + (parseFloat(arrMonto[i+1]) - parseFloat(arrMonto[i]))   * parseFloat(arrPor[i]) /100;
      i ++;
      let esc4 = esc3 + (parseFloat(arrMonto[i+1]) - parseFloat(arrMonto[i]))   * parseFloat(arrPor[i]) /100;
      i ++;
      let esc5 = esc4 + (parseFloat(arrMonto[i+1]) - parseFloat(arrMonto[i]))   * parseFloat(arrPor[i]) /100;
      
      i ++;
      let esc6 = esc5 + (parseFloat(arrMonto[i+1]) - parseFloat(arrMonto[i]))   * parseFloat(arrPor[i]) /100;
      
      i ++;
      let esc7 = esc6 + (parseFloat(arrMonto[i+1]) - parseFloat(arrMonto[i]))   * parseFloat(arrPor[i]) /100;
      
      tasaGAN = "Escala";
  
      if (parseFloat(arrMonto[7])< neto){
        retencionGAN =  esc7 + (neto - parseFloat(arrMonto[7])) * parseFloat(arrPor[7])/100; 
      }else if(parseFloat(arrMonto[6])< neto){
        retencionGAN =  esc6 + (neto - parseFloat(arrMonto[6])) * parseFloat(arrPor[6])/100; 
      }else if(parseFloat(arrMonto[5])< neto){
        retencionGAN =  esc5 + (neto - parseFloat(arrMonto[5])) * parseFloat(arrPor[5])/100; 
      }else if(parseFloat(arrMonto[4])< neto){
        retencionGAN =  esc4 + (neto - parseFloat(arrMonto[4])) * parseFloat(arrPor[4])/100; 
      }else if(parseFloat(arrMonto[3])< neto){
        retencionGAN =  esc3 + (neto - parseFloat(arrMonto[3])) * parseFloat(arrPor[3])/100; 
      }else if(parseFloat(arrMonto[2])< neto){
        retencionGAN =  esc2 + (neto - parseFloat(arrMonto[2])) * parseFloat(arrPor[2])/100; 
       
      }else if(parseFloat(arrMonto[1])< neto){
        retencionGAN =  esc1 + (neto - parseFloat(arrMonto[1])) * parseFloat(arrPor[1])/100; 
      }else{
        retencionGAN =  (neto - parseFloat(arrMonto[0])) * parseFloat(arrPor[0])/100; 
      }
    }else{  
      netoAcumMes = parseFloat(acumulado?.netoAcumMes) + parseFloat(OP?.neto);
      retAcumMes = parseFloat(acumulado?.netoGAN_Mes);
      retencionGAN = ((netoAcumMes - minSujRet) * categoriaGAN.inscriptos / 100) - retAcumMes;
      if(retencionGAN<0){retencionGAN = 0.0;} 


    }

  }

  //*****************************
  // IVA
  //*****************************

  var porcentaje_a_retenerIVA = 0;
  
  if(acumulado?.letra ==="M" || acumulado?.letra ==="A_SUJ_RET" || OP?.empresas[0].actividad ==='limpieza' || OP?.empresas[0].actividad ==='seguridad'){
    porcentaje_a_retenerIVA = 100;
    if(acumulado?.letra ==="A_SUJ_RET" || OP?.empresas[0].actividad ==='limpieza' || OP?.empresas[0].actividad ==='seguridad' ){
      
      porcentaje_a_retenerIVA = 50;
    }
    retencionIVA = ( parseFloat(OP?.iva) * porcentaje_a_retenerIVA / 100);


  }


  //*****************************
  // SUSS
  //*****************************
  

  var msgSUSS = "0,00";
  var netoAcumAnio = 0.0;
  
  var minSujRetSUSS = 0.0;
  var tasaSUSS = 0.0;

  if(OP?.empresas[0]?.esRetSUSS === 1){ // si hay que retener SUSS
    
    if(OP?.conceptoSUSS > 0){ // ARQ, ING o no aplicaS
      
      categoriaSUSS = categorias?.find(c => c.codigo === OP?.conceptoSUSS);
      minSujRetSUSS = parseFloat(categoriaSUSS?.inscriptosNoRet);
      netoAcumAnio = parseFloat(acumulado?.netoAcumAnio);
      
      tasaSUSS =  categoriaSUSS.inscriptos ;
      
      if((netoAcumAnio + parseFloat(OP?.neto)) > minSujRetSUSS){
        
        retencionSUSS = parseFloat(OP?.neto) * categoriaSUSS.inscriptos /100 ;
        msgSUSS = Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(retencionSUSS)) + " $";

      }else{
        retencionSUSS = 0.0;
        msgSUSS = retencionSUSS
      }
    }else if(OP?.conceptoSUSS===0){
      msgSUSS = "0,00";
    }
  }

  // ** data del reporte
  let d = new Date();
  let facturas = "";
  item.map((f) => facturas =  facturas + facturas!==""? ", ":"" + f.numero );

  general = {
    fecha: date_to_YYYYMMDD(d),      
    comp_origen: "Factura / Tique Nro. " + facturas,
    agente: OP?.fideicomisos[0]?.empresas[0]?.razonSocial,
    agente_cuit: OP?.fideicomisos[0]?.empresas[0]?.CUIT,
    agente_dir: OP?.fideicomisos[0]?.empresas[0]?.domicilio,
    sujeto: OP?.empresas[0]?.razonSocial,
    sujeto_cuit: OP?.empresas[0]?.CUIT,
    sujeto_dir: OP?.empresas[0]?.domicilio,
  }
  
  if(certificado?.find(i => i.tipo === 'GAN')?.id > 0){

    let nGan = ('00000' + certificado?.find(i => i.tipo === 'GAN')?.id).slice(-5);
    retencionGAN = Math.round(retencionGAN * 100) / 100;
    let dGAN = {
      general: general,
      numero: date_to_YYYYMMDD_s(d) + "-" + nGan,
      impuesto: "Impto. a las Ganancias",
      regimen: codigo + " - " + regimenGAN.substring(0,50) ,      
      Fila1: "Neto gravado acumulado mensual: " + formato_moneda(netoAcumMes),
      Fila2: "Retenciones acumuladas del mes: " + formato_moneda(retAcumMes),
      Fila3: "Mínimo no sujeto a retención: " + formato_moneda(minSujRet),
      Fila4: "Tasa: " + categoriaGAN.inscriptos + " %",
      monto: retencionGAN,
    }
   
    if(dataGAN?.monto !== retencionGAN ){
      setDataGAN(dGAN);
    }
  }

  if(certificado?.find(i => i.tipo === 'IVA')?.id > 0){

    let nIVA = ('00000' + certificado?.find(i => i.tipo === 'IVA')?.id).slice(-5);
    let le = acumulado?.letra ==="M" || acumulado?.letra ==="A_SUJ_RET"? "Letra: " +  acumulado?.letra: "";
    let dIVA = {
      general: general,
      numero: date_to_YYYYMMDD_s(d) + "-" + nIVA,
      impuesto: "IVA",
      regimen: 831,      
      Fila1: le,
      Fila2: "Actividad: " + OP?.empresas[0].actividad,
      Fila3: "Tasa: " + porcentaje_a_retenerIVA + " %",
      Fila4: "",
      monto: retencionIVA,
    }
   
    if(dataIVA?.monto !== retencionIVA ){
      setDataIVA(dIVA);
    }
  }


  if(certificado?.find(i => i.tipo === 'SUS')?.id > 0){

    let nSUSS = ('00000' + certificado?.find(i => i.tipo === 'SUS')?.id).slice(-5);

    let dSUSS = {
      general: general,
      numero: date_to_YYYYMMDD_s(d) + "-" + nSUSS,
      impuesto: "RETENCIONES CONTRIB. SEG. SOCIAL",
      regimen: 754 ,      
      Fila1: "",
      Fila2: "Actividad: " + OP?.empresas[0].actividad,
      Fila3: "",
      Fila4: "Tasa: " + tasaSUSS + " %",
      monto: retencionSUSS,
    }
   
    if(dataSUSS?.monto !== retencionSUSS ){
      setDataSUSS(dSUSS);
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
                      Pago: {OP?.numero}&nbsp;&nbsp;&nbsp;&nbsp; Fideicomiso: {fideicomiso} - Razón Social: {OP?.empresas[0]?.razonSocial}
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
                        Tasa aplicable:&nbsp;{tasaGAN}
                  </Typography> 
                </Grid>

                <Grid item md={2}>
                  <Typography align="left" color="textPrimary" variant="h5">
                     Retención a practicar:
                </Typography> 
                </Grid>
                <Grid item md={10}>
                  <Typography  style={{textDecorationLine: 'underline'}} align="left" color="green" variant="h4">
                        
                        &nbsp;{Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(retencionGAN)) + " $"}
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
                        Actividad:&nbsp;{OP?.empresas[0].actividad}
                  </Typography> 
                </Grid>
                <Grid item md={12}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        Porcentaje a retener:&nbsp;{porcentaje_a_retenerIVA}%
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
                  <Typography align="left" color="textSecondary" variant="h6">                 
                   Sujetos pertenecientes a las actividades de Seguridad y Limpieza retienen IVA.
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
                        Sujeto retención SUSS :&nbsp;{(OP?.empresas[0]?.esRetSUSS === 1)?"SI":"NO"}
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
                        
                        &nbsp;{msgSUSS} $
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
                          disabled={(loggedUser['rol.op'] ==='vista' || loggedUser['rol.op'] ==='blue' || OP?.confirmada === 1)}
                          onClick={() => {
                            saveRET_1_of_4();
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
                    Monto Neto: {OP?.neto}, Monto IVA: {OP?.iva}
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
