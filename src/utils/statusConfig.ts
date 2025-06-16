import { StatusType } from '../model/Agendamento';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatusConfig {
    color: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    text: string;
}

export const getStatusConfig = (status: StatusType): StatusConfig => {
    switch (status) {
        case 'pendente':
            return {
                color: '#FFA500',
                icon: 'clock-outline',
                text: 'Pendente'
            };
        case 'confirmado':
            return {
                color: '#4CAF50',
                icon: 'check-circle-outline',
                text: 'Confirmado'
            };
        case 'cancelado':
            return {
                color: '#F44336',
                icon: 'close-circle-outline',
                text: 'Cancelado'
            };
        case 'concluído':
            return {
                color: '#2196F3',
                icon: 'check-circle',
                text: 'Concluído'
            };
        case 'Em Andamento':
            return {
                color: '#2196F3',
                icon: 'progress-clock',
                text: 'Em Andamento'
            };
        case 'Aguardando Pagamento':
            return {
                color: '#9C27B0',
                icon: 'cash-multiple',
                text: 'Aguardando Pagamento'
            };
        case 'Recusado':
            return {
                color: '#F44336',
                icon: 'close-circle',
                text: 'Recusado'
            };
        default:
            return {
                color: '#757575',
                icon: 'help-circle-outline',
                text: status
            };
    }
};

export const getStatusColor = (status: StatusType): string => {
    const colors = {
        pendente: '#FFA000',
        confirmado: '#2196F3',
        'Em Andamento': '#9C27B0',
        'Aguardando Pagamento': '#9C27B0',
        concluído: '#00C853',
        cancelado: '#F44336',
        Recusado: '#FF5252'
    };
    return colors[status];
};

export const getStatusBackgroundColor = (status: StatusType): string => {
    const colors = {
        pendente: '#FFF3E0',
        confirmado: '#E3F2FD',
        'Em Andamento': '#F3E5F5',
        'Aguardando Pagamento': '#F3E5F5',
        concluído: '#E8F5E9',
        cancelado: '#FFEBEE',
        Recusado: '#FFEBEE'
    };
    return colors[status];
};

export const getStatusLabel = (status: StatusType | 'todos'): string => {
    const labels = {
        todos: 'Todos',
        pendente: 'Pendente',
        confirmado: 'Confirmado',
        'Em Andamento': 'Em Andamento',
        'Aguardando Pagamento': 'Aguardando Pagamento',
        concluído: 'Concluído',
        cancelado: 'Cancelado',
        Recusado: 'Recusado'
    };
    return labels[status];
}; 