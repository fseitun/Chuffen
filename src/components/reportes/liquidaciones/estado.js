import React from 'react';
import {Text, View, StyleSheet} from '@react-pdf/renderer';
import { grey, red } from '@mui/material/colors';


const styles = StyleSheet.create({

  titulo: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 23,
    fontSize: 8,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
},

espacio5: {
  flexDirection: 'row',
  height: 5,
  fontSize: 7,
  textAlign: 'center',
  flexGrow: 1,
},


  espacio10: {
    flexDirection: 'row',
    height: 10,
    fontSize: 7,
    textAlign: 'center',
    flexGrow: 1,
},

  container: {
      flexDirection: 'row',
      height: 12,
      fontSize: 7,
      textAlign: 'center',
      flexGrow: 1,
  },


  col1: {
    width: '14%',
    textAlign: 'right',
    paddingLeft: 2,
  },

  col2: {
      width: '36%',
      textAlign: 'right',
      paddingLeft: 2,
  },
  col3: {
    width: '24%',
    textAlign: 'right',
    paddingLeft: 2,
  },

  col4: {
    width: '5%',
    textAlign: 'right',
    paddingLeft: 2,
},
  col5: {
    width: '8%',
    textAlign: 'right',
    paddingRight: 2,
  },
  col6: {
    width: '5%',
    textAlign: 'right',
    paddingRight: 2,
  },
  col7: {
    width: '8%',
    textAlign: 'right',
    paddingRight: 2,
  },


});

  const estado = ({conceptosPago, conceptosCuota, cont, liq, qntDecimals}) => ( 
                
                <View style={{ flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                
                  <View style={{  flexDirection: 'row',flexWrap: 'wrap', width: '100%', marginLeft: 0, marginRight: 0, textAlign: 'center', borderWidth: 0, borderColor: '#000000', }} >
                      
                      <View 
                        style={[styles.titulo, { margin: 0, borderTopWidth: 1, borderTopColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff'}]}>
                        <Text style={[{fontFamily: 'Helvetica-Bold', width: '100%',textAlign: 'left',paddingLeft: 2}]}>ESTADO DE CUENTA</Text>
                           
                      </View> 

                      <View 
                        style={[styles.container, { margin: 0 }]}>
                        <Text style={[styles.col1, {margin: 0,}]}></Text>
                        <Text style={[styles.col2, {margin: 0,}]}></Text>
                        <Text style={[styles.col3, {margin: 0,}]}>Cuota mes en curso:</Text>
                        <Text style={[styles.col4, {margin: 0,}]}>ARS&nbsp;</Text>
                        <Text style={[styles.col5, {margin: 0}]}>{Intl.NumberFormat('es-AR', { minimumFractionDigits: qntDecimals }).format(Number(parseFloat(liq?.data?.ultimaCuotaARS).toFixed(qntDecimals)))}</Text>
                        <Text style={[styles.col6, {margin: 0,}]}></Text>
                        <Text style={[styles.col7, {margin: 0,}]}></Text>

                      </View> 

                      <View 
                        style={[styles.container, { margin: 0 }]}>
                        <Text style={[styles.col1, {margin: 0,}]}></Text>
                        <Text style={[styles.col2, {margin: 0,}]}></Text>
                        <Text style={[styles.col3, {margin: 0, color: grey[700]}]}>Saldo al mes Anterior:</Text>
                        <Text style={[styles.col4, {margin: 0, color: grey[700] }]}>ARS&nbsp;</Text>
                        <Text style={[styles.col5, {margin: 0, color: grey[700]}]}>{Intl.NumberFormat('es-AR', { minimumFractionDigits: qntDecimals }).format(Number(parseFloat(liq?.data?.deudaARS).toFixed(qntDecimals)))}</Text>
                        <Text style={[styles.col6, {margin: 0, color: grey[700]}]}></Text>
                        <Text style={[styles.col7, {margin: 0, color: grey[700]}]}></Text>

                      </View> 

                      <View 
                        style={[styles.container, { margin: 0 }]}>
                        <Text style={[styles.col1, {margin: 0,}]}></Text>
                        <Text style={[styles.col2, {margin: 0,}]}></Text>
                        <Text style={[styles.col3, {margin: 0, color: grey[700]}]}>Punitorios:</Text>
                        <Text style={[styles.col4, {margin: 0, color: grey[700]}]}>ARS&nbsp;</Text>
                        <Text style={[styles.col5, {margin: 0, color: grey[700]}]}>{Intl.NumberFormat('es-AR', { minimumFractionDigits: qntDecimals }).format(Number(parseFloat(liq?.data?.itemPunitorioARS?.monto).toFixed(qntDecimals)))}</Text>
                        <Text style={[styles.col6, {margin: 0, color: grey[700]}]}></Text>
                        <Text style={[styles.col7, {margin: 0, color: grey[700]}]}></Text>
                      </View> 

                      <View 
                        style={[styles.container, { margin: 0 }]}>
                        <Text style={[styles.col1, {margin: 0,}]}></Text>
                        <Text style={[styles.col2, {margin: 0,}]}></Text>
                        <Text style={[styles.col3, {margin: 0, color: red[700]}]}>Saldo en cuenta corriente:</Text>
                        <Text style={[styles.col4, {margin: 0, color: red[700]}]}>ARS&nbsp;</Text>
                        <Text style={[styles.col5, {margin: 0, color: red[700]}]}>{Intl.NumberFormat('es-AR', { minimumFractionDigits: qntDecimals }).format(Number(parseFloat(liq?.data?.saldoARS).toFixed(qntDecimals)))}</Text>
                        <Text style={[styles.col6, {margin: 0, color: red[700]}]}></Text>
                        <Text style={[styles.col7, {margin: 0, color: red[700]}]}></Text>
                      </View>

                      <View 
                        style={[styles.espacio5, { margin: 0, borderBottomWidth: 1, borderBottomColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff'}]}>
                        <Text style={[{width: '100%'}]}> </Text>
                           
                      </View> 
                  
                  </View>    

                </View>   
        );
  
  export default estado