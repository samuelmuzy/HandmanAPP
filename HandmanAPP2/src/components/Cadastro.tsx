import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
<<<<<<< HEAD
  Dimensions,
  ImageBackground,
=======
  Switch,
>>>>>>> cbf92d8044a778853fef1fe14218784b147c4fde
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
<<<<<<< HEAD
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderNavigation from '../../HeaderNavigation';
import BarraDeNavegacao from '../../BarraDeNavegacao';
import dbPromise from '../../db';
=======
>>>>>>> cbf92d8044a778853fef1fe14218784b147c4fde
import { authService } from '../services/authService';


interface CadastroScreenProps {
  onNavigate: (screen: string) => void;
<<<<<<< HEAD
  currentScreen: string;
  isFornecedor: boolean;
  setIsFornecedor: (isFornecedor: boolean) => void;
}

const Cadastro: React.FC<CadastroScreenProps> = ({ onBack, onNavigate, currentScreen, isFornecedor, setIsFornecedor }) => {
=======
}

const Cadastro: React.FC<CadastroScreenProps> = ({ onNavigate }) => {
>>>>>>> cbf92d8044a778853fef1fe14218784b147c4fde
  const [step, setStep] = useState(1);
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
        formaPagamento: [], 
        historico_servicos: [],
        autenticacaoVia: "local",
        role: 'usuario'
      };

      const result = await authService.cadastro(usuarioData);
      
      if (result.success) {
        alert('Cadastro realizado com sucesso!');
        onNavigate('Login');
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
            <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('Login')}>
              <Icon name="arrow-left" size={24} color="#7A2D00" />
            </TouchableOpacity>
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
  backButton: {
    marginBottom: 16,
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
});

export default Cadastro;