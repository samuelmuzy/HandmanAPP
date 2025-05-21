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
import HeaderNavigation from './HeaderNavigation';
import BarraDeNavegacao from './BarraDeNavegacao';
import dbPromise from './db';

const { width, height } = Dimensions.get('window');
const backgroundImage = require('./assets/handman.jpg');

interface LoginScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  currentScreen: string;
}

type User = {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
  isPrestador: number;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onBack, onNavigate, currentScreen }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const db = await dbPromise;

      const result = await db.getFirstAsync<User>(
        `SELECT * FROM users WHERE email = ? AND senha = ?`,
        [email, senha]
      );

      if (result) {
        Alert.alert('Login realizado com sucesso!', `Bem-vindo(a), ${result.nome}!`);
        onBack(); // Return to main app after successful login
      } else {
        Alert.alert('Erro de login', 'Email ou senha incorretos.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <HeaderNavigation onNavigate={onNavigate} activeScreen={currentScreen} />
        <ImageBackground source={backgroundImage} style={styles.background}>
          <View style={styles.main}>
            <Text style={styles.title}>Login</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor="#333"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry
              placeholderTextColor="#333"
              value={senha}
              onChangeText={setSenha}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Text style={styles.backButtonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.signupText}>
              Não possui conta? <Text style={styles.signupLink}>Cadastrar-se</Text>
            </Text>
          </View>
        </ImageBackground>
      </ScrollView>
      <BarraDeNavegacao onNavigate={onNavigate} activeScreen={currentScreen} />
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
    height: '100%',
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
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: width * 0.03,
    backgroundColor: 'white',
    marginBottom: height * 0.02,
  },
  button: {
    backgroundColor: '#AD5700',
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.1,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: width * 0.02,
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: height * 0.02,
    fontSize: width * 0.035,
    color: '#333',
  },
  signupLink: {
    color: '#AD5700',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#AD5700',
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.1,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: width * 0.02,
  },
  backButtonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.02,
  },
});

export default LoginScreen;