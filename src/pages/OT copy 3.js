import React from 'react';
import { useState } from 'react';
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
//import ReactDOM from "@react-pdf/renderer";
// import DocuPDF from "src/components/OP/DocuPDF";
import { Button } from '@mui/material';
// import VistaWeb from "src/components/OP/VistaWeb";
import Invoice from "src/components/OP/Invoice";
import InvoiceTitle from 'src/components/OP/InvoiceTitle'
import { getMethod, postMethod, deleteMethod } from 'src/utils/api';
import ReactPDF from '@react-pdf/renderer';
// import ReactPDF from '@react-pdf/renderer';
import ReactDOM from 'react-dom';

export function OT({ idSociety }) {
  const [verWeb, setVerWeb] = React.useState(false);
  const [verPDF, setVerPDF] = React.useState(false);

  const NewDocument = () => {
    return (
      <Invoice />
    )
  }

 //guarda en server
  const getPdfBlob = async () =>   {

      let blobPdf = await pdf(NewDocument()).toBlob();

      console.log(11111);
      let formData = new FormData();
      formData.append('logo', blobPdf);
      formData.append('id', 15);    
      postMethod('fideicomiso/modificar/1', formData);
      
  }
  //hace el download
  const download = () => {
    // const condition = "firstCondition";
    // const filteredRowData = rowData.filter(a => a.condition = condition);
    console.log(22222);
    return (
          <PDFDownloadLink
            document={<Invoice />}
            fileName="miReporte.pdf"
          >{({ blob, url, loading, error }) =>
          loading ? "Report loading..." : "Report ready to download"
      }
          </PDFDownloadLink>
    );
}

  const crear_y_descargar = () => {

    const timer = setTimeout(() => {
      const aa = getPdfBlob();
    }, 300);

    // const aa = getPdfBlob();
    // const bb = download();
    // PDFDownloadLink.call();
    //let blobPdf = await pdf(NewDocument()).toBlob();


  }


  const Menu = () => (
    <nav
      style={{
        display: "flex",
        borderBottom: "1px solid black",
        paddingBottom: "5px",
        justifyContent: "space-around",
      }}
    >
      <Button
        variant="dark"
        onClick={() => {
          setVerWeb(!verWeb);
          setVerPDF(false);
        }}
      >
        
      </Button>
      <Button
        variant="dark"
        onClick={() => {
          setVerPDF(!verPDF);
          setVerWeb(false);
        }}
      >
        {verPDF ? "Ocultar PDF" : "Ver PDF"}
      </Button>

      <PDFDownloadLink
        document={<Invoice />}
        fileName="miReporte.pdf"
      >
        <Button variant="info" onClick={crear_y_descargar} >Descargar PDF</Button>
      </PDFDownloadLink>

      <Button
        variant="dark"
        onClick={crear_y_descargar}
      >
        Arc222
      </Button>


    </nav>
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      <Menu /> 
        <>
          {verWeb ? <InvoiceTitle title='Invoice'/> : null}
          {verPDF ? (
            <PDFViewer style={{ width: "100%", height: "90vh" }}>
              <Invoice />
            </PDFViewer>
          ) : null}
        </>
   
    </div>
  );
}


