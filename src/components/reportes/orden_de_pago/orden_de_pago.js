import React from 'react';
import { Page, Document, Image } from '@react-pdf/renderer';
import TablaFacturas from './tablaFacturas';
import TablaTEC from './tablaTEC';
import TablaADM from './tablaADM';
import TablaPagos from './tablaPagos';
import TablaPie from './tablaPie';
import {Text, View, StyleSheet } from '@react-pdf/renderer';
 
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
        fontSize: 25,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    subreportTitle:{
      color: '#101010',
      letterSpacing: 4,
      fontSize: 18,
      textAlign: 'center',
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

  let fide_logo = 'http://localhost:3000/sociedades/1/logo_fide_1.png';
  const orden_de_pago = ({dataOP, dataFacturas, apiServerUrl, idSociedad}) => (
            <Document >
                <Page size="A4" style={styles.page}>       

                    <View style={{flexDirection: 'row',marginLeft: '0',marginRight: '0'}} >
                        <Text style={{width: '60%'}}> </Text>
                        <View style={{width: '40%'}} >
                        <Image style={[styles.logo, {backgroundColor: dataOP?.fideicomisos[0]?.color}]} src={{ uri: `${apiServerUrl}/sociedades/${idSociedad}/${dataOP?.fideicomisos[0]?.logo}` , method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }} />                   
                        </View>
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={styles.reportTitle}>SOLICITUD DE PAGO     Nº	{dataOP.numero}</Text>
                        
                    </View>
                    <View style={styles.invoiceDateContainer}>
                        <Text style={styles.label}>Fecha: </Text>
                        <Text >{dataOP?.createdAt}</Text>
                    </View >
                    <TablaFacturas dataOP={dataOP} dataFacturas={dataFacturas} />
                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View>

                    <View >
                        <Text style={styles.subreportTitle}>APROBACIÓN TÉCNICA</Text>                       
                    </View>
                    <TablaTEC dataOP={dataOP} />
                   
                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View>
                    <View >
                        <Text style={styles.subreportTitle}>APROBACIÓN ADMINISTRATIVA</Text>                       
                    </View>
                    <TablaADM dataOP={dataOP} />
                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View>
                    <View >
                        <Text style={styles.subreportTitle}>PAGO</Text>                       
                    </View>                   
                    <TablaPagos dataOP={dataOP} />
                 
                    <TablaPie dataOP={dataOP} />
                  
                </Page>
            </Document>
        );
  
  export default orden_de_pago