import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';

export const LocalizacaoScreen = () => {
    const [location, setLocation] = useState<LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [endereco, setEndereco] = useState<string | null>(null);
    const [modoManual, setModoManual] = useState(false);
    const [enderecoManual, setEnderecoManual] = useState('');
    const [modalVisivel, setModalVisivel] = useState(false);

    const obterEndereco = async (latitude: number, longitude: number) => {
        try {
            const enderecos = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            });

            if (enderecos.length > 0) {
                const endereco = enderecos[0];
                const enderecoFormatado = [
                    endereco.street,
                    endereco.district,
                    endereco.city,
                    endereco.region,
                    endereco.postalCode,
                    endereco.country
                ].filter(Boolean).join(', ');
                
                setEndereco(enderecoFormatado);
            }
        } catch (error) {
            setErrorMsg('Erro ao obter endereço');
        }
    };

    const obterLocalizacaoAtual = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setModoManual(true);
                setErrorMsg('Permissão para acessar a localização foi negada');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            
            if (location) {
                await obterEndereco(
                    location.coords.latitude,
                    location.coords.longitude
                );
            }
        } catch (error) {
            setErrorMsg('Erro ao obter localização');
            setModoManual(true);
        }
    };

    useEffect(() => {
        if (!modoManual) {
            obterLocalizacaoAtual();
        }
    }, [modoManual]);

    const salvarEnderecoManual = () => {
        if (enderecoManual.trim()) {
            setEndereco(enderecoManual);
            setModalVisivel(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Ionicons name="location" size={40} color="#007AFF" />
                <Text style={styles.titulo}>Sua Localização</Text>
                
                {errorMsg && !modoManual ? (
                    <Text style={styles.erro}>{errorMsg}</Text>
                ) : (
                    <View style={styles.infoContainer}>
                        <Text style={styles.endereco}>
                            {endereco || 'Nenhum endereço definido'}
                        </Text>
                        
                        {!modoManual && location && (
                            <>
                                <Text style={styles.coordenadas}>
                                    Latitude: {location.coords.latitude.toFixed(6)}
                                </Text>
                                <Text style={styles.coordenadas}>
                                    Longitude: {location.coords.longitude.toFixed(6)}
                                </Text>
                            </>
                        )}
                    </View>
                )}

                <View style={styles.botoesContainer}>
                    <TouchableOpacity 
                        style={[styles.botao, modoManual ? styles.botaoSecundario : styles.botaoPrimario]}
                        onPress={() => setModoManual(!modoManual)}
                    >
                        <Text style={styles.botaoTexto}>
                            {modoManual ? 'Usar Localização Atual' : 'Inserir Endereço Manualmente'}
                        </Text>
                    </TouchableOpacity>

                    {!modoManual && (
                        <TouchableOpacity 
                            style={[styles.botao, styles.botaoSecundario]}
                            onPress={obterLocalizacaoAtual}
                        >
                            <Text style={styles.botaoTexto}>Atualizar Localização</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <Modal
                visible={modalVisivel}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitulo}>Inserir Endereço</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu endereço completo"
                            value={enderecoManual}
                            onChangeText={setEnderecoManual}
                            multiline
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
                                onPress={salvarEnderecoManual}
                            >
                                <Text style={styles.botaoTexto}>Salvar</Text>
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
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 20,
        color: '#333',
    },
    infoContainer: {
        width: '100%',
        marginVertical: 15,
    },
    endereco: {
        fontSize: 18,
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
        fontWeight: '500',
    },
    coordenadas: {
        fontSize: 16,
        color: '#666',
        marginVertical: 5,
    },
    erro: {
        fontSize: 16,
        color: 'red',
        marginVertical: 15,
    },
    botoesContainer: {
        width: '100%',
        gap: 10,
    },
    botao: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 5,
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
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    modalBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
}); 