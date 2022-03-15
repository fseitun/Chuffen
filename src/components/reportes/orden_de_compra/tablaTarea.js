import React from 'react';
import {View, Text, Link, StyleSheet } from '@react-pdf/renderer';
import ItemTarea from './itemTarea';
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
    width: '10%',
    //borderRightColor: '#bff0fd', son 2
    borderRightWidth: 1,
    textAlign: 'center',
    paddingLeft: 5,
  },

  col2: {
      width: '60%',
      textAlign: 'left',
      //borderRightColor: bcolor,
      borderRightWidth: 1,
      paddingLeft: 5,
  },

  col3: {
    width: '15%',
    //borderRightColor: '#bff0fd',
    borderRightWidth: 1,
    textAlign: 'center',
    paddingLeft: 5,
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
    width: '85%',
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


  const tablaTareas = ({dataOC, moneda}) => (

    
    <View style={{ flexDirection: 'row',flexWrap: 'wrap', marginTop: 8, borderWidth: 1, borderColor: dataOC? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff', }}>
       
      <View /* Encabezado*/   
       style={[styles.container, { borderBottomColor: dataOC? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff', backgroundColor: dataOC?.oc? dataOC?.oc?.fideicomisos[0]?.color2:'#ffffff'}]}>
        <Text style={[styles.col1, { borderRightColor: dataOC? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff' }]}>Num</Text>
        <Text style={[styles.col2, { borderRightColor: dataOC? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff' }]}>Tarea</Text>
        <Text style={[styles.col3, { borderRightColor: dataOC? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff' }]}>Fecha</Text>
        <Text style={[styles.col4, { borderRightColor: dataOC? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff' }]}>Monto</Text>

      </View>     

       
      <ItemTarea dataOC={dataOC} color={dataOC? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff'} moneda={moneda} />

      <View style={styles.rowf}>
            <Text style={[styles.descriptionf,{ borderRightColor: dataOC?.oc? dataOC?.oc?.fideicomisos[0]?.color:'#ffffff' }]}>TOTAL</Text>
            <Text style={styles.col4}>{Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(moneda==='ARS'? dataOC?.oc?.monto_ARS:dataOC?.oc?.monto_USD))}</Text>
      </View>
      
      

    </View>
  );
  
  export default tablaTareas