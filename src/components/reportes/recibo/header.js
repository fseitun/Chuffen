import React from 'react';
import {Text, View} from '@react-pdf/renderer';

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
                            <Text style={{ width: '100%', fontSize: 12, textAlign: 'center'}}>{data?.fide_nombre}</Text>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{width: '100%', fontSize: 9, textAlign: 'center'}}>&nbsp;</Text>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{width: '100%', fontSize: 9, textAlign: 'center'}}>{data?.fide_dir_linea1}</Text>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{width: '100%', fontSize: 9, textAlign: 'center'}}>{data?.fide_dir_linea2}</Text>
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
                            <Text style={{ width: '100%',fontSize: 14, textAlign: 'left', paddingLeft: 8}}>NRO: {data?.cobro_numero}</Text>
                       </View>
                       <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%',fontSize: 9, textAlign: 'left', paddingLeft: 8}}>&nbsp;</Text>
                       </View>
                       <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%',fontSize: 9, textAlign: 'left', paddingLeft: 8}}>CUIT: {data?.fide_cuit}</Text>
                       </View>
                       <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%',fontSize: 9, textAlign: 'left', paddingLeft: 8}}>Ingresos Brutos: {data?.fide_cuit}</Text>
                       </View>
                       <View style={{ width: '100%', flexDirection: 'row', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                            <Text style={{ width: '100%',fontSize: 9, textAlign: 'left', paddingLeft: 8}}>Inicio de actividades: {data?.fide_fecha}</Text>
                       </View>
                     
                      
                  </View>

                   
                   

   

                </View>   


      
        );
  
  export default header