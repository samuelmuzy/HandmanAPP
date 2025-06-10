import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Login from '../components/login/Login';
import LoginFornecedor from '../components/login/LoginFornecedor';
type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
  Cadastro: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isFornecedor, setIsFornecedor] = useState(false);

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
    {isFornecedor ? (
      <LoginFornecedor
        currentScreen='LoginFornecedor'
        onBack={() => navigation.goBack()}
        onNavigate={handleNavigate}
      />
    ) : (
      <Login 
        currentScreen='Login' 
        onBack={() => navigation.goBack()} 
        onNavigate={handleNavigate} 
        isFornecedor={isFornecedor}
        setIsFornecedor={setIsFornecedor}
      />
    )}
    </>
  );
};

export default LoginScreen;