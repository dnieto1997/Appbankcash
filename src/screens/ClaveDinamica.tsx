import React, {useCallback, useState,useEffect} from 'react';
import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Input, Product} from '../components/';
import {View,Text,StyleSheet,Image,ImageBackground}
  from 'react-native'
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { useCountdown } from 'react-native-countdown-circle-timer'

const ClaveDinamica = () => {
      
const generateCode = () => {
    const codeLength = 6;
    const characters = '0123456789';
    let code = '';
  
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
  
    return code;
  };
  const [code, setCode] = useState(generateCode());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCode(generateCode());
    }, 60000);
  
    return () => clearInterval(interval);
  }, []);
  return (
    <View style={styles.contenedor3}>

<View style={{margin:4,flexDirection:'row'}}>
<CountdownCircleTimer
      isPlaying={true}
     duration={60}
      colors={["#F7B801", "#F7B801", "#F7B801", "#F7B801"]}
      colorsTime={[10, 6, 3, 0]}
      onComplete={() => ({ shouldRepeat: true })}
      updateInterval={1}
 size={54}
   
  >
  {({ remainingTime, color }) => (
      <Image source={require('../assets/images/descarga.png')} style={styles.imagen} />
    )}
  </CountdownCircleTimer>
<View style={{margin:10}}>
<Text style={styles.clave}>Clave Dinamica</Text>
<Text style={styles.clave}>{code}</Text>
</View>
  </View>
</View>
  )
}
const styles = StyleSheet.create({

contenedor3:{
      width:180,
      height:60,
      borderRadius:10,
      shadowColor: "#000",
      backgroundColor:'#fff',
     
    
    },
    imagen:{
      width:20,
      height:20
    }, clave:{
      textAlign:'center'
    }
    
    })
export default ClaveDinamica