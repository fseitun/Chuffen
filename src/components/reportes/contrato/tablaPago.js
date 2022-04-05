import React from 'react';
import {View, Text, StyleSheet } from '@react-pdf/renderer';
import ItemPago from './itemPago';
// import { mostrarFecha } from 'src/utils/utils';

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
    width: '15%',
    //borderRightColor: '#bff0fd', son 2
    borderRightWidth: 1,
    textAlign: 'center',
    paddingLeft: 5,
  },

  col2: {
      width: '35%',
      textAlign: 'right',
      //borderRightColor: bcolor,
      borderRightWidth: 1,
      paddingRight: 5,
  },

  col3: {
    width: '35%',
    //borderRightColor: '#bff0fd',
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 5,
},
  col4: {
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
    fontSize: 8,
    fontStyle: 'bold',
  },
  descriptionf: {
    width: '15%',
    textAlign: 'right',
    //borderRightColor: '#bff0fd',
    borderRightWidth: 1,
    paddingRight: 8,
  },
  totalf: {
    width: '35%',
    textAlign: 'right',
    paddingRight: 8,
  },
});


  const tablaPagos = ({dataOC, moneda, totARS, totUSD, ajARS, ajUSD}) => (

    
    <View style={{ flexDirection: 'row',flexWrap: 'wrap', marginTop: 8, borderWidth: 1, borderColor: dataOC? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff', }}>
       
      <View /* Encabezado*/   
       style={[styles.container, { borderBottomColor: dataOC? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff', backgroundColor: dataOC?.oc? dataOC?.oc?.fideicomisos[0]?.color2:'#ffffff'}]}>
        <Text style={[styles.col1, { borderRightColor: dataOC? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff' }]}>Num</Text>
        <Text style={[styles.col2, { borderRightColor: dataOC? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff' }]}>Monto Contrato</Text>
        <Text style={[styles.col3, { borderRightColor: dataOC? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff' }]}>Mayor Costo</Text>
        <Text style={[styles.col4, { borderRightColor: dataOC? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff' }]}>Fecha</Text>

      </View>     

       
      <ItemPago dataOC={dataOC} color={dataOC? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff'} moneda={moneda} />
     
      <View style={styles.rowf}>
            <Text style={[styles.col1,{ borderRightColor: dataOC?.oc? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff' }]}>TOTALES</Text>
            <Text style={styles.col2}>{Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(moneda==='ARS'? (totARS-ajARS):(totUSD-ajUSD)))}</Text>
            <Text style={styles.col3}>{Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(moneda==='ARS'? ajARS:ajUSD))}</Text>
            <Text style={styles.col4}> </Text>
      </View>

    </View>
  );
  
  export default tablaPagos