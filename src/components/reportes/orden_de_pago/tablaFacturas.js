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
    //borderBottomColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 21,
    fontSize: 10,
    fontStyle: 'bold',
  },
  description: {
      width: '55%',
      textAlign: 'left',
      //borderRightColor: '#bff0fd',
      borderRightWidth: 1,
      paddingLeft: 8,
  },
  qty: {
      width: '15%',
      //borderRightColor: '#bff0fd',
      borderRightWidth: 1,
      textAlign: 'right',
      paddingRight: 8,
  },
  rate: {
      width: '15%',
      //borderRightColor: '#bff0fd',
      borderRightWidth: 1,
      textAlign: 'right',
      paddingRight: 8,
  },
  amount: {
    width: '15%'
},
  amountRow: {
      width: '15%',
      textAlign: 'right',
      paddingRight: 8,
  },
});

  const tablaFacturas = ({dataOP, dataFacturas}) => (
   
   <View style={{ flexDirection: 'row',flexWrap: 'wrap', marginTop: 8, borderWidth: 1, borderColor: dataOP?.fideicomisos[0]?.color, }}>
       
       <View /* Encabezado*/   
       style={[styles.container, { borderBottomColor: dataOP?.fideicomisos[0]?.color, backgroundColor: dataOP?.fideicomisos[0]?.color2}]}>
            <Text style={[styles.description, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}>Proveedor</Text>
            <Text style={[styles.qty, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}>Detalle</Text>
            <Text style={[styles.rate, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}>Nº Factura</Text>
            <Text style={[styles.rate, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}>Nº OC</Text>
            <Text style={[styles.amount, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}>Importe</Text>
      </View>
  
      <View  /* 5 filas fijas de factura */      
             style={[styles.row, { borderBottomColor: dataOP?.fideicomisos[0]?.color }]} >
            <Text style={[styles.description, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[0]?.empresas[0].razonSocial}</Text>
            <Text style={[styles.qty, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[0]?.detalle}</Text>
            <Text style={[styles.rate, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[0]?.numero}</Text>
            <Text style={[styles.rate, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[0]?.txtOC}</Text>
            <Text style={[styles.amountRow, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[0]?.montoTotal}</Text>
      </View>

      <View    
             style={[styles.row, { borderBottomColor: dataOP?.fideicomisos[0]?.color }]} >
            <Text style={[styles.description, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[1]?.empresas[0].razonSocial}</Text>
            <Text style={[styles.qty, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[1]?.detalle}</Text>
            <Text style={[styles.rate, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[1]?.numero}</Text>
            <Text style={[styles.rate, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[1]?.txtOC}</Text>
            <Text style={[styles.amountRow, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[1]?.montoTotal}</Text>
      </View>

      <View  
             style={[styles.row, { borderBottomColor: dataOP?.fideicomisos[0]?.color }]} >
            <Text style={[styles.description, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[2]?.empresas[0].razonSocial}</Text>
            <Text style={[styles.qty, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[2]?.detalle}</Text>
            <Text style={[styles.rate, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[2]?.numero}</Text>
            <Text style={[styles.rate, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[2]?.txtOC}</Text>
            <Text style={[styles.amountRow, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[2]?.montoTotal}</Text>
      </View>

      <View      
             style={[styles.row, { borderBottomColor: dataOP?.fideicomisos[0]?.color }]} >
            <Text style={[styles.description, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[3]?.empresas[0].razonSocial}</Text>
            <Text style={[styles.qty, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[3]?.detalle}</Text>
            <Text style={[styles.rate, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[3]?.numero}</Text>
            <Text style={[styles.rate, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[3]?.txtOC}</Text>
            <Text style={[styles.amountRow, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[3]?.montoTotal}</Text>
      </View> 

      <View  /* fin 5 filas fijas de factura */      
             style={[styles.row, { borderBottomColor: dataOP?.fideicomisos[0]?.color }]} >
            <Text style={[styles.description, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[4]?.empresas[0].razonSocial}</Text>
            <Text style={[styles.qty, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[4]?.detalle}</Text>
            <Text style={[styles.rate, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[4]?.numero}</Text>
            <Text style={[styles.rate, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[4]?.txtOC}</Text>
            <Text style={[styles.amountRow, { borderRightColor: dataOP?.fideicomisos[0]?.color }]}> {dataFacturas?.item[4]?.montoTotal}</Text>
      </View>

    </View>
  );
  
  export default tablaFacturas