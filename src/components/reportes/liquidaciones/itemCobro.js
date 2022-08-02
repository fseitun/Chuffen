import React from 'react';
import {View, Text, StyleSheet } from '@react-pdf/renderer';
import { mostrarFecha } from 'src/utils/utils';

const styles = StyleSheet.create({


  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 18,
    fontSize: 7,
    fontStyle: 'bold',
  },

  col1: {
    width: '16%',
    //borderRightWidth: 1,
    textAlign: 'center',
    paddingRight: 0,
  },

  col2: {
      width: '36%',
      textAlign: 'left',
      //borderRightWidth: 1,
      paddingLeft: 0,
  },

  col3: {
    width: '12%',
    //borderRightWidth: 1,
    textAlign: 'center',
    paddingRight: 0,
},
  col4: {
    width: '22%',
    textAlign: 'right',
    paddingRight: 0,
  },
  col5: {
    width: '14%',
    textAlign: 'right',
    paddingRight: 0,
  },

});


    var itemCobro = ({conceptosPago, fide, cobros, qntDecimals}) => cobros.map(function(p, i){
      return (
        <View key={'row' + p.numero + i}  style={[styles.row, { borderBottomColor: fide?.color }]} >
          <Text key={'col_a' + i} style={[styles.col1, { borderRightColor: fide?.color }]}>{mostrarFecha(p.fecha)}</Text>
          <Text key={'col_b' + i} style={[styles.col2, { borderRightColor: fide?.color }]}> {conceptosPago?.find(c => c.id === p.concepto)?.descripcion}</Text>
          <Text key={'col_c' + i} style={[styles.col3, { borderRightColor: fide?.color }]}> {p.moneda}</Text>
          <Text key={'col_d' + i} style={[styles.col4, { borderRightColor: fide?.color }]}> {Intl.NumberFormat('es-AR', { minimumFractionDigits: qntDecimals }).format(Number(parseFloat(p.monto)).toFixed(qntDecimals))}</Text>
          <Text key={'col_d' + i} style={[styles.col5, { borderRightColor: fide?.color }]}> {("0000" + p.reciboNum).slice(-4)}</Text>            
          
        </View>  
          );
    });
  
    export default itemCobro