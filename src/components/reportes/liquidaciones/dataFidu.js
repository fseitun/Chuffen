import React from 'react';
import {Text, View, StyleSheet} from '@react-pdf/renderer';

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

  const dataFidu = ({cont, liq, cesion, productos, letras, qCuotasARS, qCuotasUSD}) => ( 
                
                <View style={{ flexDirection: 'row',flexWrap: 'wrap', margin: 0, borderWidth: 0, borderColor: '#000000', }} >
                
                  <View style={{  flexDirection: 'row',flexWrap: 'wrap', width: '100%', marginLeft: 0, marginRight: 0, textAlign: 'center', borderWidth: 0, borderColor: '#000000', }} >
                      
                      <View 
                        style={[styles.titulo, { margin: 0, borderTopWidth: 1, borderTopColor: cont?.fideicomisos[0]? cont?.fideicomisos[0]?.color:'#ffffff'}]}>
                        <Text style={[{fontFamily: 'Helvetica-Bold', width: '100%',textAlign: 'left',paddingLeft: 2}]}>DATOS DEL FIDUCIANTE</Text>
                           
                      </View> 

                      <View 
                        style={[styles.container, { margin: 0 }]}>
                        <Text style={[styles.col1, {margin: 0,}]}>Nombre y apellido:</Text>
                        <Text style={[styles.col2, {margin: 0,}]}>{cesion?.nombre}</Text>
                        <Text style={[styles.col3, {margin: 0,}]}>Domicilio:</Text>
                        <Text style={[{margin: 0, width: '26%',textAlign: 'left', paddingLeft: 8,}]}>{cesion?.cesionItems[0]?.personaId>0?   cesion?.cesionItems[0]?.personas[0]?.domicilio:cesion?.cesionItems[0]?.empresaId>0? cesion?.cesionItems[0]?.empresas[0]?.domicilio:""}</Text>
                      
                      </View> 

                      <View 
                        style={[styles.container, { margin: 0 }]}>
                        <Text style={[styles.col1, {margin: 0,}]}>DNI/DUIL/CUIT:</Text>
                        <Text style={[styles.col2, {margin: 0,}]}>{cesion?.cesionItems[0]?.personaId>0?   cesion?.cesionItems[0]?.personas[0]?.CUIT:cesion?.cesionItems[0]?.empresaId>0? cesion?.cesionItems[0]?.empresas[0]?.CUIT:""}</Text>
                        <Text style={[styles.col3, {margin: 0}]}>Cuotas Totales:</Text>
                        <Text style={[{margin: 0, width: '26%',textAlign: 'left', paddingLeft: 8,}]}>{qCuotasARS + qCuotasUSD}</Text>
                      </View>           

                      <View 
                        style={[styles.container, { margin: 0 }]}>
                        <Text style={[styles.col1, {margin: 0,}]}>Unidad funcional:</Text>
                        <Text style={[styles.col2, {margin: 0,}]}>{productos[0]?.codigo + (productos[1]? ", " + productos[1]?.codigo:"") + (productos[2]? ", " + productos[2]?.codigo:"")}</Text>
                        <Text style={[styles.col3, {margin: 0}]}>Tipo de fiduciante:</Text>
                        <Text style={[{margin: 0, width: '26%',textAlign: 'left', paddingLeft: 8,}]}>{cesion?.cesionItems[0]?.personaId>0? letras?.find(i => i.id === parseInt(cesion?.cesionItems[0]?.personas[0]?.letra))?.descripcion:""}</Text>
                      </View> 

                      <View 
                        style={[styles.container, { margin: 0 }]}>
                        <Text style={[styles.col1, {margin: 0,}]}>Fecha de adhesion: </Text>
                        <Text style={[styles.col2, {margin: 0,}]}>{cont?.adhesion.slice(0,10)}</Text>
                        <Text style={[styles.col3, {margin: 0}]}>CAC Base:</Text>
                        <Text style={[{margin: 0, width: '26%',textAlign: 'left', paddingLeft: 8,}]}>{liq?.data?.CACBase}</Text>
                      </View>

                      <View 
                        style={[styles.espacio5, { margin: 0,}]}>
                        <Text style={[{width: '100%'}]}> </Text>
                      </View> 
                  </View>     

                </View>  
      
        );
  
  export default dataFidu