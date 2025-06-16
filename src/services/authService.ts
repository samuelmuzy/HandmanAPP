import axios from 'axios';
import dbPromise from '../../db';
import { checkInternetConnection, handleApiError } from '../utils/networkUtils';
import { API_URL } from '../constants/ApiUrl';
import { User } from '../model/User';
import { typeFornecedor } from '../model/Fornecedor';

interface LoginSuccess {
    success: true;
    data: {
        token: string;
    };
}

interface LoginError {
    success: false;
    message: string;
}

export type LoginResponse = LoginSuccess | LoginError;

export const authService = {
    async login(email: string, senha: string): Promise<LoginResponse> {
        try {
            const loginData = {
                email: email.trim(),
                senha: senha.trim()
            };

            const response = await axios.post(`${API_URL}/usuarios/login`, loginData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.token) {
                return {
                    success: true,
                    data: {
                        token: response.data.token
                    },
                };
            }
            
            throw new Error('Token não recebido da API');
        } catch (error: any) {
            console.error('Erro no login:', error.response?.data || error.message);
            return handleApiError(error) as LoginError;
        }
    },

    async loginFornecedor(email: string, senha: string): Promise<LoginResponse> {
        try {
            const loginData = {
                email: email.trim(),
                senha: senha.trim()
            };

            const response = await axios.post(`${API_URL}/fornecedor/login`, loginData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.token) {
                return {
                    success: true,
                    data: {
                        token: response.data.token
                    },
                };
            }
            
            throw new Error('Token não recebido da API');
        } catch (error: any) {
            console.error('Erro no login do fornecedor:', error.response?.data || error.message);
            return handleApiError(error) as LoginError;
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
                    }
                };
            }
            
            throw new Error('Dados não recebidos da API');
        } catch (error: any) {
            console.error('Erro no cadastro:', error.response?.data || error.message);
            return handleApiError(error) as LoginError;
        }
    },
    async cadastrarFornecedor(usuario:Partial<typeFornecedor>){
        try{
            const response = await axios.post(`${API_URL}/fornecedor`,usuario)
            if (response.data) {
                return {
                    success: true,
                    data: {
                        token: response.data.token
                    }
                };
            }
            
            throw new Error('Dados não recebidos da API');
        }catch (error: any) {
            console.error('Erro no cadastro:', error.response?.data || error.message);
            return handleApiError(error) as LoginError;
        }
    }
}; 