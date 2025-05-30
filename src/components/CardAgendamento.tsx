import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { HistoricoAgendamento } from '../model/Agendamento';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type StatusType = "pendente" | "confirmado" | "cancelado" | "concluido" | "Em Andamento";

interface CardAgendamentoProps {
    agendamento: HistoricoAgendamento;
    onPress?: () => void;
    onPressEntrarContato: (idFornecedor: string) => void;
    onPressAtualizarStatus: (novoStatus: StatusType) => void;
}

const getStatusConfig = (status: StatusType) => {
    switch (status.toLowerCase()) {
        case 'pendente':
            return {
                color: '#FFA500',
                icon: 'clock-outline' as const,
                text: 'Pendente'
            };
        case 'confirmado':
            return {
                color: '#4CAF50',
                icon: 'check-circle-outline' as const,
                text: 'Confirmado'
            };
        case 'cancelado':
            return {
                color: '#F44336',
                icon: 'close-circle-outline' as const,
                text: 'Cancelado'
            };
        case 'concluido':
            return {
                color: '#2196F3',
                icon: 'check-circle' as const,
                text: 'Concluído'
            };
        case 'em andamento':
            return {
                color: '#2196F3',
                icon: 'progress-clock' as const,
                text: 'Em Andamento'
            };
        default:
            return {
                color: '#757575',
                icon: 'help-circle-outline' as const,
                text: status
            };
    }
};

export const CardAgendamento: React.FC<CardAgendamentoProps> = ({
    agendamento,
    onPress,
    onPressEntrarContato,
    onPressAtualizarStatus
}) => {
    const placeholderImage = require('../assets/agenda.png');
    const statusConfig = getStatusConfig(agendamento.status as StatusType);

    return (
        <View style={styles.cardContainer}>
            <View style={styles.headerContainer}>
                <Image
                    source={placeholderImage}
                    style={styles.providerImage}
                />
                <Text style={styles.providerName}>{agendamento.fornecedor.nome}</Text>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Data do serviço:</Text>
                    <Text style={styles.detailValue}>{new Date(agendamento.data).toLocaleDateString()}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Valor:</Text>
                    <Text style={styles.detailValue}>R$ --,--</Text>
                </View>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.color}20` }]}>
                        <MaterialCommunityIcons
                            name={statusConfig.icon}
                            size={16}
                            color={statusConfig.color}
                        />
                        <Text style={[styles.statusText, { color: statusConfig.color }]}>
                            {statusConfig.text}
                        </Text>
                    </View>
                </View>
            </View>

            {agendamento.status === 'concluido' && (
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Text style={styles.buttonText}>Avaliar</Text>
                </TouchableOpacity>
            )}

            {agendamento.status === 'Em Andamento' && (
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => onPressEntrarContato(agendamento.id_fornecedor)}
                >
                    <Text style={styles.buttonText}>Entrar em contato</Text>
                </TouchableOpacity>
            )}

            <View style={styles.footer}>
                {agendamento.status.toLowerCase() === 'pendente' && (
                    <TouchableOpacity
                        style={[styles.button, styles.confirmButton]}
                        onPress={() => onPressAtualizarStatus('confirmado')}
                    >
                        <Text style={styles.buttonText}>Confirmar Serviço</Text>
                    </TouchableOpacity>
                )}

                {agendamento.status.toLowerCase() === 'confirmado' && (
                    <TouchableOpacity
                        style={[styles.button, styles.startButton]}
                        onPress={() => onPressAtualizarStatus('Em Andamento')}
                    >
                        <Text style={styles.buttonText}>Iniciar Serviço</Text>
                    </TouchableOpacity>
                )}

                {agendamento.status.toLowerCase() === 'em andamento' && (
                    <TouchableOpacity
                        style={[styles.button, styles.completeButton]}
                        onPress={() => onPressAtualizarStatus('concluido')}
                    >
                        <Text style={styles.buttonText}>Finalizar Serviço</Text>
                    </TouchableOpacity>
                )}

                {['pendente', 'confirmado', 'em andamento'].includes(agendamento.status.toLowerCase()) && (
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => onPressAtualizarStatus('cancelado')}
                    >
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#Ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#AC5906',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    providerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    providerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    detailsContainer: {
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    button: {
        backgroundColor: '#AC5906',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        width: '100%',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    statusContainer: {
        marginTop: 10,
        alignItems: 'flex-end',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        gap: 6,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
    },
    startButton: {
        backgroundColor: '#2196F3',
    },
    completeButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: '#F44336',
    },
});

export default CardAgendamento; 