import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { FornecedorStackParamList } from '../navigation/FornecedorStackNavigation';

type ExibirFornecedorRouteProp = RouteProp<FornecedorStackParamList, 'ExibirFornecedorScreen'>;

const DetalhesFornecedorScreen = () => {
    const route = useRoute<ExibirFornecedorRouteProp>();
    const { fornecedorId } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detalhes do Fornecedor</Text>
            <Text>ID do Fornecedor: {fornecedorId}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default DetalhesFornecedorScreen; 