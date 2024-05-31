import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, ImageBackground, ScrollView, ActivityIndicator, Image, FlatList, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, Text, Button } from '../components/';
/* import RNPickerSelect from 'react-native-picker-select'; */
import { useData, useTheme, useTranslation } from '../hooks/';
import * as Linking from 'expo-linking';
import { Picker } from '@react-native-picker/picker';







const Abona = () => {





  const { assets, colors, gradients, sizes } = useTheme();
  const [token, setToken] = useState<string>('')
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState(null);
  const [currencies, setCurrencies] = useState([]);
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
  const [targetAccounts, setTargetAccounts] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);



  useEffect(() => {
    const obtenerToken = async () => {
      try {
        const token: any = await AsyncStorage.getItem('token')

        setToken(token)


      } catch (error) {
        console.log(error)

      }

    }
    obtenerToken()

  }, [])

  useEffect(() => {
    const buscarAdm = async () => {
      try {
        const response = await fetch('https://bankcashapi-production.up.railway.app/api/users/find-all-admin', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setTargetAccounts(data)




      } catch (error) {
        console.error(error);
      }
    };

    buscarAdm();
  }, [token]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://bankcashapi-production.up.railway.app/api/country/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setCountries(data)




      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [token]);


  const handleCountryChange = async (value: any) => {
    setSelectedCountry(value);
    setSelectedCountryCode(null);
    setCurrencies([]);
    setIsDropdownVisible(false);
    const selectedCountryData: any = countries.find((country: { countryCode: any; }) => country.countryCode === value);
    if (selectedCountryData) {
      setSelectedCountryCode(selectedCountryData.countryCode);
      fetchCountryDetails(selectedCountryData.countryCode);


    }

  };


  const handleCurrencyChange = async (value: any) => {

    setMoneda(value)

  };

  const fetchCountryDetails = async (countryCode: any) => {
    try {
      const response = await fetch(`https://bankcashapi-production.up.railway.app/api/country/${countryCode}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });


      const data = await response.json();
      if (data.currencys && Array.isArray(data.currencys)) {
        setCurrencies(data.currencys);
      }

    } catch (error) {
      console.error('Error fetching country details:', error);
    }
  };

  const handleSubmit = async () => {

    setIsLoading(true);
    setError(null);

    let formattedAmount = parseFloat(amount);
    if (selectedCountry !== 'CO' && selectedCountry !== 'PE') {
      formattedAmount *= 100;
    }

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
      targetAccount: selectedValue
    });

    console.log(data)

    try {
      const response = await fetch('https://bankcashapi-production.up.railway.app/api/transactions/collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      const responseData = await response.json();

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
        <View>
          <Text style={{ marginBottom: 8, color: 'black', fontWeight: 'bold' }}>Country</Text>
          <View style={pickerStyles.pickerContainer}>
            <TouchableOpacity
              onPress={() => setIsDropdownVisible(!isDropdownVisible)}
              style={pickerStyles.selectButton}
            >
              <Text style={pickerStyles.selectButtonText}>
                {selectedCountry ? selectedCountry : 'Seleccionar país'}
              </Text>

            </TouchableOpacity>
            {isDropdownVisible && (
              <View style={pickerStyles.dropdownList}>
                <FlatList
                  data={countries}
                  keyExtractor={(item) => item.countryName}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleCountryChange(item.countryCode)}
                      style={pickerStyles.countryItem}
                    >
                      <View style={{ flexDirection: 'row' }}>

                        {item.flagPng ? (
                          <Image source={{ uri: item.flagPng }} style={pickerStyles.flag} />
                        ) : null}
                        <Text>{item.countryName}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
        </View>


        <View style={{ flex: 1 }}>
          <ScrollView>

            <Text style={{ marginBottom: 8, color: 'black', fontWeight: 'bold' }}>Currency</Text>

            <Picker
              selectedValue={moneda}
              onValueChange={handleCurrencyChange}
              style={pickerStyles.input}
            >
              <Picker.Item label="Select Currency..." value={null} />
              {selectedCountry === 'PE' ? (
                <Picker.Item label="SOL" value="PEN" />
              ) : selectedCountry === 'CO' ? (
                <Picker.Item label="COP" value="COP" />
              ) : (
                currencies.map((currency) => (
                  <Picker.Item key={currency} label={currency} value={currency} />
                ))
              )}
            </Picker>




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
                placeholder='Amount'
                style={styles.input1}
                onChangeText={setAmount}
                value={amount}
                color={colors.black}
                label='Amount'
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
              <Text style={{ marginBottom: 8, color: 'black', fontWeight: 'bold' }}>Seleccionar Usuario a Aportar</Text>

              <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
              >
                <Picker.Item label="Seleccionar un usuario" value={null} />
                {targetAccounts.length > 0 && targetAccounts.map((user: any) => (
                  <Picker.Item key={user.targetAccount} label={user.fullName} value={user.targetAccount} />
                ))}
              </Picker>
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
export default Abona