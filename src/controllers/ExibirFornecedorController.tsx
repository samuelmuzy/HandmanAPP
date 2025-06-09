import { useEffect, useState } from "react";
import { ExibirFornecedorView } from "../views/ExibirFornecedorView"
import { typeFornecedor } from "../model/Fornecedor";
import { FornecedorService } from "../services/FornecedoresService";

interface ExibirFornecedorControllerProps{
    id_fornecedor:string | undefined
}

export const ExibirFornecedorController = ({id_fornecedor}:ExibirFornecedorControllerProps) =>{
    const [fornecedor,setFornecedor] = useState<typeFornecedor | undefined>(undefined);
   
    const handleGetFornecedor = async () =>{
        const fornecedor = await FornecedorService.getFornecedorPorId(id_fornecedor);
        setFornecedor(fornecedor);
    }


    useEffect(() =>{
        handleGetFornecedor();
    },[id_fornecedor])

  
    return(
        <ExibirFornecedorView fornecedor={fornecedor} />
    )
}