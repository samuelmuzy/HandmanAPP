import { createContext, useContext, useState, useEffect } from "react";
import { authService, LoginResponse } from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    isLoading: boolean;
    login: (email: string, senha: string) => Promise<LoginResponse>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verifica se existe um token salvo ao iniciar o app
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('userToken');
            console.log('Token armazenado:', storedToken);
            
            if (storedToken) {
                setToken(storedToken);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, senha: string) => {
        try {
            setIsLoading(true);
            const response = await authService.login(email, senha);
            
            if (response.success && response.data.token) {
                const newToken = response.data.token;

                await AsyncStorage.setItem('userToken', newToken);
                
                setToken(newToken);
                setIsAuthenticated(true);
                
                return response;
            } else {
                return response;
            }
        } catch (error: any) {
            console.error('Erro ao fazer login:', error.message);
            return error as LoginResponse;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await AsyncStorage.removeItem('userToken');
            setToken(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            token,
            isLoading,
            login, 
            logout,
            checkAuth 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};