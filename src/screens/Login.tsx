import React, { useState, useEffect } from 'react'
import {
  StyleSheet, View, Alert, ImageBackground,KeyboardAvoidingView,Platform,Image
} from 'react-native';

 import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Block, Button, Input, Switch, Modal, Text } from '../components/';
import { useData, useTheme, useTranslation } from '../hooks/';




const Login = ({ navigation }) => {
  const [usuario, guardarUsuario] = useState('')
  const [password, guardarPassword] = useState('')
  const { assets, colors, gradients, sizes } = useTheme();







  const register = () => {

    navigation.navigate('Register')
  }

  const consumirApi = async () => {

    try {


      const res = await fetch('https://bankcashapi-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `${usuario}`,
          password: `${password}`,
        }),
      });

      const resJson = await res.json();
      await AsyncStorage.setItem('all',JSON.stringify(resJson)) 
      const {status}=resJson
     

                if(resJson.message=='Invalid credentials'){
                  mostrarAlerta()
                  return
                }else if(resJson.statusCode==500){
                  userNot()
                  return
                   
                 }else if(resJson.message=='Inactive user, talk to administrator'){
                  inactive()
                   return
                 }
                 else if(status=='ACTIVE'){
                  const token = resJson.token
                 
                  await AsyncStorage.setItem('token',token) 
               
                  
                  navigation.navigate('Home')
                  return
                }

    } catch (err) {
      console.log(err);
    }


  }




  const mostrarAlerta = () => {

    Alert.alert('Error', 'Usuario y contraseña incorrecta', [{ text: 'Ok' }])
  }

  const inactive = () => {

    Alert.alert('Error', 'Inactive user, talk to administrator', [{ text: 'Ok' }])
    
  }

  const userNot = () => {

    Alert.alert('Error', 'Username does not exist', [{ text: 'Ok' }])
    
  }


 


  return (
    <KeyboardAvoidingView  style={{flex:1}}>
    <View style={{ flex: 1 }}>
      <ImageBackground source={require('../assets/images/bg2.jpeg')} style={{ flex: 1 }}>
     
    
    
        <View style={styles.contenedor}>
             
          <View style={{marginTop:'90%'}} >
            <View>
              <Input 
                placeholder='Email'
                style={styles.input1}
                onChangeText={guardarUsuario}
                value={usuario}
                color={colors.black}
                />
        </View>

            <View >
              <Input
                color={colors.black}
                placeholder='Password'
                style={styles.input2}
                onChangeText={guardarPassword}
                value={password}
                secureTextEntry={true} />

            </View>

    
          </View>
         <View style={{flexDirection:'row',marginRight:20, marginTop:30}}>
         
         
          <View >
              <Button
                onPress={() => consumirApi()}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.success}
        
              >
                <Text bold white transform="uppercase">
                  Ingresar
                </Text>
              </Button>
            </View>
          <View>
            <View>
              <Button
                onPress={() => register()}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.success}
              >
                <Text bold white transform="uppercase">
                  Registrarse
                </Text>
              </Button>
            </View>
          </View>
          </View>
        </View>
        
      </ImageBackground>
    </View>
    </KeyboardAvoidingView>
 

  )
}


const styles = StyleSheet.create({

  input1: {

    backgroundColor: '#DAE1D7',
    borderRadius:50

    
   


  }, 
  input2: {
    
    backgroundColor: '#B1B8AD',
    marginTop:25,
    borderRadius:50


  }, imagen: {
    width: 260,
    height: 160,


  }, boton: {
    backgroundColor: '#C70039'

  }, btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase'


  },
  contenedor: {
    backgroundColor: 'transparent',
    marginTop: 60,
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 40
  }



})

export default Login
