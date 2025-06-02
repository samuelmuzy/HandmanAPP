import React from 'react';

import { AgendaFornecedor } from '../components/AgendaFornecedor';
import { useGetToken } from '../hooks/useGetToken';
import { AgendaUsuario } from '../components/AgendaUsuario';


export const AgendaScreen = () => {
    const token = useGetToken();

    return (
        token?.role === 'Fornecedor' ? (
            <AgendaFornecedor />
          ) : (
            <AgendaUsuario />
          )
    )
};

