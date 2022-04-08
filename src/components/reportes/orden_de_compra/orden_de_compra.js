import React from 'react';
import { Page, Document, Image } from '@react-pdf/renderer';
/*
import TablaFacturas from './tablaFacturas';
import TablaTEC from './tablaTEC';
import TablaADM from './tablaADM';
import TablaCompra from './tablaCompra';*/
import TablaTarea from './tablaTarea';
import TablaPago from './tablaPago';
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

  var arr_id = [];
  var arr_banco = [];
  var arr_cid = [];
  var arr_cuenta = [];
  
  if(JSON.parse(localStorage.getItem("bs"))){

    var bancos = JSON.parse(localStorage.getItem("bs"));
    var banco_en_blanco = {id:0, banco:"", descripcionLarga:"" };
    bancos.push(banco_en_blanco);


    for (var i = 0; i < bancos.length; i++) {
        arr_id.push(bancos[i].id);
        arr_banco.push(bancos[i].banco);
    }   

    var cuentasbanco = JSON.parse(localStorage.getItem("co"));  
    var cuenta_en_blanco = {id: 0,  bancoId: 0,  cuentaBanco: "",  descripcionLarga: "",  bancos: [{banco: ""}]};
    cuentasbanco.push(cuenta_en_blanco);


    for (var j= 0; j < cuentasbanco.length; j++) {
        arr_cid.push(cuentasbanco[j].id);
        arr_cuenta.push(cuentasbanco[j].cuentaBanco);
    } 

  }
  

  const orden_de_compra = ({dataOC, apiServerUrl, idSociedad, moneda, totARS, totUSD, ajARS, ajUSD}) => (

            <Document >
                <Page size="A4" style={styles.page}>

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View>      

                    <View style={{flexDirection: 'row',marginLeft: '0',marginRight: '0'}} >
                        <Text style={[styles.reportTitleFide, {width: (dataOC?.oc? 100 - dataOC?.oc?.fideicomisos[0]?.ancho_logo + '%':'75%'), color: dataOC?.oc?.fideicomisos[0]?.color}]}>{dataOC?.oc?.fideicomisos[0]?.titulo}</Text>
                      
                        <View style={{width: dataOC? (80 + '%'):'25%' }} >
                          <Image style={[styles.logo, {backgroundColor: dataOC?.oc? dataOC?.oc?.fideicomisos[0]?.color3:'#FFFFFF' }]}
                               src={{ uri: `${apiServerUrl}/sociedades/${idSociedad}/${dataOC?.oc? dataOC?.oc?.fideicomisos[0]?.logo:'logo.png'}` , method: "GET", body: "" }} /> 
                        </View>

                    </View>

                    <View style={styles.invoiceDateContainer}>
                        <Text style={styles.label}>Fecha: </Text>
                        <Text >{mostrarFecha(dataOC?.oc?.createdAt)}</Text>
                    </View >
                    <View style={styles.titleContainer}>
                        <Text style={styles.reportTitle}>ORDEN DE COMPRA Nº	{dataOC?.oc?.id}</Text>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.subreportTitle}>Razón social: {dataOC?.oc?.empresas[0]?.razonSocial}</Text>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.subreportTitle}>Monto total: { Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(moneda==='ARS'? dataOC?.oc?.monto_ARS:dataOC?.oc?.monto_USD))}  {moneda==='ARS'? 'pesos':'dolares'}</Text>
                    </View>
                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 
                    <View >
                        <Text style={styles.subreportTitle}>TAREAS</Text>                       
                    </View>

                    <TablaTarea dataOC={dataOC}  moneda={moneda} />

                    <View >
                        <Text style={styles.saltolinea}> </Text>                       
                    </View> 
                    <View >
                        <Text style={styles.subreportTitle}>PAGOS</Text>                       
                    </View>

                    <TablaPago dataOC={dataOC}  moneda={moneda}  totARS={totARS}  totUSD={totUSD}  ajARS={ajARS} ajUSD={ajUSD} />
                </Page>
            </Document>
        );
  
  export default orden_de_compra