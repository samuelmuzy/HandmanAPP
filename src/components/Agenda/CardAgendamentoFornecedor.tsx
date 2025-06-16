import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FornecedorStackParamList } from '../../navigation/FornecedorStackNavigation';
import { Solicitacao, StatusType } from '../../model/Agendamento';
import { getStatusConfig } from '../../utils/statusConfig';
import { RootTabParamList } from '../../navigation/TabNavigation';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type NavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList>,
    BottomTabNavigationProp<FornecedorStackParamList>
>;

interface CardAgendamentoFornecedorProps {
    solicitacao: Solicitacao;
    onPressEntrarContato: (idUsuario: string) => void;
    onPressAtualizarStatus: (novoStatus: StatusType) => void;
}

export const CardAgendamentoFornecedor: React.FC<CardAgendamentoFornecedorProps> = ({
    solicitacao,
    onPressEntrarContato,
    onPressAtualizarStatus
}) => {
    const navigation = useNavigation<NavigationProp>();
    const placeholderImage = require('../../assets/agenda.png');
    const statusConfig = getStatusConfig(solicitacao.servico.status as StatusType);

    const handleCardPress = () => {
        navigation.navigate('FornecedorStack', {
            screen: 'ExibirAgendamentoScreen',
            params: {
                fornecedorId: solicitacao.servico.id_servico
            }
        });
    };

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={handleCardPress}>
            <View style={styles.headerContainer}>
                <Image
                    source={solicitacao.usuario?.picture ? { uri: solicitacao.usuario.picture } : placeholderImage}
                    style={styles.userImage}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{solicitacao.usuario?.nome || 'Cliente'}</Text>
                    <Text style={styles.serviceCategory}>{solicitacao.servico.categoria}</Text>
                </View>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Data:</Text>
                    <Text style={styles.detailValue}>
                        {new Date(solicitacao.servico.data).toLocaleDateString()}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Horário:</Text>
                    <Text style={styles.detailValue}>
                        {new Date(solicitacao.servico.horario).toLocaleTimeString()}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Descrição:</Text>
                    <Text style={styles.detailValue}>{solicitacao.servico.descricao}</Text>
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

            <View style={styles.footer}>
                {solicitacao.servico.status.toLowerCase() === 'pendente' && (
                    <>
                        <TouchableOpacity
                            style={[styles.button, styles.acceptButton]}
                            onPress={() => onPressAtualizarStatus('Em Andamento')}
                        >
                            <Text style={styles.buttonText}>Aceitar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.rejectButton]}
                            onPress={() => onPressAtualizarStatus('Recusado')}
                        >
                            <Text style={styles.buttonText}>Recusar</Text>
                        </TouchableOpacity>
                    </>
                )}

                {solicitacao.servico.status.toLowerCase() === 'em andamento' && (
                    <View style={styles.actionButtonsContainer}>
                        <View style={styles.mainButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => onPressAtualizarStatus('cancelado')}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.completeButton]}
                                onPress={() => onPressAtualizarStatus('Aguardando Pagamento')}
                            >
                                <Text style={styles.buttonText}>Finalizar Serviço</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={[styles.button, styles.contactButton, styles.fullWidthButton]}
                            onPress={() => onPressEntrarContato(solicitacao.usuario?.id_usuario as string)}
                        >
                            <Text style={styles.buttonText}>Contato</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#FFFFFF',
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
        marginBottom: 15,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    serviceCategory: {
        fontSize: 14,
        color: '#666',
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
        fontWeight: '500',
        color: '#333',
        flex: 1,
        textAlign: 'right',
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
    actionButtonsContainer: {
        width: '100%',
        gap: 8,
    },
    mainButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        width: '100%',
    },
    button: {
        flex: 1,
        minWidth: '30%',
        backgroundColor: '#AC5906',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    fullWidthButton: {
        width: '100%',
        marginTop: 8,
    },
    buttonText: {
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '600',
        textAlign: 'center',
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
    },
    rejectButton: {
        backgroundColor: '#F44336',
    },
    completeButton: {
        backgroundColor: '#2196F3',
    },
    cancelButton: {
        backgroundColor: '#F44336',
    },
    contactButton: {
        backgroundColor: '#9C27B0',
    },
}); 