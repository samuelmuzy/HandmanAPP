import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { FornecedorStackParamList } from '../navigation/FornecedorStackNavigation';
import { ExibirFornecedorController } from '../controllers/ExibirFornecedorController';

type ExibirFornecedorRouteProp = RouteProp<FornecedorStackParamList, 'ExibirFornecedorScreen'>;


export const ExibirFornecedorScreen = () => {
    const route = useRoute<ExibirFornecedorRouteProp>();
    const { fornecedorId } = route.params;

    return (
        <ExibirFornecedorController id_fornecedor={fornecedorId}/>
    );
};


