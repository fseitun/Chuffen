import React from 'react';
import {View, Text, StyleSheet } from '@react-pdf/renderer';


const styles = StyleSheet.create({

  espacio: { 
    height: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 21,
    fontSize: 10,
    fontStyle: 'bold',
  },
  rowbis: {
    flexDirection: 'row',
    alignItems: 'left',
    height: 24,
    fontSize: 10,
    fontStyle: 'bold',
  },
  col1: {
    width: '33%',
    textAlign: 'right',
    paddingLeft: 8,
  },
  col1bis: {
    width: '33%',
    textAlign: 'right',
    paddingTop: 5,
    paddingLeft: 8,
  },
  col2bis: {
    width: '33%',
    textAlign: 'center',
    backgroundColor: '#B4B4B4',
    paddingTop: 5,
    paddingLeft: 8,
  },
  col3: {
    width: '33%',
    textAlign: 'center',
    paddingLeft: 8,
  },
  col3bis: {
    width: '33%',
    textAlign: 'center',
    paddingTop: 5,
    paddingLeft: 8,
  },

});

  const tablaADM = ({dataOP}) => (
    <View style={{ flexDirection: 'row',flexWrap: 'wrap', marginTop: 8, borderWidth: 1, borderColor: dataOP?.fideicomisos[0]?.color, }} >
          
       <View style={styles.espacio} >
            <Text style={styles.col1}> </Text>
            <Text style={styles.col1}> </Text>
            <Text style={styles.col1}> </Text>
      </View>
       
  
       <View style={styles.row} >
            <Text style={styles.col1}>FACTURAS:</Text>
            <Text style={{ width: '33%', textAlign: 'center',borderBottomColor: dataOP?.fideicomisos[0]?.color, borderBottomWidth: 1, paddingLeft: 8,}} >{dataOP?.monto}</Text>
            <Text style={styles.col3}></Text>
      </View>

      <View style={styles.row} >
            <Text style={styles.col1}>RET SUSS:</Text>
            <Text style={{ width: '33%', textAlign: 'center',borderBottomColor: dataOP?.fideicomisos[0]?.color, borderBottomWidth: 1, paddingLeft: 8,}} >{dataOP?.RET_SUSS}</Text>
            <Text style={styles.col3}></Text>
      </View>

      <View style={styles.row} >
            <Text style={styles.col1}>RET GAN:</Text>
            <Text style={{ width: '33%', textAlign: 'center',borderBottomColor: dataOP?.fideicomisos[0]?.color, borderBottomWidth: 1, paddingLeft: 8,}} >{dataOP?.RET_GAN}</Text>
            <Text style={styles.col3}></Text>
      </View>

      <View style={styles.row} >
            <Text style={styles.col1}>RET IVA:</Text>
            <Text style={{ width: '33%', textAlign: 'center',borderBottomColor: dataOP?.fideicomisos[0]?.color, borderBottomWidth: 1, paddingLeft: 8,}} >{dataOP?.RET_IVA}</Text>
            <Text style={styles.col3}></Text>
      </View>

      <View style={styles.rowbis} >
            <Text style={styles.col1bis}>Monto a Abonar:</Text>
            <Text style={styles.col2bis}>${dataOP?.monto_a_pagar}</Text>
            <Text style={styles.col3bis}>Aprobado por {dataOP.auth_adm[0]? dataOP.auth_adm[0].usuarios[0]?.user:""}</Text>
      </View>

     

    </View>
  );
  
  export default tablaADM