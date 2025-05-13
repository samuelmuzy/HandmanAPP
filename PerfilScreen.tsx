import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, Image, Switch } from 'react-native';
import BarraDeNavegacao from './BarraDeNavegacao';

const { width, height } = Dimensions.get('window');

interface PerfilScreenProps {
}

const PerfilScreen: React.FC<PerfilScreenProps> = () => {
  const [isPrestador, setIsPrestador] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Perfil');

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  const togglePrestador = () => {
    setIsPrestador(previousState => !previousState);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>
        </View>

        <View style={styles.profileInfo}>
          <Image source={require('./assets/handman.jpg')} style={styles.avatar} />
          <Text style={styles.name}>Nome do Usuário</Text>
          <Text style={styles.email}>email@exemplo.com</Text>

          <View style={styles.prestadorSwitch}>
            <Text>Prestador de Serviço?</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isPrestador ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={togglePrestador}
              value={isPrestador}
            />
          </View>
        </View>

        {isPrestador ? (
          <View style={styles.prestadorDetails}>
            <Text style={styles.sectionTitle}>Detalhes do Prestador</Text>
            <TextInput style={styles.input} placeholder="Área de Atuação" />
            <TextInput style={styles.input} placeholder="Descrição dos Serviços" multiline />
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Salvar Detalhes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.clienteDetails}>
            <Text style={styles.sectionTitle}>Detalhes do Cliente</Text>
            <TextInput style={styles.input} placeholder="Endereço" />
            <TextInput style={styles.input} placeholder="Telefone" />
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Salvar Detalhes</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
      <BarraDeNavegacao onNavigate={handleNavigate} activeScreen={currentScreen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.05,
    backgroundColor: '#f5f5f5',
    paddingBottom: height * 0.1,
  },
  header: {
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  avatar: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    marginBottom: height * 0.01,
  },
  name: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: width * 0.04,
    color: '#666',
  },
  prestadorSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: height * 0.02,
  },
  prestadorDetails: {
    marginBottom: height * 0.03,
  },
  clienteDetails: {
    marginBottom: height * 0.03,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.02,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: width * 0.03,
    marginBottom: height * 0.02,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#AD5700',
    padding: width * 0.03,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#AD5700',
    padding: width * 0.03,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PerfilScreen;