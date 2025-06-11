import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import { useNavigation, useRoute, CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootTabParamList } from '../navigation/TabNavigation';
import { FornecedorStackParamList } from '../navigation/FornecedorStackNavigation';
import { typeEndereco } from '../model/User';
import { UserService } from '../services/UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetToken } from '../hooks/useGetToken';

interface FormattedAddress {
    street: string;
    city: string;
    region: string;
    postalCode: string;
}

type LocalizacaoScreenNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList, 'FornecedorStack'>,
    NativeStackNavigationProp<FornecedorStackParamList, 'LocalizacaoScreen'>
>;

type LocalizacaoScreenRouteProp = RouteProp<FornecedorStackParamList, 'LocalizacaoScreen'>;

export const LocalizacaoScreen = () => {
    const [location, setLocation] = useState<LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [enderecoFormatado, setEnderecoFormatado] = useState<FormattedAddress | null>(null);
    const [modalVisivel, setModalVisivel] = useState(false);

    console.log(location)
    
    const tokenUser = useGetToken();

    const [enderecoManual, setEnderecoManual] = useState<FormattedAddress>({
        street: '',
        city: '',
        region: '',
        postalCode: '',
    });

    const navigation = useNavigation<LocalizacaoScreenNavigationProp>();
    const route = useRoute<LocalizacaoScreenRouteProp>();
    const { fornecedorId } = route.params;

    const obterEndereco = async (latitude: number, longitude: number) => {
        try {
            
            const enderecos = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            });

                const endereco = enderecos[0];
                setEnderecoFormatado({
                    street: endereco.street || '',
                    city: endereco.district || '',
                    region: endereco.region || '',
                    postalCode: endereco.postalCode || '',
                });
                setErrorMsg(null);
            
        } catch (error) {
            setErrorMsg('Erro ao obter endereço. Tente novamente ou insira manualmente.');
            console.error("Erro ao reverter geocodificação:", error);
        }
    };

    const obterLocalizacaoAtual = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permissão para acessar a localização foi negada. Por favor, insira o endereço manualmente.');
                setModalVisivel(true); // Abre a modal para inserção manual
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
                timeInterval: 5000,
                distanceInterval: 10
            });
            setLocation(currentLocation);

            if (currentLocation) {
                await obterEndereco(
                    currentLocation.coords.latitude,
                    currentLocation.coords.longitude
                );
            }
        } catch (error) {
            setErrorMsg('Erro ao obter localização. Verifique suas configurações de localização.');
            setModalVisivel(true); // Abre a modal em caso de erro na localização
            console.error("Erro ao obter localização atual:", error);
        }
    };

    const handleSalvarEnderecoManual = () => {
        if (!enderecoManual.street || !enderecoManual.city || !enderecoManual.region || !enderecoManual.postalCode) {
            Alert.alert("Campos incompletos", "Por favor, preencha todos os campos do endereço.");
            return;
        }
        setEnderecoFormatado(enderecoManual);
        setModalVisivel(false);
        setErrorMsg(null);
    };

    const handleContinuar = async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            
            if (!token) {
                Alert.alert("Erro", "Token não encontrado. Por favor, faça login novamente.");
                return;
            }

            if (!tokenUser?.id) {
                Alert.alert("Erro", "ID do usuário não encontrado. Por favor, faça login novamente.");
                return;
            }

            if (!enderecoFormatado) {
                Alert.alert("Atenção", "Nenhum endereço foi definido. Por favor, selecione ou insira um.");
                return;
            }

            const body: typeEndereco = {
                cidade: enderecoFormatado.city,
                cep: enderecoFormatado.postalCode,
                estado: enderecoFormatado.region,
                rua: enderecoFormatado.street
            };
            
            await UserService.updateUser(body, token, tokenUser.id);
    
            navigation.navigate('AgendamentoScreen', {
                fornecedorId: fornecedorId
            });
            
        } catch (error) {
            console.error("Erro ao atualizar endereço:", error);
            Alert.alert("Erro", "Não foi possível atualizar o endereço. Tente novamente mais tarde.");
        }
    }


return (
    <View style={styles.container}>
        <View style={styles.card}>
            <Text style={styles.tituloCard}>Endereço para o serviço</Text>

            {errorMsg && <Text style={styles.erro}>{errorMsg}</Text>}

            {enderecoFormatado ? (
                <View style={styles.infoContainer}>
                    <View style={styles.infoItem}>
                        <Ionicons name="location-outline" size={20} color="#FF9B00" />
                        <Text style={styles.infoText}>Rua: {enderecoFormatado.street || 'Não informado'}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="business-outline" size={20} color="#FF9B00" />
                        <Text style={styles.infoText}>Cidade: {enderecoFormatado.city || 'Não informado'}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="map-outline" size={20} color="#FF9B00" />
                        <Text style={styles.infoText}>Estado: {enderecoFormatado.region || 'Não informado'}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="mail-outline" size={20} color="#FF9B00" />
                        <Text style={styles.infoText}>CEP: {enderecoFormatado.postalCode || 'Não informado'}</Text>
                    </View>
                </View>
            ) : (
                <Text style={styles.placeholderText}>Carregando endereço ou aguardando inserção manual...</Text>
            )}

            <TouchableOpacity
                style={[styles.botaoCard, styles.botaoLaranja]}
                onPress={() => setModalVisivel(true)}
            >
                <Text style={styles.botaoCardTexto}>Alterar localização</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.botaoCard, styles.botaoVerde]}
                onPress={obterLocalizacaoAtual}
            >
                <Text style={styles.botaoCardTexto}>Usar localização atual</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.botaoCard, styles.botaoVerde]}
                onPress={handleContinuar}
            >
                <Text style={styles.botaoCardTexto}>Continuar</Text>
            </TouchableOpacity>
        </View>

        <Modal
            visible={modalVisivel}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisivel(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitulo}>Inserir Endereço Manualmente</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Rua"
                        value={enderecoManual.street}
                        onChangeText={(text) => setEnderecoManual({ ...enderecoManual, street: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Cidade"
                        value={enderecoManual.city}
                        onChangeText={(text) => setEnderecoManual({ ...enderecoManual, city: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Estado (Ex: MG)"
                        value={enderecoManual.region}
                        onChangeText={(text) => setEnderecoManual({ ...enderecoManual, region: text })}
                        maxLength={2} // Assumindo sigla do estado
                        autoCapitalize="characters"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="CEP (apenas números)"
                        value={enderecoManual.postalCode}
                        onChangeText={(text) => setEnderecoManual({ ...enderecoManual, postalCode: text.replace(/[^0-9]/g, '') })}
                        keyboardType="numeric"
                        maxLength={8} // CEP sem hífen
                    />

                    <View style={styles.modalBotoes}>
                        <TouchableOpacity
                            style={[styles.botao, styles.botaoSecundario]}
                            onPress={() => setModalVisivel(false)}
                        >
                            <Text style={styles.botaoTexto}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.botao, styles.botaoPrimario]}
                            onPress={handleSalvarEnderecoManual}
                        >
                            <Text style={styles.botaoTexto}>Salvar Endereço</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    </View>
);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        width: '95%', // Ajuste para ser mais parecido com a imagem
        maxWidth: 500,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'flex-start', // Alinha os itens do card à esquerda
    },
    tituloCard: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FF9B00', // Cor laranja como na imagem
        alignSelf: 'center', // Centraliza o título
    },
    infoContainer: {
        width: '100%',
        marginBottom: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    placeholderText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        width: '100%',
        marginBottom: 20,
    },
    erro: {
        fontSize: 15,
        color: 'red',
        marginBottom: 15,
        textAlign: 'center',
        width: '100%',
    },
    botaoCard: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 15,
        width: '100%',
        alignItems: 'center',
    },
    botaoLaranja: {
        backgroundColor: '#FF9B00', // Laranja como na imagem
    },
    botaoVerde: {
        backgroundColor: '#5CB85C', // Verde como na imagem
    },
    botaoCardTexto: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        alignItems: 'center',
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        width: '100%',
        fontSize: 16,
    },
    modalBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        width: '100%',
        marginTop: 10,
    },
    botao: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    botaoPrimario: {
        backgroundColor: '#007AFF',
    },
    botaoSecundario: {
        backgroundColor: '#6c757d',
    },
    botaoTexto: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});