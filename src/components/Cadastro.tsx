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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
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
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  

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
            <TouchableOpacity 
              style={styles.loginBackButton}
              onPress={() => onNavigate('Login')}
            >
              <Text style={styles.buttonText}>Voltar</Text>
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.container} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>HANDYMAN</Text>
            <Text style={styles.subtitle}>Crie sua conta{'\n'}e encontre profissionais!</Text>
            <Text style={styles.description}>A sua plataforma confiável para serviços manuais!</Text>
          </View>

          <View style={styles.card}>
            {renderStep()}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#B54708',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    color: '#B54708',
    marginBottom: 8,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: '#B54708',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#EEB16C',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    margin: 10,
    flex: 1,
  },
  input: {
    backgroundColor: '#FFE1C5',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: '#333',
    height: 56,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#7A2D00',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#7A2D00',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 5,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginBackButton: {
    backgroundColor: '#7A2D00',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  prestadorSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFE1C5',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
});

export default Cadastro;