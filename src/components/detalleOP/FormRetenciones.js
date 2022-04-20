import React, { useRef } from 'react'
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Grid, Button, Hidden } from '@mui/material';
import { Helmet } from 'react-helmet';
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import { toast } from 'react-toastify';
import { useQuery, useQueryClient, useMutation } from 'react-query';
//import RepOp from "src/components/reportes/orden_de_pago/orden_de_pago";
//import { AgregarFactura } from 'src/components/detalleOP/AgregarFactura';
//import { FormDetalleOP } from 'src/components/detalleOP/FormDetalleOP';
import { GrillaDetalleOP } from 'src/components/detalleOP/GrillaDetalleOP';
//import { FormRetenciones } from 'src/components/detalleOP/FormRetenciones';
import { useContext } from 'react';
import { mostrarFechaMesTXT } from 'src/utils/utils';
import { getMethod, postMethod } from 'src/utils/api';
import { CondicionIVAContext } from 'src/App';

const apiServerUrl = process.env.REACT_APP_API_SERVER;

export function FormRetenciones({ idSociety, OPId, fecha, fideicomiso, formOP, categorias, empresaId, facturas, isLoading, error, refetch, loggedUser }) {

  const condIVA = useContext(CondicionIVAContext);

  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else
  
  var cat = categorias?.find(c => c.id === formOP?.empresas[0].categoria);
  var condIVA_Id = parseInt(formOP? formOP?.empresas[0].condIVA:0);
  var condicion_frente_al_iva = condIVA?.find(i => i.id === condIVA_Id).descripcion;

  //console.log(2222, condIVA, condIVA?.find(i => i.id === condIVA_Id).descripcion);





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
                              
                    <Grid item md={2}>
                      <Typography align="left" color="textPrimary" variant="h4">
                            Solicitud de Pago:
                      </Typography>
                    </Grid>

                    <Grid item md={5}>
                      <Typography align="left" color="textPrimary" variant="h4">
                            {formOP?.numero}&nbsp;&nbsp;&nbsp;&nbsp; {fideicomiso}
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
                        Régimen:&nbsp;{cat?.regimen}
                  </Typography> 
                </Grid>


                <Grid item md={12}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        {condicion_frente_al_iva} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Código de Régimen:&nbsp;{cat?.codigo}
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
                        Neto gravado acumulado mensual:&nbsp;... calcular ...
                  </Typography> 
                </Grid>

                <Grid item md={1}>&nbsp;</Grid>
                <Grid item md={11}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        Retenciones acumuladas del mes:&nbsp;... calcular ...
                  </Typography> 
                </Grid>

                <Grid item md={1}>&nbsp;</Grid>
                <Grid item md={11}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        Mínimo no sujeto a retención:&nbsp;{cat?.inscriptosNoRet}$
                  </Typography> 
                </Grid>

                <Grid item md={1}>&nbsp;</Grid>
                <Grid item md={11}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        Tasa aplicable:&nbsp;{cat?.inscriptos}%
                  </Typography> 
                </Grid>

        

                <Grid item md={12}>
                  <Typography align="left" color="textPrimary" variant="h5">
                        Retención a practicar:&nbsp;... calcular ...
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


function verAuthBoton(tipo, auth, rol_usuario){
  // rol adm, obra, manager
  let rta = true;

  if(rol_usuario==="manager" && tipo === "adm"){// adm

        if(auth === null || auth === 'null' || auth === undefined || auth === "undefined"){   
          rta = false;
        }
 
  }

  if((rol_usuario==="manager" || rol_usuario==="obra")  && tipo === "obra"){// obra
 
    if(auth === null || auth === 'null' || auth === undefined || auth === "undefined"){
     
      rta = false;
    }
  }  

  return rta;

}
