import axios from 'axios';
<<<<<<< HEAD
import dbPromise from '../../db';
import { checkInternetConnection, handleApiError } from '../utils/networkUtils';
=======
import { handleApiError } from '../utils/networkUtils';
>>>>>>> cbf92d8044a778853fef1fe14218784b147c4fde
import { API_URL } from '../constants/ApiUrl';
import { User } from '../model/User';
import { typeFornecedor } from '../model/Fornecedor';

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
}

export type LoginResponse = LoginSuccess | LoginError;

export const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            return {
                success: true,
                data: response.data,
                useLocalDB: false
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao fazer login'
            };
        }
    },

    async loginFornecedor(email: string, password: string): Promise<LoginResponse> {
        try {
            const response = await axios.post(`${API_URL}/auth/login/fornecedor`, {
                email,
                password
            });

            return {
                success: true,
                data: response.data,
                useLocalDB: false
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao fazer login'
            };
        }
    },

    async cadastrarFornecedor(fornecedor: Partial<typeFornecedor>): Promise<LoginResponse> {
        try {
            const response = await axios.post(`${API_URL}/auth/cadastro/fornecedor`, fornecedor);

            return {
                success: true,
                data: response.data,
                useLocalDB: false
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Erro ao cadastrar fornecedor'
            };
        }
    },

    async cadastro(usuario: User): Promise<LoginResponse> {
        try {
            const response = await axios.post(`${API_URL}/usuarios`, usuario);
            if (response.data) {
                return {
                    success: true,
                    data: {
                        token: response.data.token
                    },
                    useLocalDB: false
                };
            } else {
                throw new Error('Dados não recebidos da API');
            }
        } catch (error: any) {
            const errorResult = handleApiError(error);
            return errorResult as LoginError;
        }
    }
}; 