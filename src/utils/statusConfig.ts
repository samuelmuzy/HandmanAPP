import { StatusType } from '../model/Agendamento';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatusConfig {
    color: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    text: string;
}

export const getStatusConfig = (status: string): StatusConfig => {
    switch (status.toLowerCase()) {
        case 'pendente':
            return {
                color: '#FFA500',
                icon: 'clock-outline',
                text: 'Pendente'
            };
        case 'confirmar valor':
            return{
                color:'#9C27B0',
                icon: 'cash-multiple',
                text: 'Confimação de Valor'
            }
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
        case 'concluido':
            return {
                color: '#2196F3',
                icon: 'check-circle',
                text: 'Concluído'
            };
        case 'em andamento':
            return {
                color: '#2196F3',
                icon: 'progress-clock',
                text: 'Em Andamento'
            };
        case 'aguardando pagamento':
            return {
                color: '#9C27B0',
                icon: 'cash-multiple',
                text: 'Aguardando Pagamento'
            };
        case 'recusado':
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

export const getStatusColor = (status: StatusType | 'todos'): string => {
    const cores = {
        todos: '#666666',
        pendente: '#FF9800',
        confirmado: '#00C853',
        "confirmar valor":"#9C27B0",
        'Em Andamento': '#2196F3',
        'Aguardando pagamento': '#9C27B0',
        concluido: '#00C853',
        cancelado: '#FF5252',
        Recusado: '#FF5252'
    };
    return cores[status];
};

export const getStatusBackground = (status: StatusType | 'todos'): string => {
    const cores = {
        todos: '#F5F5F5',
        pendente: '#FFF3E0',
        confirmado: '#E8F5E9',
        'Em Andamento': '#E3F2FD',
        'Aguardando pagamento': '#F3E5F5',
        "confirmar valor":"#F3E5F5",
        concluido: '#E8F5E9',
        cancelado: '#FFEBEE',
        Recusado: '#FFEBEE'
    };
    return cores[status];
};

export const getStatusLabel = (status: StatusType | 'todos'): string => {
    const labels = {
        todos: 'Todos',
        pendente: 'Pendente',
        confirmado: 'Confirmado',
        'Em Andamento': 'Em Andamento',
        "confirmar valor":'Confimação de Valor',
        'Aguardando pagamento': 'Aguardando Pagamento',
        concluido: 'Concluído',
        cancelado: 'Cancelado',
        Recusado: 'Recusado'
    };
    return labels[status];
}; 