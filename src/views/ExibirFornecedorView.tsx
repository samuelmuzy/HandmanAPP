import { DetalhesFornecedor } from "../components/DetalhesFornecedor";
import { typeFornecedor } from "../model/Fornecedor"

interface ExibirFornecedorProps{
    fornecedor:typeFornecedor | undefined;
}
export const ExibirFornecedorView = ({fornecedor}:ExibirFornecedorProps) =>{
    return(
        <DetalhesFornecedor fornecedor={fornecedor}/>
    )
}