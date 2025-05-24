import React,{ useEffect, useState } from "react"
import { typeFornecedor } from "../model/Fornecedor"
import { FornecedorView } from "../views/FornecedorView";
import { FornecedorService } from "../services/FornecedoresService";

export const FornecedorController = () =>{
    const [listarFornecedores,setlistarFornecedores] = useState<typeFornecedor[] | undefined>([]);
    const [categoria,setCategoria] = useState('');

    const handleGetFornecedores = async () =>{
        const fornecedores = await FornecedorService.getFornecedoresPorCategoria(categoria);
        setlistarFornecedores(fornecedores);
    }

    useEffect(() =>{
        handleGetFornecedores();
    },[categoria])

    return(
        <>
            <FornecedorView fornecedor={listarFornecedores} onBack={} onNavigateExibirFornecedor={} setCategoria={setCategoria}/>
        </>
    )
}