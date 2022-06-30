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
  

  

  const monto = ({data}) => (

 
                
                <View style={{ flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                
                   <View style={{ width: '100%', margin: 0, textAlign: 'center', borderWidth: 0, borderColor: '#000000', }} >
                       
                        <View style={{ height:'24', width: '100%', flexDirection: 'row', margin: 0, borderTopWidth: 1, borderTopColor: '#000000', }} >
                            <Text style={{ fontSize: 9, textAlign: 'left'}}>&nbsp;</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '26%', fontSize: 9, textAlign: 'right', paddingLeft: 8}}>Recibí(mos) la suma de:</Text>
                            <Text style={{ width: '74%', fontSize: 9, textAlign: 'right', paddingRight: 8}}>3.000.000,00 ARS</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '26%', fontSize: 9, textAlign: 'right', paddingLeft: 8}}>En concepto de:</Text>
                            <Text style={{ width: '74%', fontSize: 9, textAlign: 'left', paddingLeft: 18}}>Pago Anticipo</Text>
                        </View>
   
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '26%', fontSize: 9, textAlign: 'right', paddingLeft: 8}}>Forma de Pago:</Text>
                            <Text style={{ width: '74%', fontSize: 9, textAlign: 'left', paddingLeft: 18}}>Cheque</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%', fontSize: 9, textAlign: 'left', paddingLeft: 8}}>&nbsp;</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%', fontSize: 9, textAlign: 'left', paddingLeft: 8}}>&nbsp;</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%', fontSize: 9, textAlign: 'left', paddingLeft: 8}}>&nbsp;</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%', fontSize: 9, textAlign: 'left', paddingLeft: 8}}>....................................................................................................................................................................................</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%', fontSize: 9, textAlign: 'left', paddingLeft: 8}}>....................................................................................................................................................................................</Text>
                        </View>
                       
                        
                       
                   </View>                   
                    
                            
                   

   

                </View>   


      
        );
  
  export default monto