import { useGetToken } from "../hooks/useGetToken";
import { ExibirAgendamentoFornecedor } from "../components/Agenda/ExibirAgendamentoFornecedor";
import { ExibirAgendamentoUsuario } from "../components/Agenda/ExibirAgendamentoUsuario";
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { FornecedorStackParamList } from '../navigation/FornecedorStackNavigation';

type ExibirAgendamentoScreenRouteProp = RouteProp<FornecedorStackParamList, 'ExibirAgendamentoScreen'>;

export const ExibirAgendamentoScreen = () => {
    const token = useGetToken();
    const route = useRoute<ExibirAgendamentoScreenRouteProp>();
    const { fornecedorId } = route.params;

    return (
        token?.role === 'Fornecedor' ? (
            <ExibirAgendamentoFornecedor fornecedorId={fornecedorId} />
        ) : (
            <ExibirAgendamentoUsuario fornecedorId={fornecedorId} />
        )
    );
}