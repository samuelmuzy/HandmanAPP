import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExibirFornecedorScreen } from '../pages/ExibirFornecedorScreen';
import { AgendamentoScreen } from '../pages/AgendamentoScreen';
import { ConfirmacaoScreen } from '../pages/ConfirmacaoScreen';

export type FornecedorStackParamList = {
    ExibirFornecedorScreen: { fornecedorId: string | undefined};
    AgendamentoScreen: { fornecedorId: string | undefined };
    ConfirmacaoScreen: { 
        fornecedorId: string | undefined ;
        data: string;
        horario: string;
        endereco: string;
    };
};

const Stack = createNativeStackNavigator<FornecedorStackParamList>();

export const FornecedorStackNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="ExibirFornecedorScreen" component={ExibirFornecedorScreen} />
            <Stack.Screen name="AgendamentoScreen" component={AgendamentoScreen} />
            <Stack.Screen name="ConfirmacaoScreen" component={ConfirmacaoScreen} />
        </Stack.Navigator>
    );
};
