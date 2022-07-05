import React from 'react';
import {Text, View} from '@react-pdf/renderer';

  const total = ({data}) => ( 
                
                <View style={{ flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                
                   <View style={{ width: '100%', margin: 0, textAlign: 'center', borderWidth: 0, borderColor: '#000000', }} >
                       
                        <View style={{ height:'7', width: '100%', flexDirection: 'row', margin: 0, borderTopWidth: 1, borderTopColor: '#000000', }} >
                            <Text style={{ fontSize: 9, textAlign: 'left'}}>..</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%', fontSize: 9, textAlign: 'left', paddingLeft: 8}}>&nbsp;</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '30%', fontSize: 15, textAlign: 'right', paddingLeft: 8}}>TOTAL:</Text>
                            <Text style={{ width: '30%', fontSize: 15, textAlign: 'left', paddingLeft: 14}}>{data?.cobro_monto} {data?.cobro_moneda}</Text>
                            <Text style={{ width: '20%', fontSize: 15, textAlign: 'center', paddingLeft: 0}}>.................</Text>
                            <Text style={{ width: '20%', fontSize: 15, textAlign: 'center', paddingLeft: 0}}>.................</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                       
                            <Text style={{ width: '60%', fontSize: 9, textAlign: 'left', paddingLeft: 14}}>&nbsp;</Text>
                            <Text style={{ width: '20%', fontSize: 9, textAlign: 'center'}}>Firma</Text>
                            <Text style={{ width: '20%', fontSize: 9, textAlign: 'center'}}>Aclaración</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%', fontSize: 9, textAlign: 'left', paddingLeft: 8}}>&nbsp;</Text>
                        </View>
                       
                   </View>

                </View>      
        );
  
  export default total