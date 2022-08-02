import React from 'react';
import {Text, View, StyleSheet} from '@react-pdf/renderer';
import { grey } from '@mui/material/colors';

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
      textAlign: 'left',
      paddingLeft: 15,
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



  const header = ({cont, liq}) => (
                
                <View style={{ flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                
                    <View style={[{ width: '100%', flexDirection: 'row', marginTop: 20,}]}>
                        <Text style={[{width: '100%',color: '#101010', fontSize: 22, textAlign: 'left',}]}>{cont?.fideicomisos[0]?.nombre}</Text>
                        
                    </View>
                      <View 
                        style={[styles.container, { margin: 0 }]}>
                        <Text style={[styles.col1, {margin: 0,}]}>Cuenta Recaudadora:</Text>
                        <Text style={[styles.col2, {margin: 0,}]}>{cont?.fideicomisos[0]?.empresas[0]?.banco}-{cont?.fideicomisos[0]?.empresas[0]?.nroCuenta}</Text>
                        <Text style={[styles.col3, {margin: 0,}]}>Tel:</Text>
                        <Text style={[{margin: 0, width: '26%',textAlign: 'left', paddingLeft: 8,}]}>{cont?.fideicomisos[0]?.empresas[0]?.telefono}</Text>

                      </View> 

                      <View 
                        style={[styles.container, { margin: 0 }]}>
                        <Text style={[styles.col1, {margin: 0,}]}></Text>
                        <Text style={[styles.col2, {margin: 0,}]}></Text>
                        <Text style={[styles.col3, {margin: 0,}]}>CUIT:</Text>
                        <Text style={[{margin: 0, width: '26%',textAlign: 'left', paddingLeft: 8,}]}>{cont?.fideicomisos[0]?.empresas[0]?.CUIT}</Text>
                  
                      </View>           

                      <View 
                        style={[styles.container, { margin: 0 }]}>
                        <Text style={[styles.col1, {margin: 0,}]}>CBU:</Text>
                        <Text style={[styles.col2, {margin: 0,}]}>{cont?.fideicomisos[0]?.empresas[0]?.CBU}</Text>
                        <Text style={[styles.col3, {margin: 0}]}>Mail:</Text>
                        <Text style={[{margin: 0, width: '26%',textAlign: 'left', paddingLeft: 8,}]}>{cont?.fideicomisos[0]?.empresas[0]?.mail}</Text>
                
                      </View> 

                      <View 
                        style={[styles.container, { margin: 0 }]}>
                        <Text style={[styles.col1, {margin: 0,}]}></Text>
                        <Text style={[{margin: 0, color: grey[700], width: '86%', textAlign: 'left', paddingLeft: 15,}]}>Oficinas en {cont?.fideicomisos[0]?.empresas[0]?.domicilio}</Text>

         
                      </View>
                      
                      <View 
                        style={[styles.container, { margin: 0 }]}>
                        <Text style={[styles.col1, {margin: 0,}]}></Text>
                        <Text style={[{margin: 0, color: grey[700], width: '86%', textAlign: 'left', paddingLeft: 15,}]}>Condición de pago del 1 al 15 de cada mes, se solicita enviar comprobante de pago para acreditar el aporte.</Text>
                        
                      </View>

                      <View 
                        style={[styles.container, { margin: 0 }]}>
                        <Text style={[styles.col1, {margin: 0,}]}></Text>
                        <Text style={[{margin: 0, color: grey[700], width: '86%', textAlign: 'left', paddingLeft: 15,}]}>Web {cont?.fideicomisos[0]?.web}</Text>
                        
                      </View>

                    <View style={[{ width: '100%', flexDirection: 'row'}]} >
                        <Text style={[styles.label, {margin: 0, width: '100%', textAlign: 'right'}]}>Periodo: {
                            new Date(liq?.fecha).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'short',
                            timeZone: 'UTC',
                          })}</Text>
                       
                    </View >   

                    <View 
                        style={[styles.espacio5, { margin: 0,}]}>
                        <Text style={[{width: '100%'}]}> </Text>
                           
                    </View>

                </View>   
      
        );
  
  export default header