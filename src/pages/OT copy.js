import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Box } from '@mui/material';
import { render } from 'react-dom';
import { renderToString } from 'react-dom/server';
import { ReporteOP } from 'src/components/OP/ReporteOP';
// import Page from '34.html';
// var htmlDoc = {__html: Page};

// import Hello from './Hello';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// require('jspdf-autotable');

const pdf = new jsPDF();

export function OT({ idSociety, loggedUser}) {

  return (
    <>
      <Helmet>
        <title>Fiduciante | {idSociety?.nombre ?? ''}</title>
      </Helmet>

      <div >
        <h2>Start editing to see some magic happen {'\u2728'}</h2>
        
        <button onClick={print}>print</button>
      
       </div>

       <div id="capture">
        <p>Hello in my life</p>
        <span>How can hellp you</span>
      </div>

       <Box sx={{ pt: 3 }}>
           <ReporteOP miOP='1'  />
          </Box>
 
    </>
  );
}



const print = () => {
  const string = renderToString(<ReporteOP miOP='1'  />);
  const pdf = new jsPDF();
  pdf.fromHTML(string);
  pdf.save('pdf')
}

const App = () => (
  <div >
    <h2>Start editing to see some magic happen {'\u2728'}</h2>
    <button onClick={print}>print</button>
  </div>
);

render(<App />, document.getElementById('root'));