import React from 'react'
import {
  StyleSheet, View,Alert,Image,ImageBackground
} from 'react-native';

import {Block, Button, Input,  Text, Checkbox} from '../components/';
import {useNavigation} from '@react-navigation/core';
import {useData, useTheme, useTranslation} from '../hooks/';



const Tarjeta = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const {assets, colors, gradients, sizes} = useTheme();

  return (

    <ImageBackground source={require('../assets/images/bg.jpeg')} style={{flex:1}}> 
         
    <View> 
    <Text>Tarjeta</Text>
        
       </View>
       </ImageBackground>
  )
}

export default Tarjeta