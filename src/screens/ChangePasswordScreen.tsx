import React, {useCallback, useState,useEffect} from 'react';

import {useData, useTheme, useTranslation} from '../hooks/';
import {Block, Button, Input, Product} from '../components/';
import {View,Text,StyleSheet,Image,ImageBackground,TouchableOpacity,TextInput,Alert}
  from 'react-native'

  import AsyncStorage from '@react-native-async-storage/async-storage'; 

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const[token,setToken] =useState<string>('')
  

  useEffect(()=>{
    const obtenerToken =async () =>{
    try {
  const token:any =await AsyncStorage.getItem('token') 
      setToken(token)
     
     
   
    } catch (error) {
      console.log(error)
      
    }
    
    }
    obtenerToken()
    
    },[])




    const handleChangePassword = async () => {
      try {
        const res = await fetch('https://bankcashapi-production.up.railway.app/api/users/change-password', {
          method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: `${currentPassword}`,
          newPassword: `${newPassword}`,
        }),
      });
  
        const resJson = await res.json();
        console.log(resJson)
        if (resJson.message === 'Invalid Current password') {
          Alert.alert('Error', 'Invalid Current password', [{ text: 'OK' }]);

          return
        } else {
          Alert.alert('Password Changed', 'Your password has been changed successfully!', [{ text: 'OK' }]);
          setNewPassword('')
          setCurrentPassword('')
        }

        
        
      } catch (err) {
        console.log(err);
      }
    };




  return (
    <ImageBackground source={require('../assets/images/bg.jpeg')} style={{flex:1}}>
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Current password"
        secureTextEntry
        value={currentPassword}
        onChangeText={text => setCurrentPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={text => setNewPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
     
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop:80
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    margin:20
  },
  button: {
    backgroundColor: '#3AA70A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  message: {
    marginTop: 20,
    color: 'red',
  },
});

export default ChangePasswordScreen;