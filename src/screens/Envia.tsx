import React, { useState, useEffect } from 'react'
import {
  StyleSheet, View,Alert,Image,ImageBackground
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Block, Button, Input, Switch, Modal, Text} from '../components/';
import {useData, useTheme, useTranslation} from '../hooks/';
import ClaveDinamica from './ClaveDinamica';


const Envia = () => {
  return (
    <ImageBackground source={require('../assets/images/bg.jpeg')} style={{flex:1}}> 
    <View > 

    <View style={{margin:10}}>
  <ClaveDinamica/>
</View>

   
<View style={{margin:30}}> 
<Input  label="Nombre"
        placeholder='Nombre'
       />
</View>
     <View style={{margin:30}}> 
<Input  label="Cuanto vas a Enviar"
        placeholder='Monto'
       />
</View>


<View style={{margin:30}}> 
<Input  label="Numero de Cuenta"
        placeholder='Cuenta'
       />
</View>
<View style={{margin:30}}> 
<Input  label="Mensaje"
        placeholder='Mensaje'
       />
</View>



<View style={{marginTop:20}}>
  <Button /* onPress={() => retira()}  */> 
    <Image source={require('../assets/images/envia.png')} style={styles.imagen1}/>
    <Text style={styles.texto4}>Envia Dinero </Text>
  </Button>
  </View>
    
   </View>
   </ImageBackground>
  )
}
const styles = StyleSheet.create({
 
  imagen1:{
    width:60,
    height:60,
    borderRadius:100,
    backgroundColor:'#358C0F'
  },texto4:{
    color:'black',
    textAlign:'center',
    textTransform:'uppercase',
    fontSize:13,
    fontWeight:'bold',
  }
  
  })
export default Envia