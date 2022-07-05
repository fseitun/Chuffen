import React from 'react';
import {View, Text, StyleSheet } from '@react-pdf/renderer';
import { mostrarFecha } from 'src/utils/utils';

const styles = StyleSheet.create({


  row: {
    flexDirection: 'row',
    // borderBottomColor: '#bff0fd',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 18,
    fontSize: 7,
    fontStyle: 'bold',
  },

  col1: {
    width: '18%',
    borderRightWidth: 1,
    textAlign: 'center',
    paddingRight: 2,
  },

  col2: {
      width: '42%',
      textAlign: 'left',
      borderRightWidth: 1,
      paddingLeft: 2,
  },

  col3: {
    width: '14%',
    borderRightWidth: 1,
    textAlign: 'center',
    paddingRight: 0,
},
  col4: {
    width: '26%',
    textAlign: 'right',
    paddingRight: 2,
  },

});


    var itemCobro = ({conceptosPago, fide, cobros}) => cobros.map(function(p, i){
      return (
        <View key={'row' + p.numero + i}  style={[styles.row, { borderBottomColor: fide?.color }]} >
          <Text key={'col_a' + i} style={[styles.col1, { borderRightColor: fide?.color }]}>{mostrarFecha(p.fecha)}</Text>
          <Text key={'col_b' + i} style={[styles.col2, { borderRightColor: fide?.color }]}> {conceptosPago?.find(c => c.id === p.concepto)?.descripcion}</Text>
          <Text key={'col_c' + i} style={[styles.col3, { borderRightColor: fide?.color }]}> {p.moneda}</Text>
          <Text key={'col_d' + i} style={[styles.col4, { borderRightColor: fide?.color }]}> {Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(p.monto))}</Text>            
          
        </View>  
          );
    });
  
    export default itemCobro