import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FornecedorStackParamList } from '../navigation/FornecedorStackNavigation';
import { AgendamentoService } from '../services/AgendamentoServico';
import { Agendamento } from '../model/Agendamento';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetToken } from '../hooks/useGetToken';
import moment from 'moment';
import { CommonActions } from '@react-navigation/native';

type ConfirmacaoScreenRouteProp = RouteProp<FornecedorStackParamList, 'ConfirmacaoScreen'>;
type ConfirmacaoScreenNavigationProp = NativeStackNavigationProp<FornecedorStackParamList, 'ConfirmacaoScreen'>;

export const ConfirmacaoScreen = () => {
    const navigation = useNavigation<ConfirmacaoScreenNavigationProp>();
    const route = useRoute<ConfirmacaoScreenRouteProp>();
    const { data, horario, endereco, fornecedorId } = route.params;
    const token = useGetToken();

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
                descricao: 'Serviço de limpeza agendado',
                status: 'pendente',
                id_pagamento: '123',
                id_avaliacao: '123'
            };

            await AgendamentoService.AgendarServico(novoAgendamento);
            
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