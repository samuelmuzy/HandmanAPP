import React from 'react';

import { AgendaFornecedor } from '../components/Agenda/AgendaFornecedor';
import { useGetToken } from '../hooks/useGetToken';
import { AgendaUsuario } from '../components/Agenda/AgendaUsuario';


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

