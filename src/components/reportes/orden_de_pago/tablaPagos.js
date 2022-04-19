import React from 'react';
import {View, Text, Link, StyleSheet } from '@react-pdf/renderer';
import { mostrarFecha } from 'src/utils/utils';

const styles = StyleSheet.create({

  container: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      alignItems: 'center',
      height: 21,
      fontSize: 10,
      textAlign: 'center',
      fontStyle: 'bold',
      flexGrow: 1,
  },


  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 21,
    fontSize: 8,
    fontStyle: 'bold',
  },
  col1: {
      width: '16%',
      textAlign: 'left',
      borderRightWidth: 1,
      paddingLeft: 5,
  },
  col2: {
      width: '20%',
      borderRightWidth: 1,
      textAlign: 'left',
      paddingLeft: 5,
  },
  col3: {
      width: '20%',
      borderRightWidth: 1,
      textAlign: 'left',
      paddingLeft: 5,
  },
  col4: {
    width: '12%',
    borderRightWidth: 1,
    textAlign: 'center',
    paddingLeft: 5,
},
  col5: {
    width: '12%',
    textAlign: 'right',
    paddingRight: 5,
  },
  rowf: {
    flexDirection: 'row',
    borderBottomColor: '#ffffff',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 21,
    fontSize: 8,
    fontStyle: 'bold',
  },
  descriptionf: {
    width: '88%',
    textAlign: 'right',
    borderRightWidth: 1,
    paddingRight: 8,
  },
  totalf: {
    width: '12%',
    textAlign: 'right',
    paddingRight: 8,
  },
});


  const tablaPagos = ({dataOP, bancos, cuentasBanco}) => (
    <View style={{ flexDirection: 'row',flexWrap: 'wrap', marginTop: 8, borderWidth: 1, borderColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff', }}>
       
      <View /* Encabezado*/   
       style={[styles.container, { borderBottomColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff', backgroundColor: dataOP? dataOP?.fideicomisos[0]?.color2:'#ffffff'}]}>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}>Modo</Text>
        <Text style={[styles.col1, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}>Banco</Text>
        <Text style={[styles.col2, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}>Cuenta Nro</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}>Comprobante</Text>
        <Text style={[styles.col4, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}>Fecha</Text>
        <Text style={styles.col5}>Monto</Text>
        
      </View> 

      <View style={[styles.row, { borderBottomColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]} >
      <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.modo1}</Text>
        <Text style={[styles.col1, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.banco1>0? bancos? bancos?.find(i => i.id === parseInt(dataOP?.OPpago?.banco1)).banco:"" :""}</Text>
        <Text style={[styles.col2, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.nro1>0? cuentasBanco? cuentasBanco?.find(i => i.id === parseInt(dataOP?.OPpago?.nro1)).cuentaBanco:"" :""}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> <Link src={dataOP?.OPpago?.descri1} >{dataOP?.OPpago?.descri1? " ver.. -":''}</Link>{" " + dataOP?.OPpago?.descri12? dataOP?.OPpago?.descri12:""}</Text>
        <Text style={[styles.col4, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {mostrarFecha(dataOP?.OPpago?.fecha1)}</Text>            
        <Text style={styles.col5}>{dataOP?.OPpago?.monto1? Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(dataOP?.OPpago?.monto1)):""}</Text>
      </View>

      <View style={[styles.row, { borderBottomColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]} >
      <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.modo2}</Text>
        <Text style={[styles.col1, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.banco2>0? bancos? bancos?.find(i => i.id === parseInt(dataOP?.OPpago?.banco2)).banco:"" :""}</Text>
        <Text style={[styles.col2, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.nro2>0? cuentasBanco? cuentasBanco?.find(i => i.id === parseInt(dataOP?.OPpago?.nro2)).cuentaBanco:"" :""}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> <Link src={dataOP?.OPpago?.descri2} >{dataOP?.OPpago?.descri2? " ver.. -":''}</Link>{" " + dataOP?.OPpago?.descri22? dataOP?.OPpago?.descri22:""}</Text>
        <Text style={[styles.col4, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {mostrarFecha(dataOP?.OPpago?.fecha2)}</Text>            
        <Text style={styles.col5}>{dataOP?.OPpago?.monto2? Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(dataOP?.OPpago?.monto2)):""}</Text>
      </View>

      <View style={[styles.row, { borderBottomColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]} >
      <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.modo3}</Text>
        <Text style={[styles.col1, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.banco3>0? bancos? bancos?.find(i => i.id === parseInt(dataOP?.OPpago?.banco3)).banco:"" :""}</Text>
        <Text style={[styles.col2, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.nro3>0? cuentasBanco? cuentasBanco?.find(i => i.id === parseInt(dataOP?.OPpago?.nro3)).cuentaBanco:"" :""}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> <Link src={dataOP?.OPpago?.descri3} >{dataOP?.OPpago?.descri3? " ver.. -":''}</Link>{" " + dataOP?.OPpago?.descri32? dataOP?.OPpago?.descri32:""}</Text>
        <Text style={[styles.col4, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {mostrarFecha(dataOP?.OPpago?.fecha3)}</Text>            
        <Text style={styles.col5}>{dataOP?.OPpago?.monto3? Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(dataOP?.OPpago?.monto3)):""}</Text>
      </View>

      <View style={[styles.row, { borderBottomColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]} >
      <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.modo4}</Text>
        <Text style={[styles.col1, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.banco4>0? bancos? bancos?.find(i => i.id === parseInt(dataOP?.OPpago?.banco4)).banco:"" :""}</Text>
        <Text style={[styles.col2, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.nro4>0? cuentasBanco? cuentasBanco?.find(i => i.id === parseInt(dataOP?.OPpago?.nro4)).cuentaBanco:"" :""}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> <Link src={dataOP?.OPpago?.descri4} >{dataOP?.OPpago?.descri4? " ver.. -":''}</Link>{" " + dataOP?.OPpago?.descri42? dataOP?.OPpago?.descri42:""}</Text>
        <Text style={[styles.col4, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {mostrarFecha(dataOP?.OPpago?.fecha4)}</Text>            
        <Text style={styles.col5}>{dataOP?.OPpago?.monto4? Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(dataOP?.OPpago?.monto4)):""}</Text>
      </View> 

  

      <View style={styles.rowf}>
            <Text style={[styles.descriptionf,{ borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}>TOTAL</Text>
            <Text style={styles.col5}>{dataOP?.OPpago?.monto1? Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number((parseFloat(dataOP?.OPpago?.monto1? dataOP?.OPpago?.monto1:0) + parseFloat(dataOP?.OPpago?.monto2? dataOP?.OPpago?.monto2:0)+ parseFloat(dataOP?.OPpago?.monto3? dataOP?.OPpago?.monto3:0) + parseFloat(dataOP?.OPpago?.monto4? dataOP?.OPpago?.monto4:0)))):""}</Text>
      </View>
      
      

    </View>
  );
  
  export default tablaPagos