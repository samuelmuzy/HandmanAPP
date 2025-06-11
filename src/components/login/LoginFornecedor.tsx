import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useBiometric } from '../../hooks/useBiometric';
<<<<<<< HEAD
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
=======
>>>>>>> cbf92d8044a778853fef1fe14218784b147c4fde
import AsyncStorage from '@react-native-async-storage/async-storage';



interface InputWithLabelProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address';
    editable?: boolean;
    icon?: string;
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({
    label,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType = 'default',
    editable = true,
    icon,
}) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={styles.inputWrapper}>
                {icon && <Icon name={icon} size={24} color="#7A2D00" style={styles.inputIcon} />}
                <TextInput
                    style={[styles.input, icon && styles.inputWithIcon]}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    editable={editable}
                    placeholderTextColor="#999"
                />
            </View>
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
    console.log(hasStoredCredentials)

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await checkBiometricAvailability();
                const savedEmail = await AsyncStorage.getItem('lastLoginEmail');
                const savedPassword = await AsyncStorage.getItem('lastLoginPassword');
                setHasStoredCredentials(!!savedEmail && !!savedPassword);

                if (savedEmail && savedPassword && isBiometricAvailable) {
                    handleBiometricLogin();
                }
            } catch (error) {
                console.error('Erro durante a inicialização:', error);
            }
        };

        initializeAuth();
    }, [isBiometricAvailable]);

    const handleBiometricLogin = async () => {
        if (!isBiometricAvailable) {
            return;
        }

        try {
            setLoading(true);
            const success = await authenticateWithBiometrics();
            
            if (success) {
                const savedEmail = await AsyncStorage.getItem('lastLoginEmail');
                const savedPassword = await AsyncStorage.getItem('lastLoginPassword');
                
                if (savedEmail && savedPassword) {
                    const result = await loginFornecedor(savedEmail, savedPassword);
                    
                    if (result.success) {
                        onNavigate('MainApp');
                    } else {
                        Alert.alert('Erro', 'Credenciais inválidas. Por favor, faça login manualmente.');
                        await AsyncStorage.removeItem('lastLoginEmail');
                        await AsyncStorage.removeItem('lastLoginPassword');
                        setHasStoredCredentials(false);
                    }
                }
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
            const result = await loginFornecedor(email, senha);

            if (result.success) {
                await AsyncStorage.setItem('lastLoginEmail', email);
                await AsyncStorage.setItem('lastLoginPassword', senha);
                setHasStoredCredentials(true);
                onNavigate('MainApp');
            } else {
                Alert.alert('Erro de login', result.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login');
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
                <Text style={styles.subtitle}>Área do Profissional</Text>
                <Text style={styles.description}>Acesse sua conta e gerencie seus serviços!</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.loginSection}>
                    <Text style={styles.loginTitle}>Login Profissional</Text>
                    
                    <InputWithLabel
                        label="Email Profissional"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        editable={!loading}
                        icon="email"
                    />
                    
                    <InputWithLabel
                        label="Senha"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                        editable={!loading}
                        icon="lock"
                    />

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Icon name="account-hard-hat" size={24} color="#FFFFFF" style={styles.buttonIcon} />
                                <Text style={styles.loginButtonText}>Entrar como Profissional</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {hasStoredCredentials && isBiometricAvailable && (
                        <TouchableOpacity
                            style={styles.biometricButton}
                            onPress={handleBiometricLogin}
                            disabled={loading}
                        >
                            <Icon name="fingerprint" size={24} color="#7A2D00" />
                            <Text style={styles.biometricText}>Entrar com Biometria</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.registerContainer}>
                    <TouchableOpacity 
                        style={styles.registerButton}
                        onPress={() => onNavigate('CadastroFornecedor')}
                    >
                        <View style={styles.buttonContent}>
                            <Icon name="account-hard-hat-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.registerButtonText}>Cadastre-se como profissional</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.registerContainer}>
                    <TouchableOpacity 
                        style={styles.registerButton}
                        onPress={onBack}
                    >
                        <View style={styles.buttonContent}>
                            <Text style={styles.registerButtonText}>Voltar</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.benefitsContainer}>
                    <Text style={styles.benefitsTitle}>Benefícios para Profissionais</Text>
                    <View style={styles.benefitItem}>
                        <Icon name="calendar-check" size={24} color="#7A2D00" />
                        <Text style={styles.benefitText}>Gerencie sua agenda de serviços</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Icon name="star" size={24} color="#7A2D00" />
                        <Text style={styles.benefitText}>Receba avaliações e construa sua reputação</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Icon name="cash" size={24} color="#7A2D00" />
                        <Text style={styles.benefitText}>Defina seus próprios preços</Text>
                    </View>
                </View>
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
        flex: 1,
    },
    loginSection: {
        backgroundColor: '#FFE1C5',
        borderRadius: 10,
        padding: 20,
        marginBottom: 24,
    },
    loginTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#7A2D00',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: '#7A2D00',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
    },
    inputIcon: {
        padding: 16,
    },
    input: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        color: '#333',
    },
    inputWithIcon: {
        paddingLeft: 0,
    },
    loginButton: {
        backgroundColor: '#7A2D00',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    biometricButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    biometricText: {
        color: '#7A2D00',
        fontSize: 14,
        marginLeft: 8,
    },
    registerContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    registerButton: {
        backgroundColor: '#7A2D00',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        minWidth: 250,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 8,
    },
    benefitsContainer: {
        backgroundColor: '#FFE1C5',
        borderRadius: 10,
        padding: 20,
    },
    benefitsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7A2D00',
        marginBottom: 16,
        textAlign: 'center',
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    benefitText: {
        color: '#7A2D00',
        fontSize: 14,
        marginLeft: 12,
        flex: 1,
    },
});

export default LoginFornecedor;