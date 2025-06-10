import React from 'react';
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
    if (screen === 'Login') {
      navigation.navigate('Login');
    }
  };


  return (
    <>
      <Cadastro onNavigate={handleNavigate} />
    </>
  );
};


export default CadastroScreen;