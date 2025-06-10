import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CadastroFornecedor from '../components/CadastroFornecedor';

const CadastroFornecedorScreen = () => {
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.goBack();
    };

    const handleNavigate = (screen: string) => {
        navigation.navigate(screen as never);
    };

    return (
        <CadastroFornecedor
            onBack={handleBack}
            onNavigate={handleNavigate}
            currentScreen="CadastroFornecedor"
        />
    );
};

export default CadastroFornecedorScreen; 