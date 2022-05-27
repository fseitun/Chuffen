import React from 'react'
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { Container, Box, Typography, Button } from '@mui/material';
import { useQuery } from 'react-query';
import { TabContrato } from 'src/components/detalleContrato/TabContrato';
import { mostrarFechaMesTXT, buscarCAC } from 'src/utils/utils';
import { getMethod } from 'src/utils/api';
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import RepContrato from "src/components/reportes/contrato/contrato";
import { ConceptosCuotaContext} from 'src/App';
// import { buscarCAC } from 'src/utils/utils';

const apiServerUrl = process.env.REACT_APP_API_SERVER;

export function DetalleContrato({ idSociety, loggedUser }) {

  const { data: CACs } = useQuery(['CACs', idSociety], 
    () => getMethod(`CAC/listar/${idSociety.id}`)
  );

  const [moneda, setMoneda] = React.useState('ARS');

  const { contratoId } = useParams();
  const [verPDF, setVerPDF] = React.useState(false);

  var conceptosCuota = useContext(ConceptosCuotaContext);

  function nomPdfCargado(obj){

    return obj?.contrato?.id + " OP -" + obj?.contrato?.fideicomisos[0]?.nombre + "-" +  obj?.contrato?.empresas[0]?.razonSocial + ".pdf";
  }

  const{
      data: dataContrato,
      isLoading,
      error,
      refetch
    } = useQuery(['dataContrato', idSociety.id], () =>
      getMethod(`contrato/mostrar/${idSociety.id}/${contratoId}`)

  );

  var qPesos = 0;
  var qDolar = 0;
  
  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else

    for(var i =0; i< dataContrato?.cuotas.length; i++ ){
     
      if(dataContrato?.cuotas[i]?.concepto ===1){

        if(dataContrato?.cuotas[i]?.moneda ==='ARS'){
          qPesos ++;
        }else{
          qDolar ++;
        }

      }
      
  }


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
            document={isLoading===false? <RepContrato dataContrato={dataContrato} idSociedad={idSociety.id} apiServerUrl={apiServerUrl} />:null }

            fileName={nomPdfCargado(dataContrato)}
          >
            <Button variant="info"  >Descargar</Button>
          </PDFDownloadLink>
    
        </Box>       
       
    </nav>     
      <>                  
        {verPDF ? (
          <PDFViewer style={{ width: "100%", height: "90vh" }}>
            <RepContrato dataContrato={dataContrato} apiServerUrl={apiServerUrl} />
          </PDFViewer>
        ) : 
    
        <Container >
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >    

          

              <Grid item md={9}>
                  <Typography align="left" color="textPrimary" variant="h4">
                  {dataContrato?.cont?.nombre}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Fiduciante: {dataContrato?.cont?.empresaId > 0? dataContrato?.cont?.empresas[0].razonSocial:dataContrato?.cont?.personas[0].nombre }&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;{ dataContrato?.cont?.fideicomisos[0]?.nombre}
                  </Typography>
              </Grid>
              
              <Grid item md={3}>
                    <Typography align="right" color="textPrimary" variant="h5">
                      {mostrarFechaMesTXT(dataContrato?.cont?.createdAt)}
                    </Typography>
              </Grid>

        
            </Grid>

            <Grid container spacing={{ xs: 1.5, md: 2 }} columns={{ xs: 4, sm: 8, md: 12 }} > 
              <Grid item md={12} >
                &nbsp;
              </Grid>       
              <Grid item md={3} >
                <Typography align="left" color="textPrimary" variant="h5">
                Fecha de adhesión: {mostrarFechaMesTXT(dataContrato?.cont?.adhesion)} 
                </Typography>
              </Grid>   
              <Grid item md={2} >
                <Typography align="left" color="textPrimary" variant="h5">
                    Cuotas ARS: {qPesos} 
                </Typography>
              </Grid>   
              <Grid item md={2} >
                <Typography align="left" color="textPrimary" variant="h5">
                    Cuotas USD: {qDolar} 
                </Typography>
              </Grid>                    
              <Grid item md={2} >
                <Typography align="left" color="textPrimary" variant="h5">
                    CAC Base: {buscarCAC(CACs, dataContrato?.cont?.adhesion, "Construción")} 
                </Typography>
              </Grid>
              <Grid item md={3} >
                <Typography align="left" color="textPrimary" variant="h5">
                    
                </Typography>
              </Grid>         
            </Grid>
          </Box>

          <Box  sx={{ pt: 3 }}>
            <TabContrato
              contratoId={contratoId}
              idSociety={idSociety}
              loggedUser={loggedUser}
              dataContrato={dataContrato}
              isLoading={isLoading}
              error={error}
              conceptosCuota={conceptosCuota}
              moneda={moneda}
              setMoneda={setMoneda}
              refetch={refetch}
            />
          </Box>
        </Container>   
        
        }
      </>
   
    </div>
              
  );  
}