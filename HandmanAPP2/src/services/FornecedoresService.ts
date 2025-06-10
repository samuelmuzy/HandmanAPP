import axios from 'axios';
import { typeFornecedor } from '../model/Fornecedor';
import { API_URL } from '../constants/ApiUrl';

// Substitua 192.168.1.100 pelo IP da sua máquina na rede local


interface LoginSuccess {
    success: true;
    data: {
        token: string;
    };
    useLocalDB: boolean;
}


interface LoginError {
    success: false;
    message: string;
    useLocalDB: boolean;
}

export type LoginResponse = LoginSuccess | LoginError;

export const FornecedorService = {
    async getFornecedoresPorCategoria(categoriaSelecionada:string, ordenarPor?: 'avaliacao' | 'preco', ordem?: 'asc' | 'desc'):Promise<typeFornecedor[] | undefined>{
        try{
            const response = await  axios.get(`${API_URL}/fornecedor/categorias/${categoriaSelecionada}${ordenarPor ? `?ordenarPor=${ordenarPor}&ordem=${ordem || 'desc'}` : ''}`)
            
            const user:typeFornecedor[] = response.data;

            return user;
        }catch(error){
            console.log(error)
        }
    },
    
    async getFornecedorPorId(id_fornecedor:string | undefined):Promise<typeFornecedor | undefined>{
        try{
            const response = await axios.get(`${API_URL}/fornecedor/${id_fornecedor}`)
            
            const user:typeFornecedor = response.data;
            console.log(user)
            return user;
        }catch(error){
            console.log(error)
        }
    }
}; 