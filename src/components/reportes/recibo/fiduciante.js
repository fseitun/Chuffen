import React from 'react';
import {Text, View} from '@react-pdf/renderer';
  

  const fiduciante = ({data}) => (

 
                
                <View style={{ flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                
                   <View style={{ width: '100%', margin: 0, textAlign: 'center', borderWidth: 0, borderColor: '#000000', }} >
                       
                        <View style={{ height:'7', width: '100%', flexDirection: 'row', margin: 0, borderTopWidth: 1, borderTopColor: '#000000', }} >
                            <Text style={{ fontSize: 9, textAlign: 'left'}}>..</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%', fontSize: 9, textAlign: 'left', paddingLeft: 8}}>Señor(es): {data?.fidu_nombre}</Text>
                        </View>
                        <View style={{  height:'17', width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%', fontSize: 9, textAlign: 'left', paddingLeft: 8}}>Domicilio:  ...................................................................................................................................................................</Text>
                        </View>
                       
                        
                       
                   </View>                   
                    
                            
                   

   

                </View>   


      
        );
  
  export default fiduciante