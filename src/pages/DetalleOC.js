import React from 'react'
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { Container, Box, Typography, Button } from '@mui/material';
import { useQuery } from 'react-query';
import { TabOC } from 'src/components/detalleOC/TabOC';
import { mostrarFechaMesTXT } from 'src/utils/utils';
import { getMethod } from 'src/utils/api';
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import RepOc from "src/components/reportes/orden_de_compra/orden_de_compra";

const apiServerUrl = process.env.REACT_APP_API_SERVER;

export function DetalleOC({ idSociety, loggedUser }) {

  const { idOC } = useParams();
  const [verPDF, setVerPDF] = React.useState(false);

  function nomPdfCargado(obj){

    return obj?.oc?.id + " OP -" + obj?.oc?.fideicomisos[0]?.nombre + "-" +  obj?.oc?.empresas[0]?.razonSocial + ".pdf";
  }

  const{
      data: formOC,
      isLoading,
      error,
      refetch
    } = useQuery(['formOC', idSociety.id], () =>
      getMethod(`oc/mostrarConDetalle/${idSociety.id}/${idOC}`)

  );
  
  const { data: CACs } = useQuery(['CACs', idSociety], 
    () => getMethod(`CAC/listar/${idSociety.id}`)
  );

  const [moneda, setMoneda] = React.useState('ARS');
  
  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else


    var totPagosARS = 0.0 ;
    var totPagosUSD = 0.0 ;
    var totAjusteARS = 0.0 ;
    var totAjusteUSD = 0.0 ;
    
    for(var i = 0; i < formOC?.pago.length; i++){
          if(formOC?.pago[i].OC_moneda ==='ARS'){
            totPagosARS +=parseFloat(formOC?.pago[i].monto);
            totAjusteARS +=parseFloat(formOC?.pago[i].ajuste? formOC?.pago[i].ajuste: 0.0);
          }else{
            if(formOC?.pago[i].moneda ==='ARS'){
              totPagosUSD +=parseFloat(formOC?.pago[i].monto) / parseFloat(formOC?.pago[i].cotizacion_usd);
              totAjusteUSD +=parseFloat(formOC?.pago[i].ajuste? formOC?.pago[i].ajuste: 0.0) / parseFloat(formOC?.pago[i].cotizacion_usd);
            }else{
              totPagosUSD +=parseFloat(formOC?.pago[i].monto);
              totAjusteUSD +=parseFloat(formOC?.pago[i].ajuste? formOC?.pago[i].ajuste: 0.0);
            }
          }    
    }
    console.log(totPagosARS, totAjusteARS);
  return (  

    <div id="MENU" style={{ minHeight: "100vh" }}>
    <nav
        style={{
          display: "flex",
          borderBottom: "1px solid black",
          paddingBottom: "5px",
          justifyContent: "flex-end",
        }}
      >

        <Box mt={2} sx={{ pt: 1 }}>
          <Button
            /*variant="info"*/
            onClick={() => {
              setVerPDF(!verPDF);
            }}
          >
            {verPDF ? "Ocultar PDF" : "Ver PDF"}
          </Button>

          <PDFDownloadLink
            document={isLoading===false? <RepOc dataOC={formOC}   moneda={moneda}  totARS={totPagosARS}  totUSD={totPagosUSD}  ajARS={totAjusteARS} ajUSD={totAjusteUSD} idSociedad={idSociety.id} apiServerUrl={apiServerUrl} />:null }

            fileName={nomPdfCargado(formOC)}
          >
            <Button variant="info"  >Descargar</Button>
          </PDFDownloadLink>
    
        </Box>       
       
    </nav>     
      <>                  
        {verPDF ? (
          <PDFViewer style={{ width: "100%", height: "90vh" }}>
            <RepOc dataOC={formOC} moneda={moneda} totARS={totPagosARS}  totUSD={totPagosUSD}  ajARS={totAjusteARS} ajUSD={totAjusteUSD} idSociedad={idSociety.id}  apiServerUrl={apiServerUrl} />
          </PDFViewer>
        ) : 
    
        <Container >
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >                                
              <Grid item md={2}>
                <Typography align="left" color="textPrimary" variant="h4">
                      Orden de Compra:
                </Typography>
              </Grid>
              <Grid item md={7}>
                  <Typography align="left" color="textPrimary" variant="h4">
                  { formOC?.oc?.id}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Razon Social: { formOC?.oc?.empresas[0]?.razonSocial}&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;{ formOC?.oc?.fideicomisos[0]?.nombre}
                  </Typography>
              </Grid>
              <Grid item md={3}>
                    <Typography align="right" color="textPrimary" variant="h5">
                      {mostrarFechaMesTXT(formOC?.oc?.createdAt)}
                    </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={{ xs: 1.5, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }} > 
              <Grid item md={12} >
                &nbsp;
              </Grid>                               
              <Grid item md={12} >
                <Typography align="left" color="textPrimary" variant="h5">
                    {formOC?.oc?.descripcion1}
                </Typography>
              </Grid>         
            </Grid>
          </Box>

          <Box  sx={{ pt: 3 }}>
            <TabOC
              OCId={idOC}
              idSociety={idSociety}
              loggedUser={loggedUser}
              formOC={formOC}
              isLoading={isLoading}
              error={error}
              totPagosARS={totPagosARS}
              totPagosUSD={totPagosUSD} 
              totAjusteARS={totAjusteARS}
              totAjusteUSD={totAjusteUSD}
              moneda={moneda}
              setMoneda={setMoneda}
              CACs={CACs} 
              refetch={refetch}
            />
          </Box>
        </Container>   
        
        }
      </>
   
    </div>
              
  );  
}