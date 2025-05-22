import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Login from '../components/Login';

type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
  Cadastro: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleNavigate = (screen: string) => {
    if (screen === 'MainApp') {
      navigation.navigate('MainApp');
    }
    if (screen === 'Cadastro') {
      navigation.navigate('Cadastro');
    }
  };

  return (
    <>
      <Login 
        currentScreen='Login' 
        onBack={() => navigation.goBack()} 
        onNavigate={handleNavigate} 
      />
    </>
  );
};

const styles = StyleSheet.create({
  
});

export default LoginScreen;