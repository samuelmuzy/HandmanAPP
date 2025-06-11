import axios from 'axios';
import {  handleApiError } from '../utils/networkUtils';
;
import { API_URL } from '../constants/ApiUrl';
import { User } from '../model/User';

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
            } else {
                throw new Error('Dados não recebidos da API');
            }
        } catch (error: any) {
            const errorResult = handleApiError(error);
            return errorResult as LoginError;
        }
    }
}; 