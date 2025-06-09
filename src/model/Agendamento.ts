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

export interface FornecedorHistorico {
    nome: string;
    email: string;
    telefone: string;
    categoria_servico: string[];
    media_avaliacoes: number;
}

export type HistoricoAgendamento = {
    id_servico: string;
    id_fornecedor:string
    data: Date;
    horario: Date;
    status: "pendente" | "confirmado" | "cancelado" | "concluido" | "Em Andamento" | "Aguardando pagamento" | "Recusado";
    descricao: string;
    fornecedor: {
        nome: string;
        email: string;
        telefone: string;
        picture: string;
    };
};

export interface Solicitacao {
    servico: {
        id_servico: string;
        categoria: string;
        data: Date;
        horario: Date;
        status: string;
        descricao: string;
        id_pagamento?: string;
        id_avaliacao?: string;
    };
    usuario: {
        nome: string;
        email: string;
        telefone: string;
        picture: string;
    } | null;
}