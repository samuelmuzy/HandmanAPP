import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FornecedorStackParamList } from '../navigation/FornecedorStackNavigation';
import DateTimePicker from '@react-native-community/datetimepicker';

type AgendamentoScreenRouteProp = RouteProp<FornecedorStackParamList, 'AgendamentoScreen'>;
type AgendamentoScreenNavigationProp = NativeStackNavigationProp<FornecedorStackParamList, 'AgendamentoScreen'>;

export const AgendamentoScreen = () => {
    const navigation = useNavigation<AgendamentoScreenNavigationProp>();
    const route = useRoute<AgendamentoScreenRouteProp>();
    const { fornecedorId } = route.params;

    const [data, setData] = useState(new Date());
    const [horario, setHorario] = useState('');
    const [endereco, setEndereco] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleConfirmar = () => {
        navigation.navigate('ConfirmacaoScreen', {
            fornecedorId,
            data: data.toLocaleDateString(),
            horario,
            endereco
        });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Agendar Serviço</Text>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Data</Text>
                <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text>{data.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={data}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                                setData(selectedDate);
                            }
                        }}
                    />
                )}
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: 14:00"
                    value={horario}
                    onChangeText={setHorario}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Descrição</Text>
                <TextInput
                    style={[styles.input, styles.addressInput]}
                    placeholder="Digite a descrição do serviço"
                    value={endereco}
                    onChangeText={setEndereco}
                    multiline
                />
            </View>

            <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleConfirmar}
            >
                <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
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
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    addressInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    dateButton: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    confirmButton: {
        backgroundColor: '#AC5906',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 