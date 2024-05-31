import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, ImageBackground, ScrollView, ActivityIndicator,Text, Image, FlatList, TouchableOpacity, Modal } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, Button } from '../components/';
/* import RNPickerSelect from 'react-native-picker-select'; */
import { useData, useTheme, useTranslation } from '../hooks/';
import * as Linking from 'expo-linking';
import { Picker } from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/core';



const Remesas = () => {





  const { assets, colors, gradients, sizes } = useTheme();
  const [token, setToken] = useState<string>('')
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  const [amount, setAmount] = useState('');
  const [moneda, setMoneda] = useState('');
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [crpyto, setCrpyto] = useState<number>();
  const [showModal, setShowModal] = useState(false);
  const [variables, setVariables] = useState(false);



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
      monto: Number(amount),
      currency: moneda,

    });

    

    try {
      const response = await fetch('https://bankcashapi-production.up.railway.app/api/changecrypto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      const responseData = await response.json();
            
      const {cantmonedaatranferir} =responseData
    setCrpyto(Number(cantmonedaatranferir))
    setShowModal(true);



    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    } finally {
      setIsLoading(false);
      setIsRedirecting(false);
    }



  };


  const handleYes =  async () => {
    setShowModal(false);
// Serializa las variables en un objeto
const variablesToSave = {
  selectedCountry,
  amount,
  moneda,
  crpyto
};

const variablesString = JSON.stringify(variablesToSave);


AsyncStorage.setItem('variables', variablesString)

    navigation.navigate('Swap')
  };

  return (

    <ImageBackground source={require('../assets/images/bg.jpeg')} style={{ flex: 1 }}>

      <View style={{ marginTop: '60%', paddingHorizontal: 20, flex: 1 }}>
        <View>

          <View>

            <Text style={{textAlign:'center',fontSize:30}}>Crpyto Exchange</Text>
          </View>
          <Text style={{ marginBottom: 8, color: 'black', fontWeight: 'bold' }}>Country</Text>
          <View style={pickerStyles.pickerContainer}>
            <TouchableOpacity
              onPress={() => setIsDropdownVisible(!isDropdownVisible)}
              style={pickerStyles.selectButton}
            >
              <Text style={pickerStyles.selectButtonText}>
                {selectedCountry ? selectedCountry : 'Select Country'}
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
                placeholder='Amount to Change'
                style={styles.input1}
                onChangeText={setAmount}
                value={amount}
                color={colors.black}
                label='Amount to Change'
                keyboardType="numeric"

              />
            </View>


         
            <View >
              <Button
                 onPress={() => handleSubmit()} 
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                color={colors.success}

              >
                <Text style={{textAlign:'center',fontWeight:'bold',color:'white'}} >
                  CHANGE
                </Text>
              </Button>
            </View>

            {isLoading && (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="green" />
              </View>
            )}
<Modal
  animationType="slide" // Puedes ajustar la animación según tus preferencias
  transparent={true}
  visible={showModal}
  onRequestClose={() => {
    setShowModal(!showModal);
  }}
>
  <View style={modalStyles.modalContainer}>
    <View style={modalStyles.modalContent}>
      <Text style={modalStyles.modalText}>Do you want to change this amount of FWCC? :</Text>
      <Text style={modalStyles.modalText}>{crpyto}</Text>
      <View style={modalStyles.modalButtonsContainer}>
        <TouchableOpacity
          style={modalStyles.modalButton}
          onPress={handleYes}
        >
          <Text style={modalStyles.modalButtonText}>Sí</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={modalStyles.modalButton}
          onPress={() => setShowModal(false)}
        >
          <Text style={modalStyles.modalButtonText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>


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

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: 300,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign:'center'
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalButton: {
    backgroundColor: 'green',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    height:40,
    width:100
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


export default Remesas