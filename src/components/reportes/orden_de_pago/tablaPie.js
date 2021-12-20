import React from 'react';
import {View, Text, StyleSheet } from '@react-pdf/renderer';


const tableRowsCount = 11;
const borderColor = '#90e5fc';
const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,

    
    },
    container: {
      flexDirection: 'row',

      borderBottomWidth: 1,
      alignItems: 'center',
      height: 21,
      textAlign: 'center',
      fontStyle: 'bold',
      flexGrow: 1,
  },
  description: {
      width: '60%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
  },
  qty: {
      width: '10%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
  },
  rate: {
      width: '15%',
      borderRightColor: borderColor,
      borderRightWidth: 1,
  },
  amount: {
      width: '15%'
  },

  espacio: { 
    height: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 15,
    fontSize: 7,
    fontStyle: 'bold',
  },

  col1: {
    width: '30%',
    textAlign: 'right',
    paddingLeft: 8,
  },
  col2: {
    width: '30%',
    textAlign: 'left',

    paddingLeft: 8,
  },

  col3: {
    width: '40%',
    textAlign: 'left',
    paddingLeft: 8,
  },


});

  const tablaPie = ({dataOP}) => (
    <View style={styles.tableContainer}>

       <View style={styles.row} >
            <Text style={styles.col1}>CBU:</Text>
            <Text style={styles.col2}>{dataOP?.empresas[0]?.CBU}</Text>
            <Text style={styles.col3}>Cuenta Bancaria: {dataOP?.empresas[0]?.nroCuenta}</Text>
      </View>

      <View style={styles.row} >
            <Text style={styles.col1}>CUIT:</Text>
            <Text style={styles.col2}>{dataOP?.empresas[0]?.CUIT}</Text>
            <Text style={styles.col3}>Email:   {dataOP?.empresas[0]?.mail}</Text>
      </View>      
     

    </View>
  );
  
  export default tablaPie