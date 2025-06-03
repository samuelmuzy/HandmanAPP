import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useGetToken } from '../../hooks/useGetToken';
import { useStatusNotifications } from '../../hooks/useStatusNotifications';
import axios from 'axios';
import { API_URL } from '../../constants/ApiUrl';
import { CardAgendamentoFornecedor } from '../CardAgendamentoFornecedor';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootTabParamList } from '../../navigation/TabNavigation';
import { FornecedorStackParamList } from '../../navigation/FornecedorStackNavigation';

type NavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList>,
    NativeStackNavigationProp<FornecedorStackParamList>
>;

interface Solicitacao {
    servico: {
        id_servico: string;
        categoria: string;
        data: Date;
        horario: Date;
        status: string;
        descricao: string;
        id_pagamento?: string;
        id_avaliacao?: string;
    };
    usuario: {
        nome: string;
        email: string;
        telefone: string;
        picture: string;
    } | null;
}

type StatusType = "pendente" | "confirmado" | "cancelado" | "concluido" | "Em Andamento" | "Aguardando pagamento" | "Recusado";

export const AgendaFornecedor = () => {
    const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
    const [loading, setLoading] = useState(true);
    const token = useGetToken();
    const navigation = useNavigation<NavigationProp>();

    const handleStatusUpdate = (update: { id_servico: string; novo_status: string }) => {
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

        Alert.alert(
            "Atualização de Status",
            `O status do serviço foi atualizado para: ${update.novo_status}`,
            [{ text: "OK" }]
        );
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
        navigation.navigate('FornecedorStack', {
            screen: 'ChatScreen',
            params: { fornecedorId: idUsuario }
        });
    };

    useEffect(() => {
        const fetchSolicitacoes = async () => {
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

        fetchSolicitacoes();
    }, [token]);

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
                data={solicitacoes}
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
                    <Text style={styles.emptyMessage}>Nenhuma solicitação encontrada.</Text>
                )}
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