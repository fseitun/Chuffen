import React from 'react';
import {Text, View, StyleSheet} from '@react-pdf/renderer';
import ItemCobro from './itemCobro';
import ItemCuota from './itemCuota';


const styles = StyleSheet.create({

  titulo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 21,
    fontSize: 8,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
},

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
      borderRightWidth: 1,
      paddingLeft: 2,
  },
  col2bis: {
    width: '16%',
    textAlign: 'left',
    borderRightWidth: 1,
    paddingLeft: 2,
  },

  col3: {
    width: '10%',
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
      borderRightWidth: 1,
      paddingLeft: 2,
  },

  cob_col3: {
    width: '14%',
    borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 2,
},
  cob_col4: {
    width: '26%',
    textAlign: 'right',
    paddingRight: 2,
  },

});



  const detalle = ({conceptosPago, conceptosCuota, cont, liq}) => (

 
                
                <View style={{ flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                
                  <View style={{  flexDirection: 'row',flexWrap: 'wrap', width: '53%', marginLeft: 0, marginRight: 35, textAlign: 'center', borderWidth: 0 }} >
                      
                      <View 
                        style={[styles.titulo, { margin: 0}]}>
                        <Text style={[{fontFamily: 'Helvetica-Bold', width: '100%',textAlign: 'left',paddingLeft: 2}]}>DETALLE DE LA CUOTA</Text>
                           
                      </View> 

                      <View /* Encabezado*/   
                        style={[styles.container, { margin: 0, borderBottomColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>
                        <Text style={[styles.col1, { borderRightColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>Fecha</Text>
                        <Text style={[styles.col2, { borderRightColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>Concepto</Text>
                        <Text style={[styles.col2bis, { borderRightColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>V. Unitario</Text>
                        <Text style={[styles.col3, { borderRightColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>Mon.</Text>
                        <Text style={[styles.col4, { borderRightColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>Monto</Text>

                      </View> 

                      <ItemCuota  conceptosCuota={conceptosCuota} fide={cont?.fideicomisos[0]}  cuotas={liq?.data?.cuotas}  ajusteEst={liq?.data?.ajusteEst} ajusteDelt={liq?.data?.ajusteDelt} /> 
                    
                  
                  </View>      

                  <View style={{ flexDirection: 'row',flexWrap: 'wrap', width: '37%', marginLeft: 12, marginRight: 0, textAlign: 'center', borderWidth: 0, borderColor: '#000000', }} >

                      <View 
                        style={[styles.titulo, { margin: 0}]}>
                        <Text style={[{fontFamily: 'Helvetica-Bold', width: '100%',textAlign: 'left',paddingLeft: 2}]}>HISTORIAL DE PAGOS</Text>
                           
                      </View> 
                      <View /* Encabezado*/   
                      style={[styles.container, { margin: 0, borderBottomColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>
                        <Text style={[styles.cob_col1, { borderRightColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>Fecha</Text>
                        <Text style={[styles.cob_col2, { borderRightColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>Concepto</Text>
                        <Text style={[styles.cob_col3, { borderRightColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>Mon.</Text>
                        <Text style={[styles.cob_col4, { borderRightColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>Monto</Text>

                      </View> 
                      <ItemCobro  conceptosPago={conceptosPago} fide={cont?.fideicomisos[0]} cobros={liq?.data?.cobros}  />  
                  </View>              

                </View>         
        );
  
  export default detalle