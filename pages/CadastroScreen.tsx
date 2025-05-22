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
  Switch,
} from 'react-native';
import HeaderNavigation from '../HeaderNavigation';
import BarraDeNavegacao from '../BarraDeNavegacao';
import dbPromise from '../db';
import Cadastro from '../components/Cadastro';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


const CadastroScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleNavigate = (screen: string) => {
    if (screen === 'MainApp') {
      navigation.navigate('MainApp');
    }
  };


  return (
    <>
      <Cadastro onBack={() => {}} onNavigate={handleNavigate} currentScreen='Cadastro' />
    </>
  );
};

const styles = StyleSheet.create({
 
});

export default CadastroScreen;