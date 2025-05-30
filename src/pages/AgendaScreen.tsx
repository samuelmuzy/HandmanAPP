import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { AgendamentoService } from '../services/AgendamentoServico';
import { HistoricoAgendamento } from '../model/Agendamento';
import { CardAgendamento } from '../components/CardAgendamento';
import { useGetToken } from '../hooks/useGetToken';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootTabParamList } from '../navigation/TabNavigation';
import { FornecedorStackParamList } from '../navigation/FornecedorStackNavigation';
import { ModalAvaliacao } from '../components/ModalAvaliacao';
import axios from 'axios';
import { API_URL } from '../constants/ApiUrl';

type NavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList>,
    NativeStackNavigationProp<FornecedorStackParamList>
>;

export const AgendaScreen = () => {
    const [agendamentos, setAgendamentos] = useState<HistoricoAgendamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAvaliacaoOpen, setIsAvaliacaoOpen] = useState(false);
    const [servicoSelecionado, setServicoSelecionado] = useState<HistoricoAgendamento | null>(null);
    const navigation = useNavigation<NavigationProp>();
    const token = useGetToken();

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                if (!token || !token.id) {
                    console.log("Token não disponível ainda");
                    return;
                }

                const id_usuario = token.id;
                const agendamentos = await AgendamentoService.getAgendamentos(id_usuario);
                if (agendamentos) {
                    setAgendamentos(agendamentos);
                }
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAgendamentos();
    }, [token]);

    const handleSubmitAvaliacao = async (nota: number, comentario: string) => {
        if (!servicoSelecionado || !token?.id) return;
        
        try {
            const dataAvaliacao = {
                id_servico: servicoSelecionado.id_servico,
                id_usuario: token.id,
                id_fornecedor: servicoSelecionado.id_fornecedor,
                data: servicoSelecionado.data,
                nota: nota,
                comentario: comentario
            };
            
            await axios.post(`${API_URL}/avaliacao`, dataAvaliacao);
            setIsAvaliacaoOpen(false);
            setServicoSelecionado(null);
        } catch (error) {
            console.error("Erro ao enviar avaliação:", error);
        }
    };

    const handleEntrarEmContato = (idFornecedor: string) => {
        navigation.navigate('FornecedorStack', {
            screen: 'ChatScreen',
            params: { fornecedorId: idFornecedor }
        });
    }

    const handleAvaliarServico = (agendamento: HistoricoAgendamento) => {
        setServicoSelecionado(agendamento);
        setIsAvaliacaoOpen(true);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#AC5906" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={agendamentos}
                keyExtractor={(item) => item.id_servico}
                renderItem={({ item }) => (
                    <CardAgendamento 
                        agendamento={item} 
                        onPress={() => handleAvaliarServico(item)}
                        onPressEntrarContato={handleEntrarEmContato}
                    />
                )}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyMessage}>Nenhum agendamento encontrado.</Text>
                )}
            />

            <ModalAvaliacao
                visible={isAvaliacaoOpen}
                onClose={() => {
                    setIsAvaliacaoOpen(false);
                    setServicoSelecionado(null);
                }}
                onSubmit={handleSubmitAvaliacao}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyMessage: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
});