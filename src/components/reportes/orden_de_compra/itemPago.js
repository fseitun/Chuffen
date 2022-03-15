import React from 'react';
import {View, Text, Link, StyleSheet } from '@react-pdf/renderer';
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


  // const tablaTareas = ({dataOC, moneda}) => (
    var itemPago = ({dataOC, color, moneda}) => dataOC.pago.filter(p => p.moneda===moneda).map(function(p, i){
      return (
        <View style={[styles.row, { borderBottomColor: color }]} >
        <Text style={[styles.col1, { borderRightColor: color }]}> {p.numero}</Text>
        <Text style={[styles.col2, { borderRightColor: color }]}> {Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(p.monto))}</Text>
        <Text style={[styles.col3, { borderRightColor: color }]}> {Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(p.ajuste))}</Text>            
        <Text style={styles.col4}>{mostrarFecha(p.createdAt)}</Text>
      </View>  
          );
    });
  
    export default itemPago