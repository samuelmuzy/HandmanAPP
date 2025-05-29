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
import HeaderNavigation from '../../HeaderNavigation';
import BarraDeNavegacao from '../../BarraDeNavegacao';
import dbPromise from '../../db';
import { authService } from '../services/authService';

const { width, height } = Dimensions.get('window');
const backgroundImage = require('../assets/handman.jpg');

interface CadastroScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  currentScreen: string;
}

const Cadastro: React.FC<CadastroScreenProps> = ({ onBack, onNavigate, currentScreen }) => {
  const [step, setStep] = useState(1);
  const [isPrestador, setIsPrestador] = useState(false);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [genero, setGenero] = useState('');
  const [aniversario, setAniversario] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [areaAtuacao, setAreaAtuacao] = useState('');
  const [descricaoServicos, setDescricaoServicos] = useState('');

  const handleCadastroPress = async () => {
    try {
      if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
      }

      const usuarioData = {
        nome: `${nome} ${sobrenome}`,
        email: email,
        senha: senha,
        telefone: telefone,
        endereco: {
          rua: endereco,
          cidade: cidade,
          estado: estado,
          cep: cep
        },
        formaPagamento: [], // Array vazio inicial para formas de pagamento
        historico_servicos: [],
        autenticacaoVia: "local", // Array vazio inicial para histórico de serviços
        role: 'usuario'
      };

      const result = await authService.cadastro(usuarioData);
      
      if (result.success) {
        alert('Cadastro realizado com sucesso!');
        onNavigate('Login'); // Navega para a tela de login após o cadastro
      } else {
        alert(result.message || 'Erro ao realizar cadastro');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar. Verifique os dados e tente novamente.');
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <TextInput style={styles.input} placeholder="Primeiro Nome" value={nome} onChangeText={setNome} />
            <TextInput style={styles.input} placeholder="Sobrenome" value={sobrenome} onChangeText={setSobrenome} />
            <View style={styles.prestadorSwitch}>
              <Text>Prestador de Serviço?</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isPrestador ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => setIsPrestador(!isPrestador)}
                value={isPrestador}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={nextStep}>
              <Text style={styles.buttonText}>Próxima etapa</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View>
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Telefone" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />
            <TextInput style={styles.input} placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
            <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
            <TextInput style={styles.input} placeholder="Estado" value={estado} onChangeText={setEstado} />
            <TextInput style={styles.input} placeholder="CEP" keyboardType="numeric" value={cep} onChangeText={setCep} />
            <TouchableOpacity style={styles.button} onPress={nextStep}>
              <Text style={styles.buttonText}>Próxima etapa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View>
            <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
            <TextInput style={styles.input} placeholder="Confirmar Senha" secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} />
            <TouchableOpacity style={styles.button} onPress={handleCadastroPress}>
              <Text style={styles.buttonText}>Registrar-se</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={prevStep}>
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ImageBackground source={backgroundImage} style={styles.background}>
          <View style={styles.main}>
            <Text style={styles.title}>Crie sua conta</Text>
            {renderStep()}
          </View>
        </ImageBackground>
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.05,
    backgroundColor: '#EEB16C',
    paddingBottom: height * 0.1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '90%',
    marginTop: height * 0.08,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.70)',
    borderRadius: 20,
    padding: width * 0.05,
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  input: {
    height: height * 0.06,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: width * 0.03,
    backgroundColor: 'white',
    marginBottom: height * 0.02,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#AD5700',
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.1,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#AD5700',
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.1,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  backButtonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  prestadorSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: height * 0.02,
  },
});

export default Cadastro;