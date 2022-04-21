import React from 'react';
import { Page, Document } from '@react-pdf/renderer';
// import { Image } from '@react-pdf/renderer';
/*
import TablaFacturas from './tablaFacturas';
import TablaTEC from './tablaTEC';
import TablaADM from './tablaADM';
import TablaCompra from './tablaCompra';*/
//import TablaTarea from './tablaTarea';
//import TablaPago from './tablaPago';
import {Text, View, StyleSheet } from '@react-pdf/renderer';
//import { mostrarFecha } from 'src/utils/utils';


const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 10,
        paddingLeft:60,
        paddingRight:60,
        lineHeight: 1.5,
        flexDirection: 'column',
    }, 
    logo: {
        height: 43,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    titleContainer:{
      flexDirection: 'row',
      marginTop: 24,
    },
    reportTitle:{
        color: '#101010',
        letterSpacing: 4,
        fontSize: 22,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    reportTitleFide:{
        
        letterSpacing: 4,
        fontSize: 22,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    subreportTitle:{
      color: '#101010',
      letterSpacing: 4,
      fontSize: 14,
      textAlign: 'left',
      textTransform: 'uppercase',
    },
    saltolinea:{
        fontSize: 8,
    },
    invoiceNoContainer: {
      flexDirection: 'row',
      marginTop: 36,
      justifyContent: 'flex-end'
    },
    invoiceDateContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    invoiceDate: {
            fontSize: 12,
            fontStyle: 'bold',
    },

  });

  var arr_id = [];
  var arr_banco = [];
  var arr_cid = [];
  var arr_cuenta = [];
  

  

  const orden_de_compra = ({dataContrato, apiServerUrl, idSociedad}) => (

            <Document >
                <Page size="A4" style={styles.page}>

                    <View >
                        <Text style={styles.saltolinea}>Contrato Hola</Text>                       
                    </View>      

                   
                </Page>
            </Document>
        );
  
  export default orden_de_compra