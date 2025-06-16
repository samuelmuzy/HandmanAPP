import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FornecedorStackParamList } from '../navigation/FornecedorStackNavigation';
import { AgendamentoService } from '../services/AgendamentoServico';
import { Agendamento } from '../model/Agendamento';
import { useGetToken } from '../hooks/useGetToken';
import moment from 'moment';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

type ConfirmacaoScreenRouteProp = RouteProp<FornecedorStackParamList, 'ConfirmacaoScreen'>;
type ConfirmacaoScreenNavigationProp = NativeStackNavigationProp<FornecedorStackParamList, 'ConfirmacaoScreen'>;

interface ImagemType {
    uri: string;
    type?: string;
    fileName?: string;
}

export const ConfirmacaoScreen = () => {
    const navigation = useNavigation<ConfirmacaoScreenNavigationProp>();
    const route = useRoute<ConfirmacaoScreenRouteProp>();
    const { data, horario, endereco, imagem, fornecedorId } = route.params;
    const token = useGetToken();

    const socketRef = useRef<Socket | null>(null);

    // Inicializa o socket
    useEffect(() => {
        const socket = io(API_URL);
        socketRef.current = socket;
        return () => {
            socket.disconnect();
        };
    }, []);

    const enviarImagem = async (idServico: string) => {
        try {
            if (!imagem) return;

            const imagemData = imagem as ImagemType;

            // Criar o FormData no formato correto para React Native
            const formData = new FormData();
            formData.append('imagem', {
                uri: imagemData.uri,
                type: imagemData.type || 'image/jpeg',
                name: imagemData.fileName || 'imagem.jpg'
            } as any);

            const response = await axios.post(
                `${API_URL}/servicos/inserir-imagems/${idServico}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json',
                    },
                }
            );

            console.log('Imagem enviada com sucesso:', response.data);
        } catch (error) {
            console.error('Erro ao enviar imagem:', error);
            Alert.alert('Erro', 'Não foi possível enviar a imagem. O serviço foi agendado, mas a imagem não foi anexada.');
        }
    };

    const handleFinalizar = async () => {
        try {
            if (!token?.id) {
                Alert.alert('Erro', 'Usuário não encontrado.');
                return;
            }

            if (!fornecedorId) {
                Alert.alert('Erro', 'ID do fornecedor não disponível.');
                return;
            }

            const [dia, mes, ano] = data.split('/').map(Number);
            const [hora, minuto] = horario.split(':').map(Number);
            const dataHorarioISO = moment.utc([ano, mes - 1, dia, hora, minuto]).toISOString();

            const novoAgendamento: Agendamento = {
                id_usuario: token.id,
                id_fornecedor: fornecedorId,
                categoria: 'Limpeza',
                data: dataHorarioISO,
                horario: dataHorarioISO,
                descricao: endereco,
                status: 'pendente',
                id_pagamento: '123',
                id_avaliacao: '123'
            };

            const response = await AgendamentoService.AgendarServico(novoAgendamento);
            
            // Envia a imagem se existir
            if (imagem) {
                await enviarImagem(response.id_servico);
            }

            // Emite o evento de novo agendamento
            if (socketRef.current) {
                socketRef.current.emit('novo_agendamento', {
                    ...response,
                    id_fornecedor: fornecedorId
                });
            }

            Alert.alert(
                'Sucesso',
                'Agendamento realizado com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [
                                        { name: 'Agenda' }
                                    ],
                                })
                            );
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Erro ao agendar serviço:', error);
            Alert.alert('Erro', 'Não foi possível realizar o agendamento. Verifique os dados e tente novamente.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Confirme seu Agendamento</Text>

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.label}>Data:</Text>
                    <Text style={styles.value}>{data}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.label}>Horário:</Text>
                    <Text style={styles.value}>{horario}</Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.label}>Endereço:</Text>
                    <Text style={styles.value}>{endereco}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleFinalizar}
            >
                <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.cancelButtonText}>Voltar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#A75C00',
        marginBottom: 20,
    },
    infoContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        marginBottom: 20,
    },
    infoItem: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    value: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
    },
    confirmButton: {
        backgroundColor: '#AC5906',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#AC5906',
    },
    cancelButtonText: {
        color: '#AC5906',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 