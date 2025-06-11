import axios from 'axios';
<<<<<<< HEAD
<<<<<<< HEAD
import dbPromise from '../../db';
import { checkInternetConnection, handleApiError } from '../utils/networkUtils';
=======
import { handleApiError } from '../utils/networkUtils';
>>>>>>> cbf92d8044a778853fef1fe14218784b147c4fde
import { API_URL } from '../constants/ApiUrl';
import { User } from '../model/User';
import { typeFornecedor } from '../model/Fornecedor';
=======
import { handleApiError } from '../utils/networkUtils';
import { API_URL } from '../constants/ApiUrl';
import { User } from '../model/User';
>>>>>>> main

interface LoginSuccess {
    success: true;
    data: {
        token: string;
    };
<<<<<<< HEAD
    useLocalDB: boolean;
=======

>>>>>>> main
}

interface LoginError {
    success: false;
    message: string;
}

export type LoginResponse = LoginSuccess | LoginError;

export const authService = {
<<<<<<< HEAD
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

=======
    async login(email: string, senha: string): Promise<LoginResponse> {
        try {
            try {
                const loginData = {
                    email: email.trim(),
                    senha: senha.trim()
                };

                // Tenta fazer login na API
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
                } else {
                    throw new Error('Token não recebido da API');
                }
            } catch (error: any) {
                console.error('Erro na requisição:', error.response?.data || error.message);
                const errorResult = handleApiError(error);
                return errorResult as LoginError;
            }
        } catch (error) {
            console.error('Erro no login:', error);
            return {
                success: false,
                message: 'Erro ao realizar login'
            };
        }
    },

    async loginFornecedor(email: string, senha: string): Promise<LoginResponse> {
        try {
            const loginData = {
                email: email.trim(),
                senha: senha.trim()
            };
             // Tenta fazer login na API
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
            } else {
                throw new Error('Token não recebido da API');
            }
        } catch (error: any) {
            console.error('Erro na requisição:', error.response?.data || error.message);
            const errorResult = handleApiError(error);
            return errorResult as LoginError;
        }
    },

    
>>>>>>> main
    async cadastro(usuario: User): Promise<LoginResponse> {
        try {
            const response = await axios.post(`${API_URL}/usuarios`, usuario);
            if (response.data) {
                return {
                    success: true,
                    data: {
                        token: response.data.token
<<<<<<< HEAD
                    },
                    useLocalDB: false
=======
                    }
>>>>>>> main
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