import React from 'react';
import {View, Text, StyleSheet } from '@react-pdf/renderer';

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
      width: '20%',
      textAlign: 'left',
      //borderRightColor: bcolor,
      borderRightWidth: 1,
      paddingLeft: 5,
  },
  col2: {
      width: '25%',
      //borderRightColor: '#bff0fd',
      borderRightWidth: 1,
      textAlign: 'left',
      paddingLeft: 5,
  },
  col3: {
      width: '25%',
      //borderRightColor: '#bff0fd',
      borderRightWidth: 1,
      textAlign: 'left',
      paddingLeft: 5,
  },
  col4: {
    width: '15%',
    //borderRightColor: '#bff0fd',
    borderRightWidth: 1,
    textAlign: 'center',
    paddingLeft: 5,
},
  col5: {
    width: '15%',
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
    width: '85%',
    textAlign: 'right',
    //borderRightColor: '#bff0fd',
    borderRightWidth: 1,
    paddingRight: 8,
  },
  totalf: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
});

  const tablaPagos = ({dataOP}) => (
    <View style={{ flexDirection: 'row',flexWrap: 'wrap', marginTop: 8, borderWidth: 1, borderColor: dataOP?.fideicomisos[0]?.color, }}>
       
      <View /* Encabezado*/   
       style={[styles.container, { borderBottomColor: dataOP?.fideicomisos[0]?.color, backgroundColor: dataOP?.fideicomisos[0]?.color2}]}>
         <Text style={[styles.col1, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}>Banco</Text>
        <Text style={[styles.col2, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}>Nro</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> </Text>
        <Text style={[styles.col4, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}>Fecha</Text>
        <Text style={styles.col5}>Monto</Text>
        
      </View> 
      
      <View style={[styles.row, { borderBottomColor: dataOP?.fideicomisos[0]?.color }]} >
        <Text style={[styles.col1, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.banco1}</Text>
        <Text style={[styles.col2, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.nro1}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.descri1}</Text>
        <Text style={[styles.col4, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.fecha1}</Text>            
        <Text style={styles.col5}>{parseInt(dataOP?.OPpago?.monto1)===0? "": dataOP?.OPpago?.monto1}</Text>
      </View>

      <View style={[styles.row, { borderBottomColor: dataOP?.fideicomisos[0]?.color }]} >
        <Text style={[styles.col1, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.banco2}</Text>
        <Text style={[styles.col2, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.nro2}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.descri2}</Text>
        <Text style={[styles.col4, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.fecha2}</Text>            
        <Text style={styles.col5}>{parseInt(dataOP?.OPpago?.monto2)===0? "": dataOP?.OPpago?.monto2}</Text>
      </View>

      <View style={[styles.row, { borderBottomColor: dataOP?.fideicomisos[0]?.color }]} >
        <Text style={[styles.col1, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.banco3}</Text>
        <Text style={[styles.col2, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.nro3}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.descri3}</Text>
        <Text style={[styles.col4, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.fecha3}</Text>            
        <Text style={styles.col5}>{parseInt(dataOP?.OPpago?.monto3)===0? "": dataOP?.OPpago?.monto3}</Text>
      </View>

      <View style={[styles.row, { borderBottomColor: dataOP?.fideicomisos[0]?.color }]} >
        <Text style={[styles.col1, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.banco4}</Text>
        <Text style={[styles.col2, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.nro4}</Text>
        <Text style={[styles.col3, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.descri4}</Text>
        <Text style={[styles.col4, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataOP?.OPpago?.fecha4}</Text>            
        <Text style={styles.col5}>{parseInt(dataOP?.OPpago?.monto4)===0? "": dataOP?.OPpago?.monto4}</Text>
      </View>

      <View style={styles.rowf}>
            <Text style={[styles.descriptionf,{ borderRightColor: dataOP?.fideicomisos[0]?.color }]}>TOTAL</Text>
            <Text style={styles.totalf}>{(parseInt(dataOP?.OPpago?.monto1? dataOP?.OPpago?.monto1:0) + parseInt(dataOP?.OPpago?.monto2? dataOP?.OPpago?.monto2:0)+ parseInt(dataOP?.OPpago?.monto3? dataOP?.OPpago?.monto3:0) + parseInt(dataOP?.OPpago?.monto4? dataOP?.OPpago?.monto4:0))}</Text>
      </View>

    </View>
  );
  
  export default tablaPagos