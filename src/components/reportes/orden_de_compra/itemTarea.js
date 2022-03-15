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


  // const tablaTareas = ({dataOC, moneda}) => (
    var itemTarea = ({dataOC, color, moneda}) => dataOC.item.filter(p => p.moneda===moneda).map(function(p, i){
      return (      

            <View style={[styles.row, { borderBottomColor: color }]} >
            <Text style={[styles.col1, { borderRightColor: color }]}> {p.numero}</Text>
            <Text style={[styles.col2, { borderRightColor: color }]}> {p.descripcion}</Text>
            <Text style={[styles.col3, { borderRightColor: color }]}> {mostrarFecha(p.createdAt)}</Text>            
            <Text style={styles.col4}>{Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(p.monto))}</Text>
            </View>  
          );
    });
  
    export default itemTarea