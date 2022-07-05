import React from 'react';
import {Text, View, StyleSheet} from '@react-pdf/renderer';
import ItemCobro from './itemCobro';
import ItemCuota from './itemCuota';


const styles = StyleSheet.create({

  container: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      alignItems: 'center',
      height: 21,
      fontSize: 8,
      textAlign: 'center',
      fontStyle: 'bold',
      flexGrow: 1,
  },


  col1: {
    width: '14%',
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 2,
  },

  col2: {
      width: '36%',
      textAlign: 'left',
      //borderRightColor: bcolor,
      borderRightWidth: 1,
      paddingLeft: 2,
  },
  col2bis: {
    width: '16%',
    textAlign: 'left',
    //borderRightColor: bcolor,
    borderRightWidth: 1,
    paddingLeft: 2,
  },

  col3: {
    width: '10%',
    //borderRightColor: '#bff0fd',
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 2,
},
  col4: {
    width: '24%',
    textAlign: 'right',
    paddingRight: 2,
  },

  cob_col1: {
    width: '18%',
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 2,
  },

  cob_col2: {
      width: '42%',
      textAlign: 'left',
      //borderRightColor: bcolor,
      borderRightWidth: 1,
      paddingLeft: 2,
  },

  cob_col3: {
    width: '14%',
    //borderRightColor: '#bff0fd',
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 2,
},
  cob_col4: {
    width: '26%',
    textAlign: 'right',
    paddingRight: 2,
  },
  /*
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
  },*/
});



  const detalle = ({conceptosPago, conceptosCuota, cont, liq}) => (

 
                
                <View style={{ flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                
                  <View style={{  flexDirection: 'row',flexWrap: 'wrap', width: '100%', marginLeft: 0, marginRight: 0, textAlign: 'center', borderWidth: 0, borderColor: '#000000', }} >
                      
                      <View 
                        style={[styles.container, { margin: 0, borderBottomColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff'}]}>
                        <Text style={[{width: '100%',textAlign: 'left',paddingLeft: 2}]}>DATOS DEL FIDUCIANTE</Text>
                           
                      </View> 

                      <View /* Encabezado*/   
                        style={[styles.container, { margin: 0, borderBottomColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>
                        <Text style={[styles.col1, { borderRightColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>Fecha</Text>
                        <Text style={[styles.col2, { borderRightColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>Concepto</Text>
                        <Text style={[styles.col2bis, { borderRightColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>V. Unitario</Text>
                        <Text style={[styles.col3, { borderRightColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>Mon.</Text>
                        <Text style={[styles.col4, { borderRightColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>Monto</Text>

                      </View> 


                    
                  
                  </View>      

                       

                </View>   


      
        );
  
  export default detalle