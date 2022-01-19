import React from 'react';
import {View, Text, StyleSheet } from '@react-pdf/renderer';
import { mostrarFecha } from 'src/utils/utils';

const styles = StyleSheet.create({

  container: {
      flexDirection: 'row',
      //borderBottomColor: '#bff0fd',
      //backgroundColor: '#bff0fd',
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
    // borderBottomColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 21,
    fontSize: 8,
    fontStyle: 'bold',
  },
  col1: {
      width: '16%',
      textAlign: 'left',
      //borderRightColor: bcolor,
      borderRightWidth: 1,
      paddingLeft: 5,
  },
  col2: {
      width: '20%',
      //borderRightColor: '#bff0fd',
      borderRightWidth: 1,
      textAlign: 'left',
      paddingLeft: 5,
  },
  col3: {
      width: '20%',
      //borderRightColor: '#bff0fd', son 2
      borderRightWidth: 1,
      textAlign: 'left',
      paddingLeft: 5,
  },
  col4: {
    width: '12%',
    //borderRightColor: '#bff0fd',
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
    fontSize: 10,
    fontStyle: 'bold',
  },
  descriptionf: {
    width: '88%',
    textAlign: 'right',
    //borderRightColor: '#bff0fd',
    borderRightWidth: 1,
    paddingRight: 8,
  },
  totalf: {
    width: '12%',
    textAlign: 'right',
    paddingRight: 8,
  },
});


  const tablaPagos = ({dataOP, arr_id, arr_banco, arr_cid, arr_cuenta}) => (
    <View style={{ flexDirection: 'row',flexWrap: 'wrap', marginTop: 8, borderWidth: 1, borderColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff', }}>
       
      <View /* Encabezado*/   
       style={[styles.container, { borderBottomColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff', backgroundColor: dataOP? dataOP?.fideicomisos[0]?.color2:'#ffffff'}]}>
         <Text style={[styles.col1, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}>Banco</Text>
        <Text style={[styles.col2, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}>Cuenta Nro</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}>Comprobante</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}>Modo</Text>
        <Text style={[styles.col4, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}>Fecha</Text>
        <Text style={styles.col5}>Monto</Text>
        
      </View> 

      <View style={[styles.row, { borderBottomColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]} >
        <Text style={[styles.col1, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {arr_banco[arr_id.indexOf(dataOP?.OPpago?.banco1)]}</Text>
        <Text style={[styles.col2, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {arr_cuenta[arr_cid.indexOf(dataOP?.OPpago?.nro1)]}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.descri1}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.modo1}</Text>
        <Text style={[styles.col4, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {mostrarFecha(dataOP?.OPpago?.fecha1)}</Text>            
        <Text style={styles.col5}>{parseInt(dataOP?.OPpago?.monto1)===0? "": dataOP?.OPpago?.monto1}</Text>
      </View>

      <View style={[styles.row, { borderBottomColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]} >
        <Text style={[styles.col1, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {arr_banco[arr_id.indexOf(dataOP?.OPpago?.banco2)]}</Text>
        <Text style={[styles.col2, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {arr_cuenta[arr_cid.indexOf(dataOP?.OPpago?.nro2)]}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.descri2}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.modo2}</Text>
        <Text style={[styles.col4, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {mostrarFecha(dataOP?.OPpago?.fecha2)}</Text>            
        <Text style={styles.col5}>{parseInt(dataOP?.OPpago?.monto1)===0? "": dataOP?.OPpago?.monto2}</Text>
      </View>

      <View style={[styles.row, { borderBottomColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]} >
        <Text style={[styles.col1, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {arr_banco[arr_id.indexOf(dataOP?.OPpago?.banco3)]}</Text>
        <Text style={[styles.col2, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {arr_cuenta[arr_cid.indexOf(dataOP?.OPpago?.nro3)]}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.descri3}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.modo3}</Text>
        <Text style={[styles.col4, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {mostrarFecha(dataOP?.OPpago?.fecha3)}</Text>            
        <Text style={styles.col5}>{parseInt(dataOP?.OPpago?.monto1)===0? "": dataOP?.OPpago?.monto3}</Text>
      </View>

      <View style={[styles.row, { borderBottomColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]} >
        <Text style={[styles.col1, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {arr_banco[arr_id.indexOf(dataOP?.OPpago?.banco4)]}</Text>
        <Text style={[styles.col2, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {arr_cuenta[arr_cid.indexOf(dataOP?.OPpago?.nro4)]}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.descri4}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {dataOP?.OPpago?.modo4}</Text>
        <Text style={[styles.col4, { borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}> {mostrarFecha(dataOP?.OPpago?.fecha4)}</Text>            
        <Text style={styles.col5}>{parseInt(dataOP?.OPpago?.monto1)===0? "": dataOP?.OPpago?.monto4}</Text>
      </View>

   

      <View style={styles.rowf}>
            <Text style={[styles.descriptionf,{ borderRightColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff' }]}>TOTAL</Text>
            <Text style={styles.totalf}>{(parseInt(dataOP?.OPpago?.monto1? dataOP?.OPpago?.monto1:0) + parseInt(dataOP?.OPpago?.monto2? dataOP?.OPpago?.monto2:0)+ parseInt(dataOP?.OPpago?.monto3? dataOP?.OPpago?.monto3:0) + parseInt(dataOP?.OPpago?.monto4? dataOP?.OPpago?.monto4:0))}</Text>
      </View>
      
      

    </View>
  );
  
  export default tablaPagos