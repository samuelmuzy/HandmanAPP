import { ActivityIndicator, StyleSheet, View } from "react-native";
import { DetalhesFornecedor } from "../components/DetalhesFornecedor";
import { typeFornecedor } from "../model/Fornecedor"

interface ExibirFornecedorProps{
    fornecedor:typeFornecedor | undefined;
    loading:boolean
}
export const ExibirFornecedorView = ({fornecedor,loading}:ExibirFornecedorProps) =>{
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#AC5906" />
            </View>
        );
    }

    return(
        <DetalhesFornecedor fornecedor={fornecedor}/>
    )

}
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});