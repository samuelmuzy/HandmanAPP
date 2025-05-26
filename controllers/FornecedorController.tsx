import React,{ useEffect, useState } from "react"
import { typeFornecedor } from "../model/Fornecedor"
import { FornecedorView } from "../views/FornecedorView";
import { FornecedorService } from "../services/FornecedoresService";
import { UserService } from "../services/UserService";
import { useGetToken } from "../hooks/useGetToken";
import { User } from "../model/User";

export const FornecedorController = () =>{
    const [listarFornecedores,setlistarFornecedores] = useState<typeFornecedor[] | undefined>([]);
    const [usuario, setUsuario] = useState<User | undefined>(undefined);

    const [categoria,setCategoria] = useState('Encanamento');

    const token = useGetToken();

    const userId = token?.id;

    const handleGetFornecedores = async () =>{
        const fornecedores = await FornecedorService.getFornecedoresPorCategoria(categoria);
        setlistarFornecedores(fornecedores);
    }

    const handleGetUser = async () =>{
        if (!userId) {
            console.log('Aguardando token...');
            return;
          }
        const user = await UserService.getUsers(userId);
        setUsuario(user);
    }


    //tela ainda não emplementada
    const handleNavigation = (screen:string) =>{
        console.log('screan');
    }

    useEffect(() =>{
        handleGetFornecedores();
    },[categoria])

    useEffect(() =>{
        if(userId){
            handleGetUser();
        }
    },[userId])

    return(
        <>
            <FornecedorView usuario={usuario} fornecedor={listarFornecedores} onNavigateExibirFornecedor={() => handleNavigation('exibir')} setCategoria={setCategoria}/>
        </>
    )
}