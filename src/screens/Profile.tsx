import React, { useCallback, useState, useEffect } from 'react';
import { Platform, Linking, ImageBackground, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

import { Block, Button } from '../components/';
import { useData, useTheme, useTranslation } from '../hooks/';
import { View, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const isAndroid = Platform.OS === 'android';


const Profile = () => {

  const { t } = useTranslation();

  const navigation= useNavigation()

  const [datos, setDatos] = useState<any>('')
  const [account, setAccount] = useState<any>('')

  const handleNavigation2 =  () => {

    Alert.alert('Cierre de Sesión', '¿Estás seguro que quieres cerrar sesión?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Cerrar Sesión',
        style: 'destructive',
        onPress: async () => {

          
          try {
            const keys = await AsyncStorage.getAllKeys();
            await AsyncStorage.multiRemove(keys);
            navigation.navigate('Login');


            
          } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
          }
        },
      },
    ]);

 
};

  useEffect(() => {
    const obtenerToken = async () => {
      try {

        const all: any = await AsyncStorage.getItem('all')



        const arrayFromStorage = JSON.parse(all);

        const { account } = arrayFromStorage
        setAccount(account)
        setDatos(arrayFromStorage)
        console.log(arrayFromStorage)







      } catch (error) {
        console.log(error)

      }

    }
    obtenerToken()

  }, [])



  return (
    <ImageBackground source={require('../assets/images/bg.jpeg')} style={{ flex: 1 }}>
       <View style={styles.container}>
       <View style={styles.header}>
        <Text style={styles.headerText}>Datos Personales</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.cellText}>Nombres</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellText}>{datos.names}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.cellText}>Apellidos</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellText}>{datos.surnames}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.cellText}>Documento</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellText}>{datos.numDocument}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.cellText}>Email</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellText}>{datos.email}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.cellText}>Numero de Cuenta</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellText}>{account.numberOfAccount}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.cellText}>Telefono</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellText}>{datos.cellphone}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cell} >
      <TouchableOpacity style={styles.button} onPress={()=>handleNavigation2()}>
        <Text style={styles.buttonText}>Cerrar Sesion</Text>
      </TouchableOpacity>
     
      </View>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#fff',

  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,

    borderColor: '#000',
    padding: 10,
    alignItems: 'center',
  },
  cellText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3AA70A',
    borderRadius: 5,
    paddingHorizontal: 20,
    marginTop:40,
    height:30,
    alignItems:'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    alignSelf:'center'
  },
  header: {
    backgroundColor: 'lightblue',
    padding: 15,
    alignItems: 'center',
    borderRadius:2
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  }, container: {
    flex: 1,
    marginTop:'65%'
  },

});

export default Profile;
