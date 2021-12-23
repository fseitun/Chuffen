import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Grid } from '@mui/material';
import { Helmet } from 'react-helmet';
import { AgregarFactura } from 'src/components/detalleOP/AgregarFactura';
import { FormDetalleOP } from 'src/components/detalleOP/FormDetalleOP';
import { GrillaDetalleOP } from 'src/components/detalleOP/GrillaDetalleOP';
import { mostrarFechaMesTXT } from 'src/utils/utils';
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import { Button } from '@mui/material';
import RepOp from "src/components/reportes/orden_de_pago/orden_de_pago";
import { useQuery } from 'react-query';
import { getMethod, postMethod } from 'src/utils/api';
const apiServerUrl = process.env.REACT_APP_API_SERVER;



export function DetalleOP({ idSociety, loggedUser }) {

  const [verPDF, setVerPDF] = React.useState(false);
  
  const { idOP } = useParams();
  const { fecha } = useParams();  
  const { empresaId } = useParams();  
  const { numero } = useParams();
  const { fideicomiso } = useParams();
  const id = idSociety.id;
  const fileName="OP_" + fideicomiso + "_" + numero + ".pdf";
  // const fileName="OP_aaa_bbb.pdf";

   //guarda en server
   const getPdfBlob = async () =>   {

    let blobPdf = await pdf(NewDocument()).toBlob();
    let formData = new FormData();
    formData.append('logo', blobPdf);
    formData.append('id', idOP);
    formData.append('fideicomiso', fideicomiso);
    formData.append('numero', numero);    
    postMethod(`op/modificar/${idSociety.id}`, formData);
    
  }

  const guardar_en_server = () => {

    setTimeout(() => {
      getPdfBlob();
    }, 300);
  }

  const NewDocument = () => {
    return (
      <RepOp dataOP={opCargadas(dataOP)} dataFacturas={facturasCargadas(fa)} apiServerUrl={apiServerUrl} idSociedad={id} />
    )
  }

  const { data: fa,
  } = useQuery(
    ['fa'],
    () => getMethod(`factura/listar/${idSociety.id}/opid/${idOP}`));

  function facturasCargadas(fa){
      if(fa){     
        //console.log(22222);
        return { item: fa};
      }else{
        return null
      }
  }
  
  const {
    data: dataOP,
    } = useQuery(['dataOP', idSociety.id], () =>
    getMethod(`op/mostrar/${idSociety.id}/${idOP}`)
  );  

  function opCargadas(dataOP){
    if(dataOP){     
      console.log(22222);
      return dataOP;
    }else{
      console.log(44444);
      return null
    }
}

  const Menu = () => (
    <nav
      style={{
        display: "flex",
        borderBottom: "1px solid black",
        paddingBottom: "5px",
        justifyContent: "flex-end",
      }}
    >
     
      <Button
        variant="dark"
        onClick={() => {
          setVerPDF(!verPDF);
        }}
      >
        {verPDF ? "Ocultar PDF" : "Ver PDF"}
      </Button>

      <PDFDownloadLink
        document={<RepOp dataOP={opCargadas(dataOP)} dataFacturas={facturasCargadas(fa)} apiServerUrl={apiServerUrl} idSociedad={id} />}
        fileName={fileName}
      >
        <Button variant="info" onClick={guardar_en_server} >Descargar</Button>
      </PDFDownloadLink>

    </nav>
  );

  return (

   
    <div style={{ minHeight: "100vh" }}>
      <Menu OPId={idOP}
              fecha={fecha}
              empresaId={empresaId}
              idSociety={idSociety}
              loggedUser={loggedUser} /> 

      <Helmet>
          <title>
          op:{numero.replace("OP_","")} | {idSociety?.nombre}
          </title>
      </Helmet>  
      <>
                  
          {verPDF ? (
            <PDFViewer style={{ width: "100%", height: "90vh" }}>
              <RepOp dataOP={opCargadas(dataOP)} dataFacturas={facturasCargadas(fa)} apiServerUrl={apiServerUrl} idSociedad={id} />
            </PDFViewer>
          ) : 
     
          <Box
                sx={{
                  backgroundColor: 'background.default',
                  minHeight: '100%',
                  py: 3,
                }}
              >
            <Container >

              <Box sx={{ pt: 3 }}>
                <Grid container spacing={{ xs: 0.5, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} >
                                
                      <Grid item md={7}>
                      <Typography align="left" color="textPrimary" variant="h4">
                              Solicitud de Pago: {numero.replace("OP_","")}
                            </Typography>
                      </Grid>
                      <Grid item md={5}>
                            <Typography align="right" color="textPrimary" variant="h5">
                              {mostrarFechaMesTXT(fecha)}
                            </Typography>
                      </Grid>             

                </Grid>
              </Box>
              <Box sx={{ pt: 3 }}>
                <AgregarFactura
                  OPId={idOP}
                  fecha={fecha}
                  empresaId={empresaId}
                  idSociety={idSociety}
                  loggedUser={loggedUser}
                />
              </Box>
              <Box sx={{ pt: 3 }}>
                <GrillaDetalleOP
                  OPId={idOP}
                  fecha={fecha}
                  empresaId={empresaId}
                  idSociety={idSociety}
                  loggedUser={loggedUser}
                />
              </Box>         
              <Box sx={{ pt: 3 }}>
                <FormDetalleOP
                  OPId={idOP}
                  idSociety={idSociety}
                  loggedUser={loggedUser}
                />
              </Box>      
            </Container>
            
          </Box>
          
          }
        </>
   
    </div>
  );
}
