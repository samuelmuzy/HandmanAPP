import React from 'react';
import Cadastro from '../components/Cadastro';
import CadastroFornecedor from '../components/CadastroFornecedor';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
  Cadastro: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CadastroScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isFornecedor, setIsFornecedor] = useState(false);

  const handleNavigate = (screen: string) => {
    if (screen === 'Login') {
      navigation.navigate('Login');
    }
  };

  return (
    <>
<<<<<<< HEAD
      {isFornecedor ? (
        <CadastroFornecedor
          currentScreen='CadastroFornecedor'
          onBack={() => navigation.goBack()}
          onNavigate={handleNavigate}
        />
      ) : (
        <Cadastro 
          currentScreen='Cadastro' 
          onBack={() => navigation.goBack()} 
          onNavigate={handleNavigate}
          isFornecedor={isFornecedor}
          setIsFornecedor={setIsFornecedor}
        />
      )}
=======
      <Cadastro onNavigate={handleNavigate} />
>>>>>>> cbf92d8044a778853fef1fe14218784b147c4fde
    </>
  );
};


export default CadastroScreen;