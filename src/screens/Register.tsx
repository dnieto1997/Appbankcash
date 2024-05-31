import React, { useCallback, useEffect, useState } from 'react';
import { Linking, Platform, ImageBackground, Alert, View, TouchableOpacity,StyleSheet,ActivityIndicator  } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { useData, useTheme, useTranslation } from '../hooks/';
import * as regex from '../constants/regex';
import { Block, Button, Input, Image, Text, Checkbox } from '../components/';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';



const isAndroid = Platform.OS === 'android';

interface IRegistration {
  name: string;
  lastname: string;
  numdoc: string;
  email: string;
  password: string;
  phone: string;
  agreed: boolean;
  typeDocument:string;
}
interface IRegistrationValidation {
  name: boolean;
  lastname: boolean;
  numdoc: boolean;
  email: boolean;
  password: boolean;
  phone: boolean;
  agreed: boolean;
  typeDocument:boolean;
}

const Register = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(''); // State for selected value
  const [selectDoc, setSelectDoc] = useState(null);
  const [token, setToken] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    name: false,
    lastname: false,
    numdoc: false,
    email: false,
    password: false,
    phone: false,
    agreed: false,
    typeDocument:false
  });
  const [registration, setRegistration] = useState<IRegistration>({
    name: '',
    lastname: '',
    numdoc: '',
    email: '',
    password: '',
    phone: '',
    typeDocument: '',
    agreed: false
  });
  const { assets, colors, gradients, sizes } = useTheme();

  const handleChange = useCallback(
    (value: IRegistration) => {
      setRegistration((state) => ({ ...state, ...value }));
    },
    [setRegistration],
  );

  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [photoUri, setPhotoUri] = useState('');
  const [countries, setCountries] = useState([]); // Para almacenar los datos de los países
  const handleSignUp = async () => {
    try {
      setIsLoading(true);
  
      const registrationData = {
        names: registration.name,
        surnames: registration.lastname,
        numDocument: registration.numdoc,
        typeDocument: selectedDoc,
        email: registration.email,
        password: registration.password,
        cellphone: registration.phone,
        country: selectedCountryId,
      };
  
      const formData = new FormData();
  
      for (const key in registrationData) {
        formData.append(key, registrationData[key]);
      }
      if (selectedImageUri) {
        const imageUriToAdd = selectedImageUri;
        if (imageUriToAdd) {
          const uriParts = imageUriToAdd.split('/');
          const imageName = uriParts[uriParts.length - 1];
          const file1 = {
            uri: imageUriToAdd,
            name: imageName,
            type: 'image/jpeg', // Asegúrate de que coincida con el tipo de archivo correcto
          };
          formData.append('documentFile', file1);
        }
      }
      
      
      if (photoUri) {
        const imageUriToAdd = photoUri;
        if (imageUriToAdd) {
          const uriParts = imageUriToAdd.split('/');
          const imageName = uriParts[uriParts.length - 1];
          const file1 = {
            uri: imageUriToAdd,
            name: imageName,
            type: 'image/jpeg', // Asegúrate de que coincida con el tipo de archivo correcto
          };
         formData.append('documentFile', file1); 
        }
      }
    
      
      
      
      const requestOptions = {
        method: 'POST',
        body: formData,
      };
  
      const response = await fetch('https://bankcashapi-production.up.railway.app/api/auth/register', requestOptions);
  
      if (!response.ok) {
        console.log('Error in response:', response);
        const responseText = await response.text();
        console.log('Response body:', responseText);
        throw new Error('Registration failed');
      }
  
      const responseData = await response.json();
  
      if (responseData && responseData.status === 400) {
        const errorMessages = responseData.message.map((message) => {
          if (/^\d+\.\s/.test(message)) {
            return `\u2022 ${message.substring(message.indexOf('. ') + 2)}`;
          } else {
            return `\u2022 ${message}`;
          }
        }).join('\n\n');
        console.log(errorMessages);
        throw new Error('Validation error');
      } else {
        Alert.alert('Registration Success', 'You have been successfully registered!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      }
    } catch (error) {
      console.log('An error occurred:', error);
      // Maneja otros errores aquí si es necesario
    } finally {
      setIsLoading(false);
    }
  };
  
  
  
  
  const resetState = () => {
    setRegistration({
      name: '',
      lastname: '',
      numdoc: '',
      email: '',
      password: '',
      phone: '',
      typeDocument: '',
      agreed: false,
    });
    setSelectedImageUri('');
    setPhotoUri('');
    setSelectedDoc('');
    setSelectedCountryId(null);
  };
  

  
  
  


  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      name: regex.name.test(registration.name),
      email: regex.email.test(registration.email),
      password: regex.password.test(registration.password),
      lastname: regex.name.test(registration.lastname),
      numdoc: regex.numdoc.test(registration.numdoc),
      phone: regex.phone.test(registration.phone),
      agreed: registration.agreed,


    }));
  }, [registration, setIsValid]);

  const selectImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) { // Usar result.cancelled en lugar de result.canceled
      setPhotoUri(result.assets[0].uri); 
    }
  };
  
  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
   
      setPhotoUri(result.assets[0].uri);
    }
  };

  
 

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
        setCountries(data);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://bankcashapi-production.up.railway.app/api/users/type-documents', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setSelectDoc(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);


  return (

    <ImageBackground source={require('../assets/images/bg.jpeg')} style={{ flex: 1 }}>

      <Block safe marginTop={sizes.xxl}>
        <Block paddingHorizontal={sizes.xs}>
          <Block flex={0} style={{ zIndex: 0 }}>
            <Image
              background
              resizeMode="cover"
              padding={sizes.sm}
              radius={sizes.cardRadius}

              height={sizes.height * 0.4}>
              <Button
                row
                flex={0}
                justify="flex-start"
                onPress={() => navigation.goBack()}>
                <Image
                  radius={0}
                  width={10}
                  height={18}
                  color={colors.white}
                  source={assets.arrow}
                  transform={[{ rotate: '180deg' }]}
                />
                <Text p white marginLeft={sizes.s}>
                  {t('common.goBack')}
                </Text>
              </Button>


            </Image>
          </Block>


      

          <Block
            keyboard
            behavior={!isAndroid ? 'padding' : 'height'}
            marginTop={-(sizes.height * 0.2 - sizes.l)}>
            <Block
              flex={0}
              radius={sizes.sm}
              marginHorizontal="8%"
              shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
            >
              <Block
                blur
                flex={0}
                intensity={150}
                radius={sizes.sm}
                overflow="hidden"
                justify="space-evenly"
                tint={colors.blurTint}
                paddingVertical={sizes.sm}>

                <Block
                  row
                  flex={0}
                  align="center"
                  justify="center"
                  marginBottom={sizes.sm}
                  paddingHorizontal={sizes.xxl}>
                  <Block
                    flex={0}
                    height={1}
                    width="50%"
                    end={[1, 0]}
                    start={[0, 1]}
                    gradient={gradients.divider}
                  />

                  <Block
                    flex={0}
                    height={1}
                    width="50%"
                    end={[0, 1]}
                    start={[1, 0]}
                    gradient={gradients.divider}
                  />
                </Block>
                {/* form inputs */}
                <Block paddingHorizontal={sizes.sm}>
                  <Input
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    label='Names'
                    placeholder='Names'
                    success={Boolean(registration.name && isValid.name)}
                    danger={Boolean(registration.name && !isValid.name)}
                    onChangeText={(value) => handleChange({ name: value })}
                    color={colors.black}
                  />

                  <Input
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    label='Last Names'
                    placeholder='Last Names'
                    success={Boolean(registration.lastname && isValid.lastname)}
                    danger={Boolean(registration.lastname && !isValid.lastname)}
                    onChangeText={(value) => handleChange({ lastname: value })}
                    color={colors.black}
                  />
                  <Input

                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    label='ID Number'
                    placeholder='ID Number'
                    success={Boolean(registration.numdoc && isValid.numdoc)}
                    danger={Boolean(registration.numdoc && !isValid.numdoc)}
                    onChangeText={(value) => handleChange({ numdoc: value })}
                    color={colors.black}
                    keyboardType="numeric"
                    
                  />

<View>
                  <Text>Selecciona tu Documento</Text>
                </View>
                <View>
      <Picker
        selectedValue={selectedDoc}
        onValueChange={(itemValue) => setSelectedDoc(itemValue)}
      >
        {/* Placeholder */}
        <Picker.Item label="Select Document..." value={null} />

        {/* Map the data to Picker.Item */}
        {selectDoc &&
          selectDoc.map((item) => (
            <Picker.Item
              key={item.idTypeDocument}
              label={item.shortName}
              value={item.idTypeDocument}
            />
          ))}
      </Picker>
    </View>
                  <Input
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    label={t('common.email')}
                    keyboardType="email-address"
                    placeholder={t('common.emailPlaceholder')}
                    success={Boolean(registration.email && isValid.email)}
                    danger={Boolean(registration.email && !isValid.email)}
                    onChangeText={(value) => handleChange({ email: value })}
                    color={colors.black}
                  />
                  <Input
                    secureTextEntry
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    label={t('common.password')}
                    placeholder={t('common.passwordPlaceholder')}
                    onChangeText={(value) => handleChange({ password: value })}
                    success={Boolean(registration.password && isValid.password)}
                    danger={Boolean(registration.password && !isValid.password)}
                    color={colors.black}
                  />


                  <Input
                    autoCapitalize="none"
                    marginBottom={sizes.m}
                    label='CellPhone'
                    placeholder='CellPhone'
                    success={Boolean(registration.phone && isValid.phone)}
                    danger={Boolean(registration.phone && !isValid.phone)}
                    onChangeText={(value) => handleChange({ phone: value })}
                    color={colors.black}
                    keyboardType="numeric"

                  />


                </Block>

                   <Block>
                    <Text>Subir documento</Text>
                   </Block>

                <View style={{ flex: 1,alignSelf:'center',flexDirection:'row' }} >
                  <View style={{width:'40%',margin:15}}>
                    <Button color={colors.success} onPress={selectImageFromGallery} >
                      <Text> Abrir Galeria</Text>
                    </Button>
                  </View>

                  <View style={{width:'40%',margin:15}}>

                    <Button color={colors.success} onPress={openCamera}>
                      <Text>Tomar Foto</Text>
                    </Button>
                  </View>


                </View>

                <View>
                  <Text>Selecciona tu país de residencia</Text>
                </View>

                <Picker
                  selectedValue={selectedCountryId}
                  onValueChange={(itemValue) => setSelectedCountryId(itemValue)}
                  style={pickerStyles.input}>
                  <Picker.Item label="Select Country..." value={null} />
                  {countries.map((country:any) => (
                    <Picker.Item
                      key={country.idCountry.toString()}
                      label={country.countryName}
                      value={country.idCountry.toString()}
                    />
                  ))}
                </Picker>



                {/* checkbox terms */}
                <Block row flex={0} align="center" paddingHorizontal={sizes.sm}>
                  <Checkbox
                    marginRight={sizes.sm}
                    checked={registration?.agreed}
                    onPress={(value) => handleChange({ agreed: value })}
                  />

                </Block>

    
                <Button
  onPress={() => handleSignUp()}
  marginVertical={sizes.s}
  marginHorizontal={sizes.sm}
  color={colors.success}
  disabled={Object.values(isValid).includes(false) || isLoading} // Desactiva el botón si isLoading es true
>
  {isLoading ? (
    <ActivityIndicator size="small" color={colors.white} /> // Muestra el indicador de carga
  ) : (
    <Text bold white transform="uppercase">
      {t('common.signup')}
    </Text>
  )}
</Button>


              </Block>
            </Block>
          </Block>
        </Block>
      </Block>

    </ImageBackground>
  );
};
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
  },loader: {
    ...StyleSheet.absoluteFillObject, // Esto cubrirá toda la pantalla
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Color de fondo semitransparente
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Register;
