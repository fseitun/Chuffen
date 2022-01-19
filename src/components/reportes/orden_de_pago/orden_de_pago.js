import React from 'react';
import { Page, Document, Image } from '@react-pdf/renderer';
import TablaFacturas from './tablaFacturas';
import TablaTEC from './tablaTEC';
import TablaADM from './tablaADM';
import TablaPagos from './tablaPagos';
import TablaPie from './tablaPie';
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

  var arr_id = [];
  var arr_banco = [];
  var arr_cid = [];
  var arr_cuenta = [];
  
  if(JSON.parse(localStorage.getItem("bancos"))){

    var bancos = JSON.parse(localStorage.getItem("bancos"));
    var banco_en_blanco = {id:0, banco:"", descripcionLarga:"" };
    bancos.push(banco_en_blanco);


    for (var i = 0; i < bancos.length; i++) {
        arr_id.push(bancos[i].id);
        arr_banco.push(bancos[i].banco);
    }   

    var cuentasbanco = JSON.parse(localStorage.getItem("cuentasbanco"));  
    var cuenta_en_blanco = {id: 0,  bancoId: 0,  cuentaBanco: "",  descripcionLarga: "",  bancos: [{banco: ""}]};
    cuentasbanco.push(cuenta_en_blanco);


    for (var j= 0; j < cuentasbanco.length; j++) {
        arr_cid.push(cuentasbanco[j].id);
        arr_cuenta.push(cuentasbanco[j].cuentaBanco);
    } 

  }
  

  const orden_de_pago = ({dataOP, dataFacturas, apiServerUrl, idSociedad}) => (

            <Document >
                <Page size="A4" style={styles.page}> 

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View>  

                    <View style={{flexDirection: 'row',marginLeft: '0',marginRight: '0'}} >
                        <Text style={[styles.reportTitleFide, {width: (dataOP? 100 - dataOP?.fideicomisos[0]?.ancho_logo + '%':'75%'), color: dataOP?.fideicomisos[0]?.color}]}>{dataOP?.fideicomisos[0]?.titulo}</Text>
                        <View style={{width: dataOP? (dataOP?.fideicomisos[0]?.ancho_logo + '%'):'25%' }} >
                        <Image style={[styles.logo, {backgroundColor: dataOP? dataOP?.fideicomisos[0]?.color3:'#FFFFFF' }]} src={{ uri: `${apiServerUrl}/sociedades/${idSociedad}/${dataOP? dataOP?.fideicomisos[0]?.logo:'logo.png'}` , method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }} />                   
                        </View>
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={styles.reportTitle}>SOLICITUD DE PAGO     Nº	{dataOP?.numero}</Text>
                        
                    </View>

                    <View style={styles.invoiceDateContainer}>
                        <Text style={styles.label}>Fecha: </Text>
                        <Text >{mostrarFecha(dataOP?.createdAt)}</Text>
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
                    <TablaPagos dataOP={dataOP} arr_id={arr_id} arr_banco={arr_banco} arr_cid={arr_cid} arr_cuenta={arr_cuenta} />

                    <TablaPie dataOP={dataOP} />

                </Page>
            </Document>
        );
  
  export default orden_de_pago