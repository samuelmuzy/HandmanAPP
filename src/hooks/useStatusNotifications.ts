import { useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../constants/ApiUrl';
import { useGetToken } from './useGetToken';
import { Alert } from 'react-native';

interface StatusUpdate {
    id_servico: string;
    novo_status: string;
    timestamp: Date;
}

export const useStatusNotifications = (
    onStatusUpdate: (update: StatusUpdate) => void
) => {
    const token = useGetToken();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!token?.id) return;

        const socket = io(API_URL);
        socketRef.current = socket;

        // Entra na sala do usuário
        socket.emit('join', token.id);

        // Escuta atualizações de status
        socket.on('atualizacao_status', (update: StatusUpdate) => {
            onStatusUpdate(update);
            
            Alert.alert(
                "Atualização de Status",
                `O status do serviço foi atualizado para: ${update.novo_status}`,
                [{ text: "OK" }]
            );
        });

        return () => {
            socket.disconnect();
        };
    }, [token?.id, onStatusUpdate]);

    const emitirMudancaStatus = useCallback((
        id_servico: string,
        novo_status: string,
        id_fornecedor: string
    ) => {
        if (!socketRef.current || !token?.id) return;

        socketRef.current.emit('mudanca_status', {
            id_servico,
            novo_status,
            id_usuario: token.id,
            id_fornecedor
        });
    }, [token?.id]);

    return { emitirMudancaStatus };
}; 