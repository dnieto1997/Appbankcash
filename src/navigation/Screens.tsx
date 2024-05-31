import 'react-native-gesture-handler';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Abona, Articles, Home, Profile, Register,Envia, Retira, CambiosDivisas, ChangePasswordScreen} from '../screens';
import {useScreenOptions, useTranslation} from '../hooks';
import Login from '../screens/Login';
import Tarjeta from '../screens/Tarjeta';
import Movimientos from '../screens/Movimientos';
import Remesas from '../screens/Remesas';
import Consigna from '../screens/Consigna';
import Swap from '../screens/Swap';



const Stack = createStackNavigator();

export default () => {
  const {t} = useTranslation();
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions.stack} initialRouteName='Login'>


<Stack.Screen
        name="Login"
        component={Login}
        options ={(navigation)=>({
       
          headerTitleAlign:'center', headerShown: false
       
       
            })}
      />


      <Stack.Screen
        name="Home"
        component={Home}
        options={{title: t('navigation.home')}}
      />

      
<Stack.Screen
        name="Movimientos"
        component={Movimientos}
        options={{title: t('navigation.movimientos')}}
      />
      
      <Stack.Screen
        name="Abona"
        component={Abona}
        options={{title: t('navigation.abona')}}
      />

       
<Stack.Screen
        name="Consigna"
        component={Consigna}
        options={{title: t('navigation.consigna')}}
      />



<Stack.Screen
        name="Remesas"
        component={Remesas}
        options={{title: t('navigation.remesas')}}
      />

       <Stack.Screen
        name="Envia"
        component={Envia}
        options={{title: t('navigation.envia')}}
      />

      <Stack.Screen
        name="Retira"
        component={Retira}
        options={{title: t('navigation.retira')}}
      />

     <Stack.Screen
        name="CambiosDivisas"
        component={CambiosDivisas}
        options={{title: t('navigation.cambios')}}
      />


<Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{title: t('navigation.password')}}
      />


  

      <Stack.Screen
        name="Articles"
        component={Articles}
        options={{title: t('navigation.articles')}}
      />

      
<Stack.Screen
        name="Swap"
        component={Swap}
        options={{title: t('navigation.swap')}}
      />


      <Stack.Screen
        name="Profile"
        component={Profile}
        
      />

<Stack.Screen
        name="Tarjeta"
        component={Tarjeta}
     
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      
    </Stack.Navigator>
  );
};
