import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Switch,
  Alert,
} from 'react-native';
import BarraDeNavegacao from '../BarraDeNavegacao';
import dbPromise from '../db';

const { width, height } = Dimensions.get('window');

interface PerfilScreenProps {
  userId: number;
}

interface UserData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  isPrestador: number; // 0 ou 1
  areaAtuacao?: string;
  descricaoServicos?: string;
}

const PerfilScreen: React.FC<PerfilScreenProps> = ({ userId }) => {
  const [currentScreen, setCurrentScreen] = useState<string>('Perfil');
  const [isPrestador, setIsPrestador] = useState<boolean>(false);

  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [telefone, setTelefone] = useState<string>('');
  const [endereco, setEndereco] = useState<string>('');
  const [areaAtuacao, setAreaAtuacao] = useState<string>('');
  const [descricaoServicos, setDescricaoServicos] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const db = await dbPromise;
        const result = await db.getFirstAsync<UserData>(
          `SELECT * FROM users WHERE id = ?`,
          [userId]
        );

        if (result) {
          setNome(result.nome);
          setEmail(result.email);
          setTelefone(result.telefone);
          setEndereco(result.endereco);
          setIsPrestador(result.isPrestador === 1);
          setAreaAtuacao(result.areaAtuacao || '');
          setDescricaoServicos(result.descricaoServicos || '');
        } else {
          Alert.alert('Erro', 'Usuário não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        Alert.alert('Erro', 'Falha ao carregar dados do perfil.');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleSave = async () => {
    try {
      const db = await dbPromise;

      await db.runAsync(
        `UPDATE users SET 
          telefone = ?, 
          endereco = ?, 
          areaAtuacao = ?, 
          descricaoServicos = ?, 
          isPrestador = ?
        WHERE id = ?`,
        [
          telefone,
          endereco,
          isPrestador ? areaAtuacao : null,
          isPrestador ? descricaoServicos : null,
          isPrestador ? 1 : 0,
          userId
        ]
      );

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>
        </View>

        <View style={styles.profileInfo}>
          <Image source={require('./assets/handman.jpg')} style={styles.avatar} />
          <Text style={styles.name}>{nome}</Text>
          <Text style={styles.email}>{email}</Text>

          <View style={styles.prestadorSwitch}>
            <Text>Prestador de Serviço?</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isPrestador ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setIsPrestador(!isPrestador)}
              value={isPrestador}
            />
          </View>
        </View>

        {isPrestador ? (
          <View style={styles.prestadorDetails}>
            <Text style={styles.sectionTitle}>Detalhes do Prestador</Text>
            <TextInput
              style={styles.input}
              placeholder="Área de Atuação"
              value={areaAtuacao}
              onChangeText={setAreaAtuacao}
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição dos Serviços"
              multiline
              value={descricaoServicos}
              onChangeText={setDescricaoServicos}
            />
          </View>
        ) : (
          <View style={styles.clienteDetails}>
            <Text style={styles.sectionTitle}>Detalhes do Cliente</Text>
            <TextInput
              style={styles.input}
              placeholder="Endereço"
              value={endereco}
              onChangeText={setEndereco}
            />
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              value={telefone}
              onChangeText={setTelefone}
            />
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar Detalhes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>

      <BarraDeNavegacao onNavigate={handleNavigate} activeScreen={currentScreen} />
    </View>
  );
};

export default PerfilScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    minHeight: height,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  prestadorSwitch: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ff4444',
    fontWeight: 'bold',
  },
  prestadorDetails: {
    marginTop: 10,
  },
  clienteDetails: {
    marginTop: 10,
  },
});
