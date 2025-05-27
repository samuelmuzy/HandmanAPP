import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExibirFornecedorScreen } from '../pages/ExibirFornecedorScreen';


export type FornecedorStackParamList = {
    ExibirFornecedorScreen: { fornecedorId: string | undefined };
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
        </Stack.Navigator>
    );
};
