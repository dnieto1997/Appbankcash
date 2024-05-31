import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Animated, Linking, StyleSheet, View,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  useIsDrawerOpen,
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

import Screens from './Screens';
import {Block, Text, Switch, Button, Image} from '../components';
import {useData, useTheme, useTranslation} from '../hooks';

const Drawer = createDrawerNavigator();

/* drawer menu screens navigation */
const ScreensStack = () => {
  const {colors} = useTheme();
  const isDrawerOpen = useIsDrawerOpen();
  const animation = useRef(new Animated.Value(0)).current;

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  });

  const borderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const animatedStyle = {
    borderRadius: borderRadius,
    transform: [{scale: scale}],
  };

  useEffect(() => {
    Animated.timing(animation, {
      duration: 200,
      useNativeDriver: true,
      toValue: isDrawerOpen ? 1 : 0,
    }).start();
  }, [isDrawerOpen, animation]);

  return (
    <Animated.View
      style={StyleSheet.flatten([
        animatedStyle,
        {
          flex: 1,
          overflow: 'hidden',
          borderColor: colors.card,
          borderWidth: isDrawerOpen ? 1 : 0,
        },
      ])}>
      {/*  */}
      <Screens />
    </Animated.View>
  );
};

/* custom drawer menu */
const DrawerContent = (
  props: DrawerContentComponentProps<DrawerContentOptions>,
) => {
  const {navigation} = props;
  const {t} = useTranslation();
  const {isDark, handleIsDark} = useData();
  const [active, setActive] = useState('Login');
  const {assets, colors, gradients, sizes} = useTheme();
  const labelColor = colors.text;

  const handleNavigation = useCallback(
    (to) => {
      setActive(to);
      navigation.navigate(to);
    },
    [navigation, setActive],
  );





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




  // screen list for Drawer menu
  const screens = [
    {name: t('screens.home'), to: 'Home', icon: assets.home},
    {name: t('screens.movimientos'), to: 'Movimientos', icon: assets.movimientos},
    {name: t('screens.register'), to: 'ChangePasswordScreen', icon: assets.register},
    {name: t('screens.profile'), to: 'Profile', icon: assets.profile},



  ];

  const screens2 = [

    {name: t('screens.login'), to: 'Login', icon: assets.cerrarsesion}


  ];

  return (
    <DrawerContentScrollView
  
      {...props}
      scrollEnabled
      removeClippedSubviews
      renderToHardwareTextureAndroid
      contentContainerStyle={{paddingBottom: sizes.padding}}>
      

      
      <Block paddingHorizontal={sizes.padding}>
      
      <View style={{marginTop:50}}>
      <Block flex={0} row align="center" marginBottom={sizes.l}>
          <Image
            radius={0}
            width={33}
            height={33}
            color={colors.text}
            source={assets.logo}
            marginRight={sizes.sm}
          />
          <Block>
            <Text size={12} semibold color={colors.white}>
              {t('app.name')}
            </Text>
            
          </Block>
        </Block>
        </View>

        {screens?.map((screen, index) => {
          const isActive = active === screen.to;
          return (

           
            <Button
              row
              justify="flex-start"
              marginBottom={sizes.s}
              key={`menu-screen-${screen.name}-${index}`}
              onPress={() => handleNavigation(screen.to)}>
              <Block
                flex={0}
                radius={6}
                align="center"
                justify="center"
                width={sizes.md}
                height={sizes.md}
                marginRight={sizes.s}
                gradient={gradients[isActive ? 'black' : 'white']}>
                <Image
                  radius={0}
                  width={14}
                  height={14}
                  source={screen.icon}
                  color={colors[isActive ? 'white' : 'black']}
                />
              </Block>
              <Text p semibold={isActive} color={labelColor}>
                {screen.name}
              </Text>
            </Button>

            
          );
        })}



{screens2?.map((screen, index) => {
          const isActive = active === screen.to;
          return (

           
            <Button
              row
              justify="flex-start"
              marginBottom={sizes.s}
              key={`menu-screen-${screen.name}-${index}`}
              onPress={() => handleNavigation2(screen.to)}>
              <Block
                flex={0}
                radius={6}
                align="center"
                justify="center"
                width={sizes.md}
                height={sizes.md}
                marginRight={sizes.s}
                gradient={gradients[isActive ? 'black' : 'white']}>
                <Image
                  radius={0}
                  width={14}
                  height={14}
                  source={screen.icon}
                  color={colors[isActive ? 'white' : 'black']}
                />
              </Block>
              <Text p semibold={isActive} color={labelColor}>
                {screen.name}
              </Text>
            </Button>

            
          );
        })}



      

      </Block>
    </DrawerContentScrollView>
  );
};

/* drawer menu navigation */
export default () => {
  const {gradients,colors} = useTheme();

  return (
    <Block color={colors.dark}>
    
      <Drawer.Navigator
      
        drawerType="slide"
        overlayColor="transparent"
        sceneContainerStyle={{backgroundColor: 'transparent'}}
        drawerContent={(props) => <DrawerContent {...props} />}
        drawerStyle={{
          flex: 1,
          width: '60%',
          borderRightWidth: 0,
          backgroundColor: 'transparent',
        }}>
        <Drawer.Screen name="Screens" component={ScreensStack} />
      </Drawer.Navigator>
    </Block>
  );
};
