import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useBiometric } from '../../hooks/useBiometric';
import { Fingerprint } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface InputWithLabelProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address';
    editable?: boolean;
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({
    label,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType = 'default',
    editable = true,
}) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                editable={editable}
            />
        </View>
    );
};

interface LoginScreenProps {
    onBack: () => void;
    onNavigate: (screen: string) => void;
    currentScreen: string;
}

const LoginFornecedor: React.FC<LoginScreenProps> = ({ onBack, onNavigate, currentScreen }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasStoredCredentials, setHasStoredCredentials] = useState(false);
    const { loginFornecedor } = useAuth();
    const { isBiometricAvailable, authenticateWithBiometrics, checkBiometricAvailability } = useBiometric();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                console.log('=== Iniciando verificação de autenticação ===');
                // Força uma nova verificação de biometria
                await checkBiometricAvailability();
                console.log('Status da biometria após verificação:', isBiometricAvailable);
                
                // Verifica credenciais salvas
                const savedEmail = await AsyncStorage.getItem('lastLoginEmail');
                const savedPassword = await AsyncStorage.getItem('lastLoginPassword');
                
                console.log('=== Status das credenciais ===');
                console.log('Email salvo:', savedEmail ? 'Sim' : 'Não');
                console.log('Senha salva:', savedPassword ? 'Sim' : 'Não');
                console.log('Biometria disponível:', isBiometricAvailable);

                // Apenas marca que existem credenciais, mas não as exibe
                setHasStoredCredentials(!!savedEmail && !!savedPassword);

                if (savedEmail && savedPassword && isBiometricAvailable) {
                    console.log('Iniciando autenticação biométrica...');
                    handleBiometricLogin();
                } else {
                    console.log('Condições para biometria não atendidas');
                    if (!isBiometricAvailable) console.log('Biometria não disponível');
                    if (!savedEmail || !savedPassword) console.log('Credenciais não encontradas');
                }
            } catch (error) {
                console.error('Erro durante a inicialização:', error);
            }
        };

        initializeAuth();
    }, [isBiometricAvailable]);

    const handleBiometricLogin = async () => {
        if (!isBiometricAvailable) {
            console.log('Tentativa de autenticação biométrica quando não disponível');
            return;
        }

        try {
            console.log('=== Iniciando login biométrico ===');
            setLoading(true);

            const success = await authenticateWithBiometrics();
            console.log('Resultado da autenticação biométrica:', success);
            
            if (success) {
                const savedEmail = await AsyncStorage.getItem('lastLoginEmail');
                const savedPassword = await AsyncStorage.getItem('lastLoginPassword');
                
                if (savedEmail && savedPassword) {
                    console.log('Tentando login com credenciais salvas');
                    const result = await loginFornecedor(savedEmail, savedPassword);
                    
                    if (result.success) {
                        console.log('Login biométrico bem-sucedido!');
                        onNavigate('MainApp');
                    } else {
                        console.log('Falha no login com credenciais salvas:', result.message);
                        Alert.alert('Erro', 'Credenciais inválidas. Por favor, faça login manualmente.');
                        // Limpa as credenciais inválidas
                        await AsyncStorage.removeItem('lastLoginEmail');
                        await AsyncStorage.removeItem('lastLoginPassword');
                        setHasStoredCredentials(false);
                    }
                }
            } else {
                console.log('Autenticação biométrica cancelada ou falhou');
            }
        } catch (error) {
            console.error('Erro durante login biométrico:', error);
            Alert.alert('Erro', 'Ocorreu um erro na autenticação biométrica. Por favor, faça login manualmente.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        if (!email || !senha) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos');
            return;
        }

        setLoading(true);
        try {
            console.log('=== Iniciando login manual ===');
            const result = await loginFornecedor(email, senha);

            if (result.success) {
                console.log('Login manual bem-sucedido, salvando credenciais');
                await AsyncStorage.setItem('lastLoginEmail', email);
                await AsyncStorage.setItem('lastLoginPassword', senha);
                setHasStoredCredentials(true);
                
                Alert.alert('Login realizado com sucesso!');
                onNavigate('MainApp');
            } else {
                console.log('Falha no login manual:', result.message);
                Alert.alert('Erro de login', result.message);
            }
        } catch (error) {
            console.error('Erro durante login manual:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView 
            contentContainerStyle={styles.container} 
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.headerContainer}>
                <Text style={styles.title}>HANDYMAN</Text>
                <Text style={styles.subtitle}>Não faça você mesmo,{'\n'}encontre um proficional!</Text>
                <Text style={styles.description}>A sua plataforma confiável para serviços manuais!</Text>
            </View>

            <View style={styles.card}>
                <InputWithLabel
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    editable={!loading}
                />
                
                <View style={styles.passwordContainer}>
                    <InputWithLabel
                        label="Senha"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                        editable={!loading}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.loginButton, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.loginButtonText}>Login</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Não tem uma conta? </Text>
                    <TouchableOpacity onPress={() => onNavigate('Cadastro')}>
                        <Text style={styles.registerLink}>Cadastre-se</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>Tente outro método</Text>
                    <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
                    <Text style={styles.socialButtonText}>Entrar com o Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.socialButton, styles.facebookButton]}>
                    <Text style={styles.socialButtonText}>Entrar com o Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
                    <Text style={[styles.socialButtonText, styles.appleButtonText]}>Entrar com Apple</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#B54708',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 24,
        color: '#B54708',
        marginBottom: 8,
        lineHeight: 32,
    },
    description: {
        fontSize: 16,
        color: '#B54708',
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#EEB16C',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        margin: 10,
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: '#FFFFFF',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#FFE1C5',
        borderRadius: 10,
        padding: 16,
        fontSize: 16,
        color: '#333',
        height: 56,
    },
    passwordContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
    },
    loginButton: {
        backgroundColor: '#7A2D00',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
    },
    registerText: {
        color: '#333',
        fontSize: 14,
    },
    registerLink: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#333',
    },
    dividerText: {
        paddingHorizontal: 16,
        color: '#333',
        fontSize: 14,
    },
    socialButton: {
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    googleButton: {
        backgroundColor: '#1E1E1E',
    },
    facebookButton: {
        backgroundColor: '#1877F2',
    },
    appleButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    socialButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    appleButtonText: {
        color: '#000000',
    },
});

export default LoginFornecedor;