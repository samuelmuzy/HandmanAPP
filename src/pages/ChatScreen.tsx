import Chat from "../components/Chat"
import { useRoute, RouteProp } from '@react-navigation/native';
import { FornecedorStackParamList } from '../navigation/FornecedorStackNavigation';

type ChatScreenRouteProp = RouteProp<FornecedorStackParamList, 'ChatScreen'>;


export const ChatScreen = () =>{
    const route = useRoute<ChatScreenRouteProp>();

    const { fornecedorId } = route.params;
    
    return(
        <Chat idFornecedor={fornecedorId as string} />
    )
}