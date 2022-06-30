import React from 'react';
import { Page, Document, Image } from '@react-pdf/renderer';

import {Text, View, StyleSheet, link } from '@react-pdf/renderer';
// import { mostrarFecha } from 'src/utils/utils';


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
    textAlign: 'left',
    paddingLeft: 8,
  },
  col3bis: {
    width: '33%',
    textAlign: 'center',
    paddingTop: 5,
    paddingLeft: 8,
  },

});

  /*
  var arr_id = [];
  var arr_banco = [];
  var arr_cid = [];
  var arr_cuenta = [];*/
  

  

  const header = ({data}) => (

 
                
                <View style={{ flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                
                   <View style={{ width: '46%', margin: 3, textAlign: 'center', borderWidth: 0, borderColor: '#000000', }} >
                       
                        <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ fontSize: 9, textAlign: 'center'}}>&nbsp;</Text>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%', fontSize: 12, textAlign: 'center'}}>Fideicomiso</Text>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%', fontSize: 12, textAlign: 'center'}}>Las Heras Garden</Text>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{width: '100%', fontSize: 9, textAlign: 'center'}}>&nbsp;</Text>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{width: '100%', fontSize: 9, textAlign: 'center'}}>Vicente lopz aa aaa aa 1090</Text>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{width: '100%', fontSize: 9, textAlign: 'center'}}>zzx xxxx aa aaa aa 1090</Text>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{width: '100%', fontSize: 9, textAlign: 'center'}}>&nbsp;</Text>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{width: '100%', fontSize: 9, textAlign: 'center'}}>RESPONSABLE INSCRIPTO</Text>
                        </View>
                       
                   </View>                   
                    
                    <View style={{ width: '8%', borderWidth: 0, borderColor: '#000000', }} >

                        <View style={{ width: '50%', flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderRightWidth: 1, borderRightColor: '#000000', }} >
                            <Text style={{ width: '50%'}}>&nbsp;</Text>
                        </View>
                       
                        <View style={{ flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderWidth: 1, borderColor: '#000000', }} >
                            <Text style={{ width: '100%',fontSize: 28, textAlign: 'left', paddingLeft: 7}}>X</Text>
                        </View>

                        <View style={{ width: '50%', flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderRightWidth: 1, borderRightColor: '#000000', }} >
                            <Text style={{ width: '50%'}}>&nbsp;</Text>
                        </View>
                        <View style={{ width: '50%', flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderRightWidth: 1, borderRightColor: '#000000', }} >
                            <Text style={{ width: '50%'}}>&nbsp;</Text>
                        </View>

                    </View>

                    <View style={{ width: '36%', margin: 3, borderWidth: 0, borderColor: '#000000', }} >
                       
                       <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%',fontSize: 17, textAlign: 'left', paddingLeft: 8}}>RECIBO</Text>
                       </View>
                       <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                           <Text style={{ fontSize: 6, textAlign: 'left', paddingLeft: 8}}>(DOCUMENTO NO VALIDO COMO FACTURA)</Text>
                       </View>
                       <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%',fontSize: 14, textAlign: 'left', paddingLeft: 8}}>NRO: 00001-45678965</Text>
                       </View>

                       <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%',fontSize: 9, textAlign: 'left', paddingLeft: 8}}>.. </Text>
                       </View>
                       <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%',fontSize: 9, textAlign: 'left', paddingLeft: 8}}>CUIT: 30-12345678-7</Text>
                       </View>
                       <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%',fontSize: 9, textAlign: 'left', paddingLeft: 8}}>Ingresos Brutos: 30-12345678-7</Text>
                       </View>
                       <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%',fontSize: 9, textAlign: 'left', paddingLeft: 8}}>Inicio de actividades: 08/2021</Text>
                       </View>
                     
                      
                  </View>

                   
                   

   

                </View>   


      
        );
  
  export default header