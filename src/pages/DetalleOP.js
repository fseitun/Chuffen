import React from 'react';
import { useRef } from 'react'
//import { useState, createContext } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Grid } from '@mui/material';
import { Helmet } from 'react-helmet';
import { AgregarFactura } from 'src/components/detalleOP/AgregarFactura';
import { FormDetalleOP } from 'src/components/detalleOP/FormDetalleOP';
import { GrillaDetalleOP } from 'src/components/detalleOP/GrillaDetalleOP';
import { mostrarFechaMesTXT } from 'src/utils/utils';
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import { toast } from 'react-toastify';
import { useQueryClient, useMutation } from 'react-query';
import { Button, Hidden } from '@mui/material';
import RepOp from "src/components/reportes/orden_de_pago/orden_de_pago";
import { useQuery } from 'react-query';
import { getMethod, postMethod } from 'src/utils/api';

//import { SumFacturaContext } from 'src/components/detalleOP/sumFacturaContext';

const apiServerUrl = process.env.REACT_APP_API_SERVER;



export function DetalleOP({ idSociety, loggedUser }) {

  const [verPDF, setVerPDF] = React.useState(false);
  const { idOP } = useParams();
  const { fecha } = useParams();  
  const { empresaId } = useParams();  
  const { numero } = useParams();
  const { fideicomiso } = useParams();
  const { estadoOP } = useParams();
  const { confirmada } = useParams();
  const id = idSociety.id;
  const fileName = "OP_" + fideicomiso + "_" + numero + ".pdf";
  const buttonAdmRef = useRef();  
  const { blue } = useParams();

  const{
      data: formOP,
      isLoading,
      error,
      refetch
    } = useQuery(['formOP', idSociety.id], () =>
    getMethod(`op/mostrar/${idSociety.id}/${idOP}`)
  );


  
   //guarda pdf en server
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

  // es el reporte .pdf
  const NewDocument = () => {
    return (
      <RepOp dataOP={opCargadas(dataOP)} dataFacturas={facturasCargadas(fa)} apiServerUrl={apiServerUrl} idSociedad={id} />
    )
  }

  const { data: fa,
  } = useQuery(
    ['fa'],
    () => getMethod(`factura/listar/${idSociety.id}/opid/${idOP}/${blue}`));

  function facturasCargadas(fa){
      if(fa){     
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
  
  const queryClient = useQueryClient();

  const { mutate: authFilaObra } = useMutation(
    async id =>
      await postMethod(`autorizacion/agregar/${idSociety?.id}`, {

        opid : id,
        documento: 'op',
        tipoAutorizacion: 'obra',
        creador: loggedUser.id

      }),
    {
      onSuccess: async () =>
        await queryClient.refetchQueries(['dataOP', idSociety]),
    }
  );

  const { mutate: authFilaAdm } = useMutation(
    async id =>
      await postMethod(`autorizacion/agregar/${idSociety?.id}`, {

        opid : id,
        documento: 'op',
        tipoAutorizacion: 'adm',
        creador: loggedUser.id

      }),
      
    {
      onSuccess: async () =>        
        await queryClient.refetchQueries(['dataOP', idSociety]),
    }
  );

  function opCargadas(dataOP){
    if(dataOP){     
      return dataOP;
    }else{
      return null
    }
}

  /* ************************* */
  var verAdm = verAuthBoton("adm", dataOP, "Autorizar en Obra", loggedUser?.["rol.descripcion"]);
  const [verBoxAdm, setVerBoxAdm] = useState(verAdm);  

  var verObra = verAuthBoton("obra", dataOP, "Autorizar en Obra", loggedUser?.["rol.descripcion"]);
  const [verBoxObra, setVerBoxObra] = useState(verObra);

  let verAgregar = (loggedUser?.['rol.op'] ==='vista'); // si es vista listo no la ve
  if(!verAgregar){
      let conf = dataOP?(dataOP?.confirmada===1):false;
      if(conf){// confirmada y no es vista
              if(loggedUser?.['rol.op'] ==='total'){  // si es parcial
                    verAgregar = false;
              }else{
                    verAgregar = true;
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
      <Box display={verBoxObra} sx={{ pt: 1 }}>
        <Button
        
        onClick={() => {
          toast(({ closeToast }) => (
            <Box>
              <Button
                sx={{ p: 1, m: 1 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={closeToast}
              >
                Cancelar
              </Button>
              <Button
                sx={{ p: 1, m: 1 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  setVerBoxObra("none")
                  authFilaObra(idOP)
                  closeToast();
                }}
              >
                Autorizar
              </Button>
            </Box>
          ));
        }}
      >
        Autorizar en Obra
        </Button>
      </Box>
      <Box display={verBoxAdm} sx={{ pt: 1 }}>
        <Button
          ref={buttonAdmRef}
          /*variant="info"*/
          
          onClick={() => {
            toast(({ closeToast }) => (
              <Box>
                <Button
                  sx={{ p: 1, m: 1 }}
                  
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={closeToast}
                >
                  Cancelar
                </Button>
                <Button
                  sx={{ p: 1, m: 1 }}
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => {
                    setVerBoxAdm("none")
                    authFilaAdm(idOP)
                    closeToast();
                  }}
                >
                  Autorizar
                </Button>
              </Box>
            ));
          }}
        >        
          Autorizar ADM
        </Button>      
      </Box>

      <Box sx={{ pt: 1 }}>
        <Button
          /*variant="info"*/
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

   
      </Box>
  


    </nav>     

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
                                
                      <Grid item md={2}>
                        <Typography align="left" color="textPrimary" variant="h4">
                              Solicitud de Pago:
                        </Typography>
                      </Grid>

                      <Grid item md={5}>

                        <Hidden  smUp={( !(parseInt(blue)===1))} >
                          <Typography align="left" color="blue" variant="h4">
                                {numero.replace("OP_","")} Blue
                          </Typography>
                        </Hidden>
                        <Hidden  smUp={( !(parseInt(blue)===0))} >
                          <Typography align="left" color="textPrimary" variant="h4">
                                {numero.replace("OP_","")}
                          </Typography>
                        </Hidden>

                      </Grid>

                      <Grid item md={5}>
                            <Typography align="right" color="textPrimary" variant="h5">
                              {mostrarFechaMesTXT(fecha)}
                            </Typography>
                      </Grid>             

                </Grid>
              </Box>
              <Hidden  smUp={( verAgregar)} >
                <Box sx={{ pt: 3 }}>
                
                  <AgregarFactura
                    OPId={idOP}
                    fecha={fecha}
                    empresaId={empresaId}
                    idSociety={idSociety}
                    refetch={refetch}
                    loggedUser={loggedUser}
                  />
                
                </Box>
              </Hidden> 
              <Box  sx={{ pt: 3 }}>
                <GrillaDetalleOP
                  OPId={idOP}
                  fecha={fecha}
                  empresaId={empresaId}
                  idSociety={idSociety}
                  refetch={refetch}
                  loggedUser={loggedUser}
                />
              </Box>

              <Box  sx={{ pt: 3 }}>
                <FormDetalleOP
                  OPId={idOP}
                  estadoOP={estadoOP}
                  confirmada={confirmada}
                  idSociety={idSociety}
                  loggedUser={loggedUser}

                  formOP={formOP}
                  isLoading={isLoading}
                  error={error}
                  refetch={refetch}

                />
              </Box>
         
            </Container>
            
          </Box>
          
          }
        </>
   
    </div>
    
  );  
}

//</SumFacturaContext.Provider>

function verAuthBoton(tipo, dataOP, label, rol_usuario){
  // rol adm, obra, manager
  let rta = "";

  if(tipo === "manager"){rta = label} 
  if(tipo === rol_usuario){rta = label} 

  if(tipo==="adm"){
    if(dataOP?.auth_adm){
      if(dataOP.auth_adm[0]){
        if(dataOP.auth_adm[0].usuarios[0].user !== undefined){
          rta = "";
        }
      }     
    }
  }else{
    if(dataOP?.auth_obra){
      if(dataOP.auth_obra[0]){
        if(dataOP.auth_obra[0].usuarios[0].user !== undefined){
          rta = "";
        }
      }     
    }
  }  

  if(rta ===""){
    return "none";
  }else{  
    return "";
  }  

}

