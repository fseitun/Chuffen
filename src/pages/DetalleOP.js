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
import Rep_orden_de_pago from "src/components/reportes/orden_de_pago/orden_de_pago";
import { postMethod } from 'src/utils/api';

const apiServerUrl = process.env.REACT_APP_API_SERVER;

export function DetalleOP({ idSociety, loggedUser }) {

  const [verPDF, setVerPDF] = React.useState(false);
  const { idOP } = useParams();
  const { fecha } = useParams();  
  const { empresaId } = useParams();  
  const { numero } = useParams();
  const id = idSociety.id;
  const fileName="op_" + idOP + ".pdf"; 

   //guarda en server
   const getPdfBlob = async () =>   {

    let blobPdf = await pdf(NewDocument()).toBlob();
    let formData = new FormData();
    formData.append('logo', blobPdf);
    formData.append('id', 15);    
    postMethod('op/modificar/1', formData);
    
  }

  const guardar_en_server = () => {

    const timer = setTimeout(() => {
      const aa = getPdfBlob();
    }, 300);
  }

  const NewDocument = () => {
    return (
      <Rep_orden_de_pago dataOP={dataOP} dataFacturas={dataFacturas} apiServerUrl={apiServerUrl} idSociedad={id} />
    )
  }

  const dataFacturas ={ 
    item: [
    {
        id: 31,
        OPId: 35,
        numero: "333",
        fechaIngreso: "2021-12-17T00:00:00.000Z",
        fechaVTO: null,
        path: null,
        link: null,
        empresaId: 1,
        montoTotal: "47000",
        moneda: "ARS",
        detalle: null,
        txtOC: null,
        estadoFactura: null,
        fideicomisoId: null,
        rubroId: null,
        subRubroId: null,
        usuarioId: 1,
        empresas: [
            {
                razonSocial: "Abelson s.a."
            }
        ]
    },
    {
        id: 19,
        OPId: 35,
        numero: "1919",
        fechaIngreso: "2021-11-04T00:00:00.000Z",
        fechaVTO: null,
        path: null,
        link: "aaaa",
        empresaId: 1,
        montoTotal: "47000",
        moneda: "ARS",
        detalle: null,
        txtOC: null,
        estadoFactura: null,
        fideicomisoId: 1,
        rubroId: null,
        subRubroId: null,
        usuarioId: 1,
        empresas: [
            {
                razonSocial: "Abelson s.a."
            }
        ]
    }
]};

const dataOP = {
  id: 35,
  numero: 56,
  empresaId: 1,
  monto: "94000",
  monto_a_pagar: "93445",
  RET_SUSS: "222",
  RET_GAN: "333",
  RET_IVA: "0",
  estadoRET: 2,
  fideicomisoId: 1,
  certificadoId: null,
  estado: 1,
  estadoOP: 2,
  fondos: 2,
  archivada: 0,
  descripcion: "wwww",
  authADM: 33,
  authOBRA: 31,
  createdAt: "01/03/2021",
  auth_obra: [
    {
        id: 31,
        usuarios: [
            {
                user: "martin",
                id: 1
            }
        ]
    }
  ],
  auth_adm: [
    {
        "id": 33,
        "usuarios": [
            {
                "user": "martin",
                "id": 1
            }
        ]
    }
  ],
  empresas: [
    {
        razonSocial: "Abelson s.a.",
        CUIT: "30652000076",
        mail: "test@verelmail.com",
        CBU: "0070088720000002642004",
        banco: "Galicia",
        nroCuenta: "2642-0088-0"
    }
  ],
  "OPpago": {
      id: 3,
      OPId: 35,
      banco1: "bna",
      nro1: "0070088720000002642004",
      descri1: "123",
      fecha1: "01/06/2021",
      monto1: "234.00",
      banco2: "bna",
      nro2: "0070088720000002642004",
      descri2: "asd",
      fecha2: "01/06/2021",
      monto2: "444.00",
      banco3: "",
      nro3: "",
      descri3: "",
      fecha3: "",
      monto3: "0.00",
      banco4: null,
      nro4: null,
      descri4: null,
      fecha4: null,
      monto4: null,
      usuarioId: 1,
      sociedadId: 1,
      createdAt: "2021-12-05T04:32:09.000Z",
      updatedAt: "2021-12-18T01:32:01.000Z"
  },
  fideicomisos: [
    {
        nombre: "Barlovento",
        logo: "logo_fide_1.png",
        color: "green",
        color2: "#D0F0C0",
    }
  ],

  items: [
    {
      sno: 1,
      desc: "ad sunt culpa occaecat qui",
      qty: 5,
      rate: 405.89,
    },
    {
      sno: 2,
      desc: "cillum quis sunt qui aute",
      qty: 5,
      rate: 373.11,
    },
    {
      sno: 3,
      desc: "ea commodo labore culpa irure",
      qty: 5,
      rate: 458.61,
    },
    {
      sno: 4,
      desc: "nisi consequat et adipisicing dolor",
      qty: 10,
      rate: 725.24,
    },
    {
      sno: 5,
      desc: "proident cillum anim elit esse",
      qty: 4,
      rate: 141.02,
    },
  ],
};

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
        document={<Rep_orden_de_pago dataOP={dataOP} dataFacturas={dataFacturas} apiServerUrl={apiServerUrl} idSociedad={id} />}
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
              <Rep_orden_de_pago dataOP={dataOP} dataFacturas={dataFacturas} apiServerUrl={apiServerUrl} idSociedad={id} />
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
