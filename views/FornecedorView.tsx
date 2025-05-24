import { ListRenderItemInfo, View } from "react-native"
import { CardFornecedor } from "../components/CardFornecedor"
import { typeFornecedor } from "../model/Fornecedor";
import { FlatList } from "react-native";

interface FornecedorViewProps {
    fornecedor: typeFornecedor[] | undefined,
    onBack: () => void;
    onNavigateExibirFornecedor: (screen: string) => void;
    setCategoria:React.Dispatch<React.SetStateAction<string>>
}

export const FornecedorView = ({ fornecedor, onBack, onNavigateExibirFornecedor }: FornecedorViewProps) => {

    const renderFornecedor = ({ item }: ListRenderItemInfo<typeFornecedor>) => {
        return (
            <CardFornecedor
                fornecedor={item}
                onBack={onBack}
                onNavigateExibirFornecedor={onNavigateExibirFornecedor}
            />
        )
    }

    return (
        <View>

            <FlatList
                data={fornecedor}
                renderItem={renderFornecedor}
            />
        </View>
    )
}