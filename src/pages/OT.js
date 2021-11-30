import React, { Component } from 'react';
//import { render } from 'react-dom';
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
//import React from "react";
import DocuPDF from "src/components/OP/DocuPDF";
// import Button from "react-bootstrap/Button";
import { Button } from '@mui/material';
import VistaWeb from "src/components/OP/VistaWeb";
import { getMethod } from 'src/utils/api';

export function OT({ idSociety, loggedUser }) {

  const [repOP, setRepOP] = React.useState("");
  const [verWeb, setVerWeb] = React.useState(false);
  const [verPDF, setVerPDF] = React.useState(false);

  
  function fetchOT() {
    getMethod(`OP/mostrar/${idSociety.id}/34`)
      .then((data) => {
        setRepOP(data);
        console.log(111111, data);
      });
  }

  React.useEffect(() => {
    fetchOT();
  }, []);

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
        {verWeb ? "Ocultar Web" : "Ver Web"}
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
        document={<DocuPDF repOP={repOP} />}
        fileName="repOP.pdf"
      >
        <Button variant="info">Descargar PDF</Button>
      </PDFDownloadLink>
    </nav>
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      <Menu />
      {repOP ? (
        <>
          {verWeb ? <VistaWeb repOP={repOP} /> : null}
          {verPDF ? (
            <PDFViewer style={{ width: "100%", height: "90vh" }}>
              <DocuPDF repOP={repOP} />
            </PDFViewer>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
