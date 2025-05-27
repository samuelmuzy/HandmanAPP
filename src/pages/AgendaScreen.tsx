import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { AgendamentoService } from '../services/AgendamentoServico';
import { HistoricoAgendamento } from '../model/Agendamento';
import { CardAgendamento } from '../components/CardAgendamento';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetToken } from '../hooks/useGetToken';

export const AgendaScreen = () => {
    const [agendamentos, setAgendamentos] = useState<HistoricoAgendamento[]>([]);
    const [loading, setLoading] = useState(true);

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
                        onPress={() => {
                            console.log("Clicado no agendamento:", item.id_servico);
                        }} 
                    />
                )}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyMessage}>Nenhum agendamento encontrado.</Text>
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