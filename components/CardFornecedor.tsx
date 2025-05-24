import { View } from "react-native";
import { typeFornecedor } from "../model/Fornecedor"

interface CardFornecedorProps{
    fornecedor:typeFornecedor,
    onBack: () => void;
    onNavigateExibirFornecedor: (screen: string) => void;
}
export const CardFornecedor = ({fornecedor,onBack,onNavigateExibirFornecedor}:CardFornecedorProps) =>{
    return(
        <View>

        </View>
    )
}
