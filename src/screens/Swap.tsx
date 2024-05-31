import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, ImageBackground, ScrollView, ActivityIndicator, Image, FlatList, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, Text, Button } from '../components/';
/* import RNPickerSelect from 'react-native-picker-select'; */
import { useData, useTheme, useTranslation } from '../hooks/';
import * as Linking from 'expo-linking';








const Swap = () => {





  const { assets, colors, gradients, sizes } = useTheme();
  const [token, setToken] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [postCode, setPostCode] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [moneda, setMoneda] = useState('');
  const [checkout, setCheckout] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [crypto, setCrypto] = useState('');
  const [wallet, setWallet] = useState('');





  useEffect(() => {
    const obtenerToken = async () => {
      try {
        const token: any = await AsyncStorage.getItem('token')
       await AsyncStorage.getItem('variables')
        .then(variablesString => {
          if (variablesString) {
            const variables = JSON.parse(variablesString);
            setSelectedCountry(variables.selectedCountry);
            setAmount(variables.amount);
            setMoneda(variables.moneda);
            setCrypto(variables.crpyto)
          }
        })
        .catch(error => {
          console.error('Error al recuperar las variables desde AsyncStorage:', error);
        });

        setToken(token)


      } catch (error) {
        console.log(error)

      }

    }
    obtenerToken()

  }, [])



  

  const handleSubmit = async () => {

    setIsLoading(true);
    setError(null);

    let formattedAmount = parseFloat(amount);
    if (selectedCountry !== 'CO' && selectedCountry !== 'PE') {
      formattedAmount *= 100;
    }

    console.log(crypto)
    // Construir el objeto de datos para la solicitud
    const data = JSON.stringify({
      country: selectedCountry,
      city: city,
      address: address,
      postCode: postCode,
      currency: moneda,
      amount: formattedAmount,
      language: 'ES',
      description: description,
      billetera: wallet,
      crypto: String(crypto)
    });

    console.log("esta es la data",data)

    try {
      const response = await fetch('https://bankcashapi-production.up.railway.app/api/transactions/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      const responseData = await response.json();

      console.log(responseData)

     setCheckout(responseData.data)
      Linking.openURL(responseData.data)
        .catch((err) => console.error('Error al abrir el enlace: ', err));

      setCity('');
      setAddress('');
      setPostCode('');
      setAmount('');
      setDescription('');
      setMoneda('') 


    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    } finally {
      setIsLoading(false);
      setIsRedirecting(false);
    }



  };




  return (

    <ImageBackground source={require('../assets/images/bg.jpeg')} style={{ flex: 1 }}>

      <View style={{ marginTop: '60%', paddingHorizontal: 20, flex: 1 }}>
    


        <View style={{ flex: 1 }}>
          <ScrollView>

            <View>
              <Input
                placeholder='City'
                style={styles.input1}
                onChangeText={setCity}
                value={city}
                color={colors.black}
                label='City'
              />
            </View>


            <View>
              <Input
                placeholder='Address'
                style={styles.input1}
                onChangeText={setAddress}
                value={address}
                color={colors.black}
                label='Address'
              />
            </View>

            <View>
              <Input
                placeholder='PostCode'
                style={styles.input1}
                onChangeText={setPostCode}
                value={postCode}
                color={colors.black}
                label='PostCode'
                keyboardType="numeric"


              />
            </View>
       


            <View>
              <Input
                placeholder='Descripcion'
                style={styles.input1}
                onChangeText={setDescription}
                value={description}
                color={colors.black}
                label='Descripcion'


              />
            </View>

            
            <View>
              <Input
                placeholder='Descripcion'
                style={styles.input1}
                onChangeText={setWallet}
                value={wallet}
                color={colors.black}
                label='Wallet to transfer'


              />
            </View>
      


            <View >
              <Button
                onPress={() => handleSubmit()}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                color={colors.success}
              >
                <Text bold white transform="uppercase">
                  PAGAR
                </Text>
              </Button>
            </View>

            {isLoading && (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="green" />
              </View>
            )}
          </ScrollView>
        </View>
      </View>







    </ImageBackground>

  );
};



const styles = StyleSheet.create({

  button: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input1: {

    borderRadius: 100



  }, description: {
    fontSize: 18,
    textAlign: 'center',
    borderRadius: 100,
    height: '10%'
  }

});

const pickerStyles = StyleSheet.create({
  input: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 10,

  }, pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
  },
  dropdownList: {
    marginTop: 10, // Espacio entre el botón y la lista desplegable
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    maxHeight: 150, // Altura máxima de la lista desplegable
    overflow: 'hidden', // Para recortar los elementos que excedan la altura máxima

  },
  countryItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 10,
  },
});
export default Swap