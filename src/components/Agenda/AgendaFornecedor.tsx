import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useGetToken } from '../../hooks/useGetToken';
import { useStatusNotifications } from '../../hooks/useStatusNotifications';
import { useNotifications } from '../../hooks/useNotifications';
import axios from 'axios';
import { API_URL } from '../../constants/ApiUrl';
import { CardAgendamentoFornecedor } from './CardAgendamentoFornecedor';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootTabParamList } from '../../navigation/TabNavigation';
import { FornecedorStackParamList } from '../../navigation/FornecedorStackNavigation';
import { io, Socket } from 'socket.io-client';
import * as Notifications from 'expo-notifications';
import { Solicitacao, StatusType } from '../../model/Agendamento';
import { getStatusColor, getStatusBackground, getStatusLabel } from '../../utils/statusConfig';
import { Loading } from '../Loading';

type NavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList>,
    NativeStackNavigationProp<FornecedorStackParamList>
>;

export const AgendaFornecedor = () => {
    const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroAtivo, setFiltroAtivo] = useState<StatusType | 'todos'>('todos');
    const token = useGetToken();
    const navigation = useNavigation<NavigationProp>();
    const socketRef = useRef<Socket | null>(null);

    const { expoPushToken } = useNotifications(token?.id);

    console.log(expoPushToken);

    const handleStatusUpdate = async (update: { id_servico: string; novo_status: string }) => {
        setSolicitacoes(prevSolicitacoes =>
            prevSolicitacoes.map(solicitacao =>
                solicitacao.servico.id_servico === update.id_servico
                    ? {
                        ...solicitacao,
                        servico: {
                            ...solicitacao.servico,
                            status: update.novo_status
                        }
                    }
                    : solicitacao
            )
        );

        try {
            // Enviar notificação push
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Status do serviço foi atualizado",
                    body: `O status do serviço foi atualizado para: ${update.novo_status}`,
                    data: { update },
                    sound: true,
                    priority: Notifications.AndroidNotificationPriority.HIGH,
                },
                trigger: null, // Enviar imediatamente
            });
            console.log('Notificação enviada com sucesso');
        } catch (error) {
            console.error('Erro ao enviar notificação:', error);
        }
    };

    const { emitirMudancaStatus } = useStatusNotifications(handleStatusUpdate);

    const atualizarStatusServico = async (id_servico: string, novo_status: StatusType) => {
        try {
            await axios.put(`${API_URL}/servicos`, {
                id_servico,
                status: novo_status
            });

            emitirMudancaStatus(id_servico, novo_status, token?.id as string);
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            
            Alert.alert(
                "Erro",
                "Não foi possível atualizar o status do serviço. Tente novamente.",
                [{ text: "OK" }]
            );
        }
    };

    const handleEntrarEmContato = (idUsuario: string) => {
        console.log(idUsuario)
        navigation.navigate('FornecedorStack', {
            screen: 'ChatScreen',
            params: { fornecedorId: idUsuario }
        });
    };

    const fetchSolicitacoes = async () => {
        setLoading(true);
        try {
            if (!token || !token.id) {
                console.log("Token não disponível ainda");
                return;
            }

            const response = await axios.get(`${API_URL}/fornecedor/${token.id}/solicitacoes`);
            
            setSolicitacoes(response.data);
        } catch (error) {
            console.error("Erro ao buscar solicitações:", error);
            Alert.alert(
                "Erro",
                "Não foi possível carregar as solicitações. Tente novamente.",
                [{ text: "OK" }]
            );
        } finally {
            setLoading(false);
        }
    };

    // Configuração do Socket.IO
    useEffect(() => {
        if (!token?.id) return;

        console.log('Iniciando conexão socket para fornecedor:', token.id);

        const socket = io(API_URL, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket conectado');
            socket.emit('join', token.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket desconectado');
        });

        socket.on('connect_error', (error) => {
            console.error('Erro na conexão do socket:', error);
        });

        socket.on('novo_agendamento', async (novoAgendamento) => {
            console.log('Novo agendamento recebido:', novoAgendamento);
            await fetchSolicitacoes();

            try {
                // Enviar notificação push
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Nova Solicitação",
                        body: "Você recebeu uma nova solicitação de serviço!",
                        data: { novoAgendamento },
                        sound: true,
                        priority: Notifications.AndroidNotificationPriority.HIGH,
                    },
                    trigger: null, // Enviar imediatamente
                });
                console.log('Notificação enviada com sucesso');
            } catch (error) {
                console.error('Erro ao enviar notificação:', error);
            }
        });

        return () => {
            console.log('Desconectando socket');
            socket.disconnect();
        };
    }, [token]);

    // Efeito para carregar solicitações iniciais
    useEffect(() => {
        fetchSolicitacoes();
    }, [token]);

    const statusDisponiveis: (StatusType | 'todos')[] = [
        'todos',
        'pendente',
        'confirmado',
        'Em Andamento',
        'Aguardando pagamento',
        'concluido',
        'cancelado',
        'Recusado'
    ];

    const solicitacoesFiltradas = filtroAtivo === 'todos' 
        ? solicitacoes 
        : solicitacoes.filter(sol => sol.servico.status === filtroAtivo);

    const solicitacoesOrdenadas = [...solicitacoesFiltradas].sort((a, b) => 
        new Date(b.servico.data_submisao).getTime() - new Date(a.servico.data_submisao).getTime()
    );

    if (loading) {
        return (
            <Loading/>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Solicitações de Serviço</Text>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtroContainer}
                    contentContainerStyle={styles.filtroContent}
                >
                    {statusDisponiveis.map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.filtroBotao,
                                filtroAtivo === status && styles.filtroBotaoAtivo,
                                { 
                                    backgroundColor: filtroAtivo === status 
                                        ? getStatusBackground(status)
                                        : '#FFFFFF',
                                    borderColor: getStatusColor(status)
                                }
                            ]}
                            onPress={() => setFiltroAtivo(status)}
                        >
                            <Text style={[
                                styles.filtroTexto,
                                filtroAtivo === status && styles.filtroTextoAtivo,
                                { color: getStatusColor(status) }
                            ]}>
                                {getStatusLabel(status)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={solicitacoesOrdenadas}
                keyExtractor={(item) => item.servico.id_servico}
                renderItem={({ item }) => (
                    <CardAgendamentoFornecedor
                        solicitacao={item}
                        onPressEntrarContato={handleEntrarEmContato}
                        onPressAtualizarStatus={(novoStatus) =>
                            atualizarStatusServico(item.servico.id_servico, novoStatus)
                        }
                    />
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyMessage}>Nenhuma solicitação encontrada</Text>
                        <Text style={styles.emptySubMessage}>Tente selecionar outro filtro</Text>
                    </View>
                )}
                contentContainerStyle={styles.listaContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginLeft: 16,
        marginBottom: 16,
    },
    filtroContainer: {
        maxHeight: 50,
    },
    filtroContent: {
        paddingHorizontal: 12,
        paddingBottom: 12,
    },
    filtroBotao: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 4,
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    filtroBotaoAtivo: {
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    filtroTexto: {
        fontSize: 14,
        fontWeight: '500',
    },
    filtroTextoAtivo: {
        fontWeight: '700',
    },
    listaContainer: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyMessage: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666666',
        marginBottom: 8,
    },
    emptySubMessage: {
        fontSize: 14,
        color: '#999999',
    },
});