export interface Agendamento {
    id_usuario: string;
    id_fornecedor: string;
    categoria: string;
    data: string;
    horario: string;
    descricao:string;
    status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido';
    id_pagamento: string;
    id_avaliacao: string;
}

interface FornecedorHistorico {
    nome: string;
    email: string;
    telefone: string;
    categoria_servico: string[];
    media_avaliacoes: number;
}

export interface HistoricoAgendamento {
    id_servico: string;
    id_usuario: string;
    categoria: string;
    data: string;
    horario: string;
    status: 'pendente' | 'confirmado' | 'cancelado' | 'concluido';
    id_pagamento: string;
    id_avaliacao: string;
    fornecedor: FornecedorHistorico;
}