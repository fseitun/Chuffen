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
    //borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 2,
  },

  col2: {
      width: '36%',
      textAlign: 'left',
      //borderRightWidth: 1,
      paddingLeft: 0,
  },
  col2bis: {
    width: '16%',
    textAlign: 'left',
    //borderRightWidth: 1,
    paddingLeft: 0,
  },

  col3: {
    width: '10%',
    //borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 0,
},
  col4: {
    width: '24%',
    textAlign: 'right',
    paddingRight: 0,
  },

  cob_col1: {
    width: '16%',
    //borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 0,
  },

  cob_col2: {
      width: '36%',
      textAlign: 'left',
      //borderRightWidth: 1,
      paddingLeft: 0,
  },

  cob_col3: {
    width: '12%',
    //borderRightWidth: 1,
    textAlign: 'left',
    paddingLeft: 0,
},
  cob_col4: {
    width: '22%',
    textAlign: 'right',
    paddingRight: 2,
  },
  cob_col5: {
    width: '14%',
    textAlign: 'right',
    paddingRight: 0,
  },

});



  const detalle = ({conceptosPago, conceptosCuota, cont, liq, qntDecimals}) => (

 
                
                <View style={{ flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                
                  <View style={{  flexDirection: 'row',flexWrap: 'wrap', width: '53%', marginLeft: 0, marginRight: 35, textAlign: 'center', borderWidth: 0 }} >
                      
                      <View 
                        style={[styles.titulo, { margin: 0}]}>
                        <Text style={[{fontFamily: 'Helvetica-Bold', width: '100%',textAlign: 'left',paddingLeft: 2}]}>DETALLE DE LA CUOTA</Text>
                           
                      </View> 

                      <View /* Encabezado*/   
                        style={[styles.container, { margin: 0, borderBottomColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>
                        <Text style={[styles.col1, ]}>Fecha</Text>
                        <Text style={[styles.col2, ]}>Concepto</Text>
                        <Text style={[styles.col2bis, ]}>Indice CAC</Text>
                        <Text style={[styles.col3, ]}>Mon.</Text>
                        <Text style={[styles.col4, ]}>Monto</Text>

                      </View> 

                      <ItemCuota  qntDecimals={qntDecimals}  conceptosCuota={conceptosCuota} fide={cont?.fideicomisos[0]}  cuotas={liq?.data?.cuotas}  ajusteEst={liq?.data?.ajusteEst} ajusteDelt={liq?.data?.ajusteDelt} /> 
                    
                  
                  </View>      

                  <View style={{ flexDirection: 'row',flexWrap: 'wrap', width: '37%', marginLeft: 12, marginRight: 0, textAlign: 'center', borderWidth: 0, borderColor: '#000000', }} >

                      <View 
                        style={[styles.titulo, { margin: 0}]}>
                        <Text style={[{fontFamily: 'Helvetica-Bold', width: '100%',textAlign: 'left',paddingLeft: 2}]}>HISTORIAL DE PAGOS</Text>
                           
                      </View> 
                      <View /* Encabezado*/   
                      style={[styles.container, { margin: 0, borderBottomColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff' }]}>
                        <Text style={[styles.cob_col1, ]}>Fecha</Text>
                        <Text style={[styles.cob_col2, ]}>Concepto</Text>
                        <Text style={[styles.cob_col3, ]}>Mon.</Text>
                        <Text style={[styles.cob_col4, ]}>Monto</Text>
                        <Text style={[styles.cob_col5, ]}>Recibo</Text>

                      </View> 
                      <ItemCobro  qntDecimals={qntDecimals} conceptosPago={conceptosPago} fide={cont?.fideicomisos[0]} cobros={liq?.data?.cobros}  />  
                  </View>              

                </View>         
        );
  
  export default detalle