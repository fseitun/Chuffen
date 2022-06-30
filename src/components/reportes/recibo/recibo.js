import React from 'react';
import { Page, Document, Image } from '@react-pdf/renderer';

import {Text, View, StyleSheet, link } from '@react-pdf/renderer';
// import { mostrarFecha } from 'src/utils/utils';
import Header from './header';
import Fiduciante from './fiduciante';
import IVA from './IVA';
import Monto from './monto';
import Total from './total';

const styles = StyleSheet.create({

  espacio: { 
    height: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 21,
    fontSize: 10,
    fontStyle: 'bold',
  },
  rowbis: {
    flexDirection: 'row',
    alignItems: 'left',
    height: 24,
    fontSize: 10,
    fontStyle: 'bold',
  },
  col1: {
    width: '33%',
    textAlign: 'right',
    paddingLeft: 8,
  },
  col1bis: {
    width: '33%',
    textAlign: 'right',
    paddingTop: 5,
    paddingLeft: 8,
  },
  col2bis: {
    width: '33%',
    textAlign: 'center',
    backgroundColor: '#B4B4B4',
    paddingTop: 5,
    paddingLeft: 8,
  },
  col3: {
    width: '33%',
    textAlign: 'left',
    paddingLeft: 8,
  },
  col3bis: {
    width: '33%',
    textAlign: 'center',
    paddingTop: 5,
    paddingLeft: 8,
  },

});

  /*
  var arr_id = [];
  var arr_banco = [];
  var arr_cid = [];
  var arr_cuenta = [];*/
  

  

  const recibo = ({data}) => (

            <Document >
                <Page size="A4" style={styles.page}>
                
                <View style={{ flexDirection: 'row',flexWrap: 'wrap', margin: 65, borderWidth: 1, borderColor: '#000000', }} >
                
                        <Header />
                        <Fiduciante />
                        <IVA />
                        <Monto />
                        <Total />

                </View>   


                   
                </Page>
            </Document>
        );
  
  export default recibo