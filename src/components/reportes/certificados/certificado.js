import React from 'react';
import { Page, Document, Image } from '@react-pdf/renderer';

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
        height: 44,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    titleContainer:{
      flexDirection: 'row',
      marginTop: 24,
    },
    reportTitle:{
        color: '#101010',
        // letterSpacing: 4,
        fontSize: 18,
        textAlign: 'center',
        // height: 22,
        // marginTop: 15,
        // textTransform: 'uppercase',
    },

    subreportTitle:{
      color: '#101010',
      letterSpacing: 2,
      fontSize: 12,
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
    rowf: {
        flexDirection: 'row',
        borderBottomColor: '#ffffff',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 19,
        fontSize: 10,
        fontStyle: 'bold',
      },
    rowlight: {
        flexDirection: 'row',
        borderBottomColor: '#ffffff',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 15,
        fontSize: 9,
    },
    col1: {
        width: '37%',
        //borderRightColor: '#bff0fd', son 2
        //borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 3,
      },
    
      col2: {
          width: '63%',
          textAlign: 'left',
          //borderRightColor: bcolor,
          //borderRightWidth: 1,
          fontFamily: 'Helvetica-Bold',
          paddingLeft: 15,
      },
      col2i: {
        width: '63%',
        textAlign: 'left',
        //borderRightColor: bcolor,
        //borderRightWidth: 1,
        fontFamily: 'Helvetica-Oblique',
        paddingLeft: 15,
    },

      col2plus: {
        width: '63%',
        textAlign: 'left',
        fontFamily: 'Helvetica-Bold',
        fontSize: 12,
        paddingLeft: 15,
    },

  });  
  

  const certificado = ({data, apiServerUrl}) => (

            <Document >
                <Page size="A4" style={styles.page}>

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View>      

                    <View style={{flexDirection: 'row',marginLeft: '0',marginRight: '0'}} >
                       
                    </View>

                   
                   
                    <View style={styles.titleContainer}>

                        <View style={{width: '30%' }} >
                                <Image style={[styles.logo]} src={{ uri: `${apiServerUrl}/sociedades/afip.png` , method: "GET", body: "" }} />                   
                        </View>
                        <View style={{width: '70%' }}>
                            <View >
                                <Text style={styles.reportTitle}> SI.CO.RE. - Sistema de Control
                                </Text>
                            </View>
                            <View >
                                <Text style={styles.reportTitle}> de Retenciones
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
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

                    <View style={styles.rowf} >
                         <Text style={styles.col1}>Apellido y Nombre o Denominación:</Text>
                         <Text style={styles.col2}>{data?.general?.agente}</Text>
                    </View >
                    <View style={styles.rowf} >
                         <Text style={styles.col1}>C.U.I.T. N°:</Text>
                         <Text style={styles.col2}>{data?.general?.agente_cuit}</Text>
                    </View >
                    <View style={styles.rowf} >
                         <Text style={styles.col1}>Domicilio:</Text>
                         <Text style={styles.col2}>{data?.general?.agente_dir}</Text>
                    </View >

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 
                    <View >
                        <Text style={styles.subreportTitle}>B. - Datos del Sujeto Retenido</Text>                       
                    </View>

                    <View style={styles.rowf} >
                         <Text style={styles.col1}>Apellido y Nombre o Denominación:</Text>
                         <Text style={styles.col2}>{data?.general?.sujeto}</Text>
                    </View >
                    <View style={styles.rowf} >
                         <Text style={styles.col1}>C.U.I.T. N°:</Text>
                         <Text style={styles.col2}>{data?.general?.sujeto_cuit}</Text>
                    </View >
                    <View style={styles.rowf} >
                         <Text style={styles.col1}>Domicilio:</Text>
                         <Text style={styles.col2}>{data?.general?.sujeto_dir}</Text>
                    </View >



                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 
                    <View >
                        <Text style={styles.subreportTitle}>C. - Datos de la Retención Practicada</Text>                       
                    </View>

                    <View style={styles.rowf} >
                         <Text style={styles.col1}>Impuesto:</Text>
                         <Text style={styles.col2}>{data?.impuesto}</Text>
                    </View >
                    <View style={styles.rowf} >
                         <Text style={styles.col1}>Régimen:</Text>
                         <Text style={styles.col2}>{data?.regimen}</Text>
                    </View >
                    <View style={styles.rowf} >
                         <Text style={styles.col1}>Comp. que origina la Retención:</Text>
                         <Text style={styles.col2}>{data?.general?.comp_origen}</Text>
                    </View >

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 

                    <View style={styles.rowlight} >
                         <Text style={styles.col1}></Text>
                         <Text style={styles.col2i}>{data?.Fila1}</Text>
                    </View >
                    <View style={styles.rowlight} >
                         <Text style={styles.col1}></Text>
                         <Text style={styles.col2i}>{data?.Fila2}</Text>
                    </View >
                    <View style={styles.rowlight} >
                         <Text style={styles.col1}></Text>
                         <Text style={styles.col2i}>{data?.Fila3}</Text>
                    </View >
                    <View style={styles.rowlight} >
                         <Text style={styles.col1}></Text>
                         <Text style={styles.col2i}>{data?.Fila4}</Text>
                    </View >

                

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 

                    <View style={styles.rowf} >
                         <Text style={styles.col1}>Monto de la Retención:</Text>
                         <Text style={styles.col2plus}>{ Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(data?.monto))} pesos</Text>
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
                        <Text style={[styles.label, { borderRightColor: '#0000ff' }]} >El presente certificado se expide sobre la base de los datos declarados y aportados por el Agente de Retención a la fecha de la presente consulta, el cual podría ser pasible de modificaciones por el agente en cuestión. </Text>
                     
                    </View >

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 

                    <View >
                        <Text style={[styles.label, { borderRightColor: '#0000ff' }]}>Conserve este Certificado como comprobante de Retención/Percepción. </Text>
                     
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