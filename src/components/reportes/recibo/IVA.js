import React from 'react';
import { Page, Document, Image } from '@react-pdf/renderer';

import {Text, View, StyleSheet, link } from '@react-pdf/renderer';
// import { mostrarFecha } from 'src/utils/utils';


const styles = StyleSheet.create({

  espacio: { 
    height: 8,
  },

  roboto: {
    height:'17', 
    fontFamily: "Roboto",
    width: '100%', 
    flexDirection: 'row'
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
  

  

  const IVA = ({data}) => (

 
                
                <View style={{ flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                
                   <View style={{ width: '100%', margin: 0, textAlign: 'center', borderWidth: 0, borderColor: '#000000', }} >
                       
                        <View style={{ height:'7', width: '100%', flexDirection: 'row', margin: 0, borderTopWidth: 1, borderTopColor: '#000000', }} >
                            <Text style={{ fontSize: 9, textAlign: 'left'}}>..</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }}   >
                            <Text style={{ width: '100%', fontSize: 9, textAlign: 'left', paddingLeft: 8}}>IVA:    ⅏ no Resp.     ⅏ exento     ⅏ cons. final      ⅏ resp. Isnc.      ⅏ monotributo</Text>
                        </View>

                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%', fontSize: 9, textAlign: 'left', paddingLeft: 8}}>CUI22T NRO:  .............................................................................................................................................................</Text>
                        </View>
                                              
                   </View>    
                   
                </View>   


      
        );
  
  export default IVA