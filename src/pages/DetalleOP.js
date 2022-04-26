import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Grid, Button, Hidden } from '@mui/material';
import { Helmet } from 'react-helmet';
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import { toast } from 'react-toastify';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import RepOp from "src/components/reportes/orden_de_pago/orden_de_pago";
import { AgregarFactura } from 'src/components/detalleOP/AgregarFactura';
import { FormDetalleOP } from 'src/components/detalleOP/FormDetalleOP';
import { GrillaDetalleOP } from 'src/components/detalleOP/GrillaDetalleOP';
import { FormRetenciones } from 'src/components/detalleOP/FormRetenciones';

import { mostrarFechaMesTXT } from 'src/utils/utils';
import { getMethod, postMethod } from 'src/utils/api';


const apiServerUrl = process.env.REACT_APP_API_SERVER;

export function DetalleOP({ idSociety, loggedUser }) {

  const [verPDF, setVerPDF] = React.useState(false);
  const [verRetenciones, setVerRetenciones] = React.useState(false);
  const { idOP, fideicomisoId, fecha, empresaId, numero, fideicomiso, estadoOP, auth_adm, auth_obra, confirmada, blue } = useParams();

  const id = idSociety.id;
  
  const buttonAdmRef = useRef();  
  
  let f = new Date();
  // let fideicomisoId = 1;

  const {data: acumulado} = useQuery(['acumulado', idSociety], () => 
    getMethod(`op/acumulado/${idSociety.id}/${idOP}/${empresaId}/${fideicomisoId}/${(f.getMonth() + 1)}/${f.getFullYear()}`)
  ); 
  
  const {data: categorias} = useQuery(['categoria', idSociety], () => 
    getMethod(`categoria/listar/${idSociety.id}`)
  ); 

  const{
      data: formOP,
      isLoading,
      error,
      refetch
    } = useQuery(['formOP', idSociety.id], () =>
      getMethod(`op/mostrarConFacturas/${idSociety.id}/${idOP}`)
  );

   //guarda pdf en server
   const getPdfBlob = async () =>   {

    let blobPdf = await pdf(NewDocument()).toBlob();
    let formData = new FormData();
    formData.append('logo', blobPdf);
    formData.append('id', idOP);
    formData.append('fideicomiso', fideicomiso);
    formData.append('numero', numero);    
    postMethod(`op/modificar/1`, formData);
    
  }

  const guardar_en_server = () => {

    setTimeout(() => {
      getPdfBlob();
    }, 300);
  }



  function nomPdfCargado(obj, numero, fideicomiso){
    
    if(obj){
      if(obj.empresas[0]){
        let fileName = numero + " OP-" + fideicomiso + "-" +  obj?.empresas[0]?.razonSocial + ".pdf";
        return fileName;
      }else{return "-"}
    }else{return "-"}
  }

  function cargadas(obj, i){
    
    if(obj && i==="op"){
      return obj;
    }else if(obj && i==="f"){
      return { item: obj};
    }else if(obj && i==="b"){
      return { bancos: obj};
    }else if(obj && i==="c"){
      return { cuentasBanco: obj};
    }else{return null}
  }

  // es el reporte .pdf
  const NewDocument = () => {
    return (
      <RepOp dataOP={cargadas(formOP?.op,"op")} bancos={formOP?.bancos} cuentasBanco={formOP?.cuentasBanco}  dataFacturas={cargadas(formOP?.item,"f")} apiServerUrl={apiServerUrl} idSociedad={id} />
    )
  }

  
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
      onSuccess: async ()=> {
        if(idSociety.id > 0) {
          await queryClient.refetchQueries(['formOP', idSociety])
        }
        refetch()
        
      }
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
      onSuccess: async ()=> {
        if(idSociety.id > 0) {
          await queryClient.refetchQueries(['formOP', idSociety])
        }
        refetch()
        
      }
    }
  );


  let verAgregar = (loggedUser?.['rol.op'] ==='vista'); // si es vista, no ve boton agregar 
  if(!verAgregar){
      let conf = formOP?(formOP?.confirmada===1):false;
      if(conf){// confirmada y no es vista
              if(loggedUser?.['rol.op'] ==='total'){  // si es parcial
                    verAgregar = false;
              }else{
                    verAgregar = true;
              }
      }
  }
  
  if (isLoading) {
    return 'Cargando...';
  } else if (error) {
    return `Hubo un error: ${error.message}`;
  } else

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
        <Hidden  smUp={( loggedUser?.["rol.op"]==="vista" || parseInt(blue)===1)} >
        
            <Box  mt={2} sx={{ pt: 1 }}>
              <Button
              /*variant="info"*/
              onClick={() => {
                setVerRetenciones(!verRetenciones);
              }}
            >
              {verRetenciones ? "Ocultar Retenciones" : "Retenciones"}
            </Button>
            </Box>

        </Hidden>
        <Hidden  smUp={( verAuthBoton("obra", (formOP?.auth_obra? (formOP?.auth_obra[0]?.usuarios? formOP?.auth_obra[0]?.usuarios:auth_obra):auth_obra), loggedUser?.["rol.descripcion"]))} >
        
          <Box  mt={2} sx={{ pt: 1 }}>
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
                      // setVerBoxObra("none")
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

        </Hidden>
        <Hidden  smUp={( verAuthBoton("adm", (formOP?.auth_adm? (formOP?.auth_adm[0]?.usuarios? formOP?.auth_adm[0]?.usuarios:auth_adm):auth_adm), loggedUser?.["rol.descripcion"]))} >
          <Box  mt={2} sx={{ pt: 1 }}>
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
                        // setVerBoxAdm("none")
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
        </Hidden>

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
            document={isLoading===false? <RepOp dataOP={cargadas(formOP?.op,"op")} bancos={formOP?.bancos} cuentasBanco={formOP?.cuentasBanco}  dataFacturas={cargadas(formOP?.item,"f")} apiServerUrl={apiServerUrl} idSociedad={id} />:null }

            fileName={nomPdfCargado(formOP?.op, numero, fideicomiso)}
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
            <RepOp dataOP={cargadas(formOP?.op,"op")} bancos={formOP?.bancos} cuentasBanco={formOP?.cuentasBanco}  dataFacturas={cargadas(formOP?.item,"f")} apiServerUrl={apiServerUrl} idSociedad={id} />
          </PDFViewer>
        ) : verRetenciones ? (      

          <FormRetenciones
            idSociety={idSociety} 
            OPId={idOP}       
            fecha={fecha}           
            fideicomiso={fideicomiso}
            formOP={formOP?.op} 
            acumulado={acumulado}
            categorias={categorias}
            error={error}
            refetch={refetch}
            loggedUser={loggedUser}
          />

        ) :
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

                      <Hidden  smUp={( !(parseInt(blue)===1))} >
                        <Typography align="left" color="textPrimary" variant="h4">
                              {numero.replace("OP_","")} (Blue) &nbsp;&nbsp; {fideicomiso}
                        </Typography>
                      </Hidden>
                      <Hidden  smUp={( !(parseInt(blue)===0))} >
                        <Typography align="left" color="textPrimary" variant="h4">
                              {numero.replace("OP_","")}&nbsp;&nbsp;&nbsp;&nbsp; {fideicomiso}
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
                  fideicomisoId={formOP?.op?.fideicomisoId}
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
                facturas={formOP?.item}
                isLoading={isLoading}
                error={error}
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
                formOP={formOP?.op}
                isLoading={isLoading}
                error={error}
                empresaId={empresaId}
                fideicomiso={fideicomiso}
                _bancos={formOP?.bancos}
                _cuentasbanco={formOP?.cuentasBanco}

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

