import React from 'react';
import { Page, Document } from '@react-pdf/renderer';
import {StyleSheet, View, Text } from '@react-pdf/renderer';
import DataFidu from './dataFidu';
import Estado from './estado';
import Detalle from './detalle';

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 10,
        paddingLeft:45,
        paddingRight:40,
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

  const liquidacion = ({conceptosPago, conceptosCuota, data}) => (

            <Document >
                <Page size="A4" style={styles.page}>

                    <View >
                        <Text style={styles.reportTitle}>PAGOS</Text> 
                        <DataFidu conceptosPago={conceptosPago} conceptosCuota={conceptosCuota} cont={data?.cont} liq={data?.liq}  /> 
                        <Estado conceptosPago={conceptosPago} conceptosCuota={conceptosCuota} cont={data?.cont} liq={data?.liq}  /> 
                        <Detalle conceptosPago={conceptosPago} conceptosCuota={conceptosCuota} cont={data?.cont} liq={data?.liq}  />                      
                    </View>  
                   
                </Page>
            </Document>
        );
  
  export default liquidacion