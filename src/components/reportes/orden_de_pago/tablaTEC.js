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
  col1: {
    width: '11%',
    textAlign: 'left',
    paddingLeft: 8,
  },
  col2: {
    width: '55%',
    textAlign: 'left',
    paddingLeft: 8,
  },
  col3: {
    width: '33%',
    textAlign: 'center',
    paddingLeft: 8,
  },

});



  const tablaTEC = ({dataOP}) => (
    <View style={{ flexDirection: 'row',flexWrap: 'wrap', marginTop: 8, borderWidth: 1, borderColor: dataOP? dataOP?.fideicomisos[0]?.color:'#ffffff', }} >
       
       <View style={styles.espacio} >
            <Text style={styles.col1}> </Text>
            <Text style={styles.col1}> </Text>
            <Text style={styles.col1}> </Text>
      </View>

      <View style={styles.row} >
            <Text style={styles.col1}>Detalles:</Text>
            <Text style={styles.col2}>{dataOP?.descripcion?.slice(0, 44)}</Text>
            <Text style={styles.col3}></Text>
      </View>
       
  
       <View style={styles.row} >
            <Text style={styles.col1}></Text>
            <Text style={styles.col2}>{dataOP?.descripcion?.slice(45, 99)}</Text>
            <Text style={styles.col3}>Aprobado por {dataOP?.auth_obra[0]?.usuarios[0]?.user}</Text>
      </View>    

    </View>
  );
  
  export default tablaTEC