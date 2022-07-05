import React from 'react';
import {Text, View } from '@react-pdf/renderer';

  const monto = ({data}) => (

 
                
                <View style={{ flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                
                   <View style={{ width: '100%', margin: 0, textAlign: 'center', borderWidth: 0, borderColor: '#000000', }} >
                       
                        <View style={{ height:'24', width: '100%', flexDirection: 'row', margin: 0, borderTopWidth: 1, borderTopColor: '#000000', }} >
                            <Text style={{ fontSize: 9, textAlign: 'left'}}>&nbsp;</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '26%', fontSize: 9, textAlign: 'right', paddingLeft: 8}}>Recibí(mos) la suma de:</Text>
                            <Text style={{ width: '74%', fontSize: 9, textAlign: 'right', paddingRight: 8}}>{data?.cobro_monto} {data?.cobro_moneda}</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '26%', fontSize: 9, textAlign: 'right', paddingLeft: 8}}>En concepto de:</Text>
                            <Text style={{ width: '74%', fontSize: 9, textAlign: 'left', paddingLeft: 18}}>{data?.cobro_concepto} - {data?.adhe_nombre}</Text>
                        </View>
   
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '26%', fontSize: 9, textAlign: 'right', paddingLeft: 8}}>Forma de Pago:</Text>
                            <Text style={{ width: '74%', fontSize: 9, textAlign: 'left', paddingLeft: 18}}>{data?.cobro_f_pago}</Text>
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