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
    width: '14%',
    borderRightWidth: 1,
    textAlign: 'center',
    paddingRight: 2,
  },

  col2: {
      width: '36%',
      textAlign: 'left',
      borderRightWidth: 1,
      paddingLeft: 2,
  },
  col2bis: {
    width: '16%',
    textAlign: 'right',
    borderRightWidth: 1,
    paddingRight: 2,
},

  col3: {
    width: '10%',
    borderRightWidth: 1,
    textAlign: 'center',
    paddingRight: 0,
},
  col4: {
    width: '24%',
    textAlign: 'right',
    paddingRight: 2,
  },

});


    var itemCobro = ({conceptosCuota, fide, cuotas, ajusteEst, ajusteDelt}) => cuotas.map(function(p, i){
      return (
        <View key={'rowCont' + p.numero + i}  style={[{ margin: 0, borderWidth: 0}]} >

          <View key={'row1' + p.numero + i}  style={[styles.row, { borderBottomColor: fide?.color }]} >

            <Text key={'col_a' + i} style={[styles.col1, { borderRightColor: fide?.color }]}>{mostrarFecha(p.fecha)}</Text>
            <Text key={'col_b' + i} style={[styles.col2, { borderRightColor: fide?.color }]}>{conceptosCuota?.find(c => c.id === p.concepto)?.descripcion}</Text>
            <Text key={'col_c' + i} style={[styles.col2bis, { borderRightColor: fide?.color }]}> {" "}</Text>
            <Text key={'col_d' + i} style={[styles.col3, { borderRightColor: fide?.color }]}> {p.moneda}</Text>
            <Text key={'col_e' + i} style={[styles.col4, { borderRightColor: fide?.color }]}> {Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(p.monto))}</Text>            
            
          </View>  

          <View key={'row2' + p.numero + i}  style={[styles.row, { borderBottomColor: fide?.color }]} >

            <Text key={'col_f' + i} style={[styles.col1, { borderRightColor: fide?.color }]}>{mostrarFecha(p.fecha)}</Text>
            <Text key={'col_g' + i} style={[styles.col2, { borderRightColor: fide?.color }]}> {"Cuota ajuste CAC Estimado"}</Text>
            <Text key={'col_h' + i} style={[styles.col2bis, { borderRightColor: fide?.color }]}>{ajusteEst[i]?.CAC}</Text>
            <Text key={'col_i' + i} style={[styles.col3, { borderRightColor: fide?.color }]}> {p.moneda}</Text>
            <Text key={'col_j' + i} style={[styles.col4, { borderRightColor: fide?.color }]}> {Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(ajusteEst[i]?.monto))}</Text>            

            </View>  

          <View key={'row3' + p.numero + i}  style={[styles.row, { borderBottomColor: fide?.color }]} >

            <Text key={'col_k' + i} style={[styles.col1, { borderRightColor: fide?.color }]}>{mostrarFecha(p.fecha)}</Text>
            <Text key={'col_l' + i} style={[styles.col2, { borderRightColor: fide?.color }]}>{"Cuota ajuste CAC Delta Def."}</Text>
            <Text key={'col_m' + i} style={[styles.col2bis, { borderRightColor: fide?.color }]}>{ajusteDelt[i]?.CAC}</Text>
            <Text key={'col_n' + i} style={[styles.col3, { borderRightColor: fide?.color }]}> {p.moneda}</Text>
            <Text key={'col_o' + i} style={[styles.col4, { borderRightColor: fide?.color }]}> {Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(Number(ajusteDelt[i]?.monto))}</Text>            

          </View>  

        
        </View> 

          );
    });
  
    export default itemCobro