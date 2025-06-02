import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigation } from './TabNavigation';
import LoginScreen from '../pages/LoginScreen';
import CadastroScreen from '../pages/CadastroScreen';
// Tipos para as rotas
export type RootStackParamList = {
    Login: undefined;
    MainApp: undefined;
    Cadastro: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AuthStackNavigation = () => {
    return (
        <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="MainApp" component={TabNavigation} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} />
        </Stack.Navigator>
    );
}; 