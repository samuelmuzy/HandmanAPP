import Chat from "../components/Chat"
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FornecedorStackParamList } from '../navigation/FornecedorStackNavigation';

type ChatScreenRouteProp = RouteProp<FornecedorStackParamList, 'ChatScreen'>;


export const ChatScreen = () =>{
    const route = useRoute<ChatScreenRouteProp>();

    const { fornecedorId } = route.params;
    return(
        <Chat idFornecedor={fornecedorId as string} />
    )
}