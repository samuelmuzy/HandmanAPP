import axios from 'axios';
import dbPromise from '../../db';
import { checkInternetConnection, handleApiError } from '../utils/networkUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/ApiUrl';

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

export const authService = {
    async login(email: string, senha: string): Promise<LoginResponse> {
        try {
            const isConnected = await checkInternetConnection();
            console.log('Status da conexão:', isConnected);

            if (isConnected) {
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
                            useLocalDB: false
                        };
                    } else {
                        throw new Error('Token não recebido da API');
                    }
                } catch (error: any) {
                    const errorResult = handleApiError(error);
                    return errorResult as LoginError;
                }
            } else {
                // Sem conexão, usa banco local
                return await this.loginLocal(email, senha);
            }
        } catch (error) {
            console.error('Erro no login:', error);
            return {
                success: false,
                message: 'Erro ao realizar login',
                useLocalDB: true
            };
        }
    },

    async loginLocal(email: string, senha: string): Promise<LoginResponse> {
        try {
            const db = await dbPromise;
            const result = await db.getFirstAsync(
                `SELECT * FROM users WHERE email = ? AND senha = ?`,
                [email.trim(), senha.trim()]
            );

            if (result) {
                // Gera um token local para manter consistência com a API
                const localToken = `local_${Date.now()}`;
                return {
                    success: true,
                    data: {
                        token: localToken
                    },
                    useLocalDB: true
                };
            }

            return {
                success: false,
                message: 'Email ou senha incorretos',
                useLocalDB: true
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erro ao acessar banco local',
                useLocalDB: true
            };
        }
    }
}; 