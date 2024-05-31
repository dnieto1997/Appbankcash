import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, Text, Button } from '../components/';
import { Picker } from '@react-native-picker/picker'; 
import { useData, useTheme, useTranslation } from '../hooks/';
import * as Linking from 'expo-linking';

const Consigna = () => {
  const { assets, colors, gradients, sizes } = useTheme();
  const [token, setToken] = useState<string>('');
  const [countries, setCountries] = useState<any>([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
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

  useEffect(() => {
    const obtenerToken = async () => {
      try {
        const token: any = await AsyncStorage.getItem('token');
        setToken(token);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerToken();
  }, []);

  const countryData = [
    {
      countryName: 'WorldWide',
      countryCode: '00',
      currencies: [ 'USD', 'EUR' ]
    },
    {
      countryName: 'Argentina',
      countryCode: 'AR',
      currencies: [ 'USD', 'ARS' ]
    },
    {
      countryName: 'Bolivia',
      countryCode: 'BO',
      currencies: [ 'USD', 'BOB' ]
    },
    {
      countryName: 'Brazil',
      countryCode: 'BR',
      currencies: [ 'USD', 'BRL' ]
    },
    {
      countryName: 'Burkina',
      countryCode: 'BF',
      currencies: [ 'USD', 'XOF' ]
    },
    {
      countryName: 'Cameroon',
      countryCode: 'CM',
      currencies: [ 'USD', 'XAF' ]
    },
    {
      countryName: 'Chile',
      countryCode: 'CL',
      currencies: [ 'USD', 'CLP' ]
    },
    {
      countryName: 'Colombia',
      countryCode: 'CO',
      currencies: [ 'USD', 'COP' ]
    },
    {
      countryName: 'Costa Rica',
      countryCode: 'CR',
      currencies: [ 'USD', 'CRC' ]
    },
    {
      countryName: 'Dominican Republic',
      countryCode: 'DO',
      currencies: [ 'USD', 'DOP' ]
    },
    { countryName: 'Ecuador', countryCode: 'EC', currencies: [ 'USD' ] },
    {
      countryName: 'Egypt',
      countryCode: 'EG',
      currencies: [ 'USD', 'EGP' ]
    },
    {
      countryName: 'Ethiopia',
      countryCode: 'ET',
      currencies: [ 'USD', 'ETB' ]
    },
    {
      countryName: 'Ghana',
      countryCode: 'GH',
      currencies: [ 'USD', 'GHS' ]
    },
    {
      countryName: 'Guatemala',
      countryCode: 'GT',
      currencies: [ 'USD', 'GTQ' ]
    },
    {
      countryName: 'Guinea',
      countryCode: 'GN',
      currencies: [ 'USD', 'XAF' ]
    },
    {
      countryName: 'India',
      countryCode: 'IN',
      currencies: [ 'USD', 'INR' ]
    },
    {
      countryName: 'Ivory Coast',
      countryCode: 'CI',
      currencies: [ 'USD', 'XOF' ]
    },
    {
      countryName: 'Kenya',
      countryCode: 'KE',
      currencies: [ 'USD', 'KES' ]
    },
    {
      countryName: 'Malaysia',
      countryCode: 'MY',
      currencies: [ 'USD', 'MYR' ]
    },
    {
      countryName: 'Mali',
      countryCode: 'ML',
      currencies: [ 'USD', 'XOF' ]
    },
    {
      countryName: 'Mexico',
      countryCode: 'MX',
      currencies: [ 'USD', 'MXN' ]
    },
    {
      countryName: 'Mozambique',
      countryCode: 'MZ',
      currencies: [ 'USD', 'MZN' ]
    },
    {
      countryName: 'Nigeria',
      countryCode: 'NG',
      currencies: [ 'USD', 'NGN' ]
    },
    { countryName: 'Panama', countryCode: 'PA', currencies: [ 'USD' ] },
    {
      countryName: 'Paraguay',
      countryCode: 'PY',
      currencies: [ 'USD', 'PYG' ]
    },
    {
      countryName: 'Peru',
      countryCode: 'PE',
      currencies: [ 'USD', 'PEN' ]
    },
    {
      countryName: 'Russia',
      countryCode: 'RU',
      currencies: [ 'USD', 'RUB' ]
    },
    {
      countryName: 'Rwanda',
      countryCode: 'RW',
      currencies: [ 'USD', 'RWF' ]
    },
    {
      countryName: 'Senegal',
      countryCode: 'SN',
      currencies: [ 'USD', 'XOF' ]
    },
    {
      countryName: 'Singapore',
      countryCode: 'SG',
      currencies: [ 'USD', 'SGD' ]
    },
    {
      countryName: 'South Africa',
      countryCode: 'ZA',
      currencies: [ 'USD', 'ZAR' ]
    },
    {
      countryName: 'Tanzania',
      countryCode: 'TZ',
      currencies: [ 'USD', 'TZS' ]
    },
    {
      countryName: 'Thailand',
      countryCode: 'TH',
      currencies: [ 'USD', 'THB' ]
    },
    {
      countryName: 'Turkey',
      countryCode: 'TR',
      currencies: [ 'USD', 'TRY' ]
    },
    {
      countryName: 'Uganda',
      countryCode: 'UG',
      currencies: [ 'USD', 'UGX' ]
    },
    {
      countryName: 'United Kingdom',
      countryCode: 'GB',
      currencies: [ 'USD', 'GBP' ]
    },
    {
      countryName: 'Uruguay',
      countryCode: 'UY',
      currencies: [ 'USD', 'UYU' ]
    },
    {
      countryName: 'Vietnam',
      countryCode: 'VN',
      currencies: [ 'USD', 'VND' ]
    },
    {
      countryName: 'Zambia',
      countryCode: 'ZM',
      currencies: [ 'USD', 'ZMW' ]
    },
    {
      countryName: 'Zimbabwe',
      countryCode: 'ZW',
      currencies: [ 'USD', 'ZWB' ]
    }
  ]
  

  const handleCountryChange = (countryCode:any) => {
    setSelectedCountry(countryCode);

    // Establecer moneda específica para Colombia y Perú
    if (countryCode === 'CO') {
      setSelectedCurrency('COP');
    } else if (countryCode === 'PE') {
      setSelectedCurrency('PEN');
    } else {
      // Si no es Colombia ni Perú, buscar las monedas del país seleccionado
      const selectedCountryData = countryData.find(item => item.countryCode === countryCode);
      if (selectedCountryData) {
        setSelectedCurrency(selectedCountryData.currencies[0]);
      }
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
      currency: selectedCurrency,
      amount: formattedAmount,
      language: 'ES',
      description: description,
    });

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
      setCheckout(responseData.data);
      Linking.openURL(responseData.data).catch((err) => console.error('Error al abrir el enlace: ', err));

      setCity('');
      setAddress('');
      setPostCode('');
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    } finally {
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };

  return (
    <ImageBackground source={require('../assets/images/bg.jpeg')} style={{ flex: 1 }}>
      
        <View style={{ marginTop: '65%', paddingHorizontal: 30 }}>
        <ScrollView >
          <Text style={{ marginBottom: 8, color: 'black', fontWeight: 'bold' }}>Select Country</Text>
          <Picker
        selectedValue={selectedCountry}
        onValueChange={(itemValue) => handleCountryChange(itemValue)}
        style={pickerStyles.input}
      >
        <Picker.Item label="Select a country" value={null} />
        {countryData.map((country) => (
          <Picker.Item
            key={country.countryCode}
            label={country.countryName}
            value={country.countryCode}
          />
        ))}
      </Picker>

          <Text style={{ marginBottom: 8, color: 'black', fontWeight: 'bold' }}>Select Currency</Text>
          
          <Picker
          selectedValue={selectedCurrency}
          onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
          style={pickerStyles.input}
        >
          {selectedCountry === 'CO' || selectedCountry === 'PE' ? (
            <Picker.Item label={selectedCurrency} value={selectedCurrency} />
          ) : (
            (countryData.find((country) => country.countryCode === selectedCountry)?.currencies || []).map((currency) => (
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
            />
          </View>




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

          {isLoading && (
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="green" />
            </View>
          )}
</ScrollView>
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



  },
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
   
  },
});

export default Consigna;