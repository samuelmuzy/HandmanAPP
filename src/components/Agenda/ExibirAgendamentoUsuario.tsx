import React, { useEffect, useState } from 'react';
import { Text, ScrollView, View, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '../../constants/ApiUrl';
import { useGetToken } from '../../hooks/useGetToken';
import { Loading } from '../Loading';
import { ServicoIlustrar } from '../../model/Agendamento';

interface ExibirAgendamentoUsuarioProps {
    fornecedorId: string | undefined;
}

export const ExibirAgendamentoUsuario: React.FC<ExibirAgendamentoUsuarioProps> = ({ fornecedorId }) => {
    const [loading, setLoading] = useState(true);
    const [agendamento, setAgendamento] = useState<ServicoIlustrar | null>(null);
    const token = useGetToken();

    const fetchAgendamento = async () => {

        if (!fornecedorId || !token?.id) return;
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/servicos/${fornecedorId}`);
            setAgendamento(response.data);
        } catch (error) {
            console.error('Erro ao buscar detalhes do agendamento:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchAgendamento();
    }, [fornecedorId, token]);

    if (loading) {
        return (
            <Loading />
        );
    }

    if (!agendamento) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Agendamento não encontrado</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Detalhes do Fornecedor</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Nome:</Text>
                    <Text style={styles.value}>{agendamento.fornecedor.nome}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Detalhes do Serviço</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Categoria:</Text>
                    <Text style={styles.value}>{agendamento.categoria}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Data:</Text>
                    <Text style={styles.value}>
                        {new Date(agendamento.data).toLocaleDateString()}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Horário:</Text>
                    <Text style={styles.value}>
                        {new Date(agendamento.horario).toLocaleTimeString()}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Status:</Text>
                    <Text style={styles.value}>{agendamento.status}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Descrição:</Text>
                    <Text style={styles.value}>{agendamento.descricao}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

/*{agendamento.valor && (
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Valor:</Text>
                        <Text style={styles.value}>
                            R$ {agendamento.servico.valor.toFixed(2)}
                        </Text>
                    </View>
                )}*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#FF5252',
        textAlign: 'center',
        marginTop: 20,
    },
    section: {
        marginBottom: 24,
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        color: '#666666',
        width: 100,
    },
    value: {
        fontSize: 16,
        color: '#333333',
        flex: 1,
    },
});