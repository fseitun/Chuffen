import React from 'react';
import { Page, Document } from '@react-pdf/renderer';

import {Text, View, StyleSheet } from '@react-pdf/renderer';
import { mostrarFecha } from 'src/utils/utils';


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
  

  const certificado = ({tipo, data}) => (

            <Document >
                <Page size="A4" style={styles.page}>

                <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View>      

                    <View style={{flexDirection: 'row',marginLeft: '0',marginRight: '0'}} >
                       
                    </View>
                   
                    <View style={styles.titleContainer}>
                        <Text style={styles.reportTitle}>Control de Retenciones</Text>
                    </View>

                    <View style={styles.invoiceDateContainer}>
                        <Text style={styles.label}>Fecha de Retención: {mostrarFecha(data?.general?.fecha)}</Text>                        
                    </View >
           
                    <View style={styles.invoiceDateContainer}>
                        <Text style={styles.label}>Certificado N°: {data?.numero}</Text>                        
                    </View >                    

                    <View style={styles.titleContainer}>
                        <Text style={styles.subreportTitle}>A. - Datos del Agente de Retención</Text>
                    </View>

                    <View >
                        <Text style={styles.label}>Apellido y Nombre o Denominación: {data?.general?.agente}</Text>
                        <Text style={styles.label}>C.U.I.T. N°: {data?.general?.agente_cuit}</Text>
                        <Text style={styles.label}>Domicilio: {data?.general?.agente_dir}</Text>
                    </View >


                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 
                    <View >
                        <Text style={styles.subreportTitle}>B. - Datos del Sujeto Retenido</Text>                       
                    </View>

                    <View >
                        <Text style={styles.label}>Apellido y Nombre o Denominación: {data?.general?.sujeto}</Text>
                        <Text style={styles.label}>C.U.I.T. N°: {data?.general?.sujeto_cuit}</Text>
                        <Text style={styles.label}>Domicilio: {data?.general?.sujeto_dir}</Text>
                    </View >

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 
                    <View >
                        <Text style={styles.subreportTitle}>C. - Datos de la Retención Practicada</Text>                       
                    </View>
                    
                    <View >
                        <Text style={styles.label}>Impuesto: {data?.impuesto}</Text>
                        <Text style={styles.label}>Régimen: {data?.regimen}</Text>
                        <Text style={styles.label}>Comp. que origina la Retención: {data?.comp_origen}</Text>
                    </View >

                    <View >
                        <Text style={styles.label}>{data?.Fila1}</Text>
                        <Text style={styles.label}>{data?.Fila2}</Text>
                        <Text style={styles.label}>{data?.Fila3}</Text>
                        <Text style={styles.label}>{data?.Fila4}</Text>
                    </View >

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 

                    <View >
                        <Text style={styles.label}>Monto de la Retención :{ Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(data?.monto))} pesos</Text>
                    </View >

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 
                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 

                    <View >
                        <Text style={styles.label}>Firma del Agente de Retención :</Text>
                        <Text style={styles.label}>Aclaración :</Text>
                        <Text style={styles.label}>Cargo :</Text>
                    </View >

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 
                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 

                    <View >
                        <Text style={styles.label}>El presente certificado se expide sobre la base de los datos declarados y aportados por el Agente de Retención a la fecha de la presente consulta, el cual podría ser pasible de modificaciones por el agente en cuestión. </Text>
                     
                    </View >

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 

                    <View >
                        <Text style={styles.label}>Conserve este Certificado como comprobante de Retención/Percepción. </Text>
                     
                    </View >

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 
                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 

                    <View style={styles.invoiceDateContainer}>
                        <Text style={styles.label}>Fecha de Emisión e Impresión: {mostrarFecha(data?.general?.fecha)}</Text>                        
                    </View >

              

                </Page>
            </Document>
        );
  
  export default certificado