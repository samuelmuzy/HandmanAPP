import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, SectionList, TouchableOpacity, ScrollView } from 'react-native';
import { AgendamentoService } from '../../services/AgendamentoServico';
import { HistoricoAgendamento, StatusType } from '../../model/Agendamento';
import { CardAgendamento } from './CardAgendamento';
import { useGetToken } from '../../hooks/useGetToken';
import { CompositeNavigationProp,useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootTabParamList } from '../../navigation/TabNavigation';
import { FornecedorStackParamList } from '../../navigation/FornecedorStackNavigation';
import { ModalAvaliacao } from '../ModalAvaliacao';
import axios from 'axios';
import { API_URL } from '../../constants/ApiUrl';
import { useStatusNotifications } from '../../hooks/useStatusNotifications';
import { getStatusColor, getStatusBackgroundColor, getStatusLabel } from '../../utils/statusConfig';
import { Loading } from '../Loading';

type NavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList>,
    NativeStackNavigationProp<FornecedorStackParamList>
>;

export const AgendaUsuario = () => {
    const [agendamentos, setAgendamentos] = useState<HistoricoAgendamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAvaliacaoOpen, setIsAvaliacaoOpen] = useState(false);
    const [servicoSelecionado, setServicoSelecionado] = useState<HistoricoAgendamento | null>(null);
    const [filtroAtivo, setFiltroAtivo] = useState<StatusType | 'todos'>('todos');
    const navigation = useNavigation<NavigationProp>();
    const token = useGetToken();

    const handleStatusUpdate = (update: { id_servico: string; novo_status: string }) => {
        setAgendamentos(prevAgendamentos => 
            prevAgendamentos.map(agendamento => 
                agendamento.id_servico === update.id_servico
                    ? { ...agendamento, status: update.novo_status as HistoricoAgendamento['status'] }
                    : agendamento
            )
        );
    };

    const { emitirMudancaStatus } = useStatusNotifications(handleStatusUpdate);

    const atualizarStatusServico = async (id_servico: string, novo_status: StatusType, id_fornecedor: string) => {
        try {
            // Atualiza no banco
            await axios.put(`${API_URL}/servicos`, {
                id_servico,
                status: novo_status
            });

            // Emite o evento de socket
            emitirMudancaStatus(id_servico, novo_status, id_fornecedor);
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
            Alert.alert(
                "Erro",
                "Não foi possível atualizar o status do serviço. Tente novamente.",
                [{ text: "OK" }]
            );
        }
    };

    const fetchAgendamentos = async () => {
        setLoading(true);
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

    useEffect(() => {
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

    const statusOptions = [
        'pendente',
        'confirmado',
        'Em Andamento',
        'Aguardando Pagamento',
        'concluído',
        'cancelado',
        'Recusado'
    ];

    const agendamentosFiltrados = filtroAtivo === 'todos' 
        ? agendamentos 
        : agendamentos.filter(ag => ag.status === filtroAtivo);
        

    const agendamentosOrdenados = [...agendamentosFiltrados].sort((a, b) => 
        new Date(b.data_submisao).getTime() - new Date(a.data_submisao).getTime()
    );

    if (loading) {
        return (
            <Loading/>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Meus Agendamentos</Text>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtroContainer}
                    contentContainerStyle={styles.filtroContent}
                >
                    {statusOptions.map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={[
                                styles.filtroBotao,
                                filtroAtivo === status && styles.filtroBotaoAtivo,
                                { 
                                    backgroundColor: filtroAtivo === status 
                                        ? getStatusBackgroundColor(status as StatusType)
                                        : '#FFFFFF',
                                    borderColor: getStatusColor(status as StatusType)
                                }
                            ]}
                            onPress={() => setFiltroAtivo(status as StatusType | 'todos')}
                        >
                            <Text style={[
                                styles.filtroTexto,
                                filtroAtivo === status && styles.filtroTextoAtivo,
                                { color: getStatusColor(status as StatusType) }
                            ]}>
                                {getStatusLabel(status as StatusType | 'todos')}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={agendamentosOrdenados}
                keyExtractor={(item) => item.id_servico}
                renderItem={({ item }) => (
                    <CardAgendamento 
                        agendamento={item} 
                        onPress={() => handleAvaliarServico(item)}
                        onPressEntrarContato={handleEntrarEmContato}
                        onPressAtualizarStatus={(novoStatus) => 
                            atualizarStatusServico(item.id_servico, novoStatus as StatusType, item.id_fornecedor)
                        }
                    />
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyMessage}>Nenhum agendamento encontrado</Text>
                        <Text style={styles.emptySubMessage}>Tente selecionar outro filtro</Text>
                    </View>
                )}
                contentContainerStyle={styles.listaContainer}
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