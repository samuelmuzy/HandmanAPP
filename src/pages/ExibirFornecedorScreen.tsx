import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { FornecedorStackParamList } from '../navigation/FornecedorStackNavigation';
import { Ionicons } from '@expo/vector-icons';
import { ExibirFornecedorController } from '../controllers/ExibirFornecedorController';

type ExibirFornecedorRouteProp = RouteProp<FornecedorStackParamList, 'ExibirFornecedorScreen'>;


export const ExibirFornecedorScreen = () => {
    const route = useRoute<ExibirFornecedorRouteProp>();
    const navigation = useNavigation();
    const { fornecedorId } = route.params;

   

    return (
        <ExibirFornecedorController id_fornecedor={fornecedorId}/>
    );
};


