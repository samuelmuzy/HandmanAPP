import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { HistoricoAgendamento } from '../model/Agendamento';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CardAgendamentoProps {
    agendamento: HistoricoAgendamento;
    onPress?: () => void; // Adiciona um onPress opcional para o botão
}

const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pendente':
            return {
                color: '#FFA500',
                icon: 'clock-outline',
                text: 'Pendente'
            };
        case 'confirmado':
            return {
                color: '#4CAF50',
                icon: 'check-circle-outline',
                text: 'Confirmado'
            };
        case 'cancelado':
            return {
                color: '#F44336',
                icon: 'close-circle-outline',
                text: 'Cancelado'
            };
        case 'concluido':
            return {
                color: '#2196F3',
                icon: 'check-circle',
                text: 'Concluído'
            };
        default:
            return {
                color: '#757575',
                icon: 'help-circle-outline',
                text: status
            };
    }
};

export const CardAgendamento = ({ agendamento, onPress }: CardAgendamentoProps) => {
    const placeholderImage = require('../assets/agenda.png'); 
    const statusConfig = getStatusConfig(agendamento.status);

    return (
        <View style={styles.cardContainer}>
            <View style={styles.headerContainer}>
                <Image 
                    source={placeholderImage} // Usar imagem real do fornecedor se disponível
                    style={styles.providerImage}
                />
                <Text style={styles.providerName}>{agendamento.fornecedor.nome}</Text>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Data do serviço:</Text>
                    <Text style={styles.detailValue}>{new Date(agendamento.data).toLocaleDateString()}</Text>
                </View>
                {/* Assumindo um valor fixo ou buscando de outra fonte, já que HistoricoAgendamento não tem valor */}
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

            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>Contratar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#Ffffff', // Cor de fundo similar à imagem
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#AC5906', // Cor da borda similar à imagem
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        elevation: 2, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
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
        borderRadius: 25, // Para deixar a imagem redonda
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
});

export default CardAgendamento; 