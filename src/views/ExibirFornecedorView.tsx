import { ActivityIndicator, StyleSheet, View } from "react-native";
import { DetalhesFornecedor } from "../components/DetalhesFornecedor";
import { typeFornecedor } from "../model/Fornecedor"
import { Loading } from "../components/Loading";

interface ExibirFornecedorProps{
    fornecedor:typeFornecedor | undefined;
    loading:boolean
}
export const ExibirFornecedorView = ({fornecedor,loading}:ExibirFornecedorProps) =>{
    if (loading) {
        return (
            <Loading/>
        );
    }

    return(
        <DetalhesFornecedor fornecedor={fornecedor}/>
    )

}
