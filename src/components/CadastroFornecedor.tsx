import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { typeEndereco, typeFornecedor } from '../model/Fornecedor';
import { authService } from '../services/authService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

interface CadastroFornecedorProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  currentScreen: string;
}

const CadastroFornecedor: React.FC<CadastroFornecedorProps> = ({ onBack, onNavigate, currentScreen }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [descricao, setDescricao] = useState('');
  const [subDescricao, setSubDescricao] = useState('');
  const [valor, setValor] = useState('');
  
  // Endereço
  const [rua, setRua] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  
  // Categoria de serviço (pode selecionar múltiplos)
  const [categoriasServico, setCategoriasServico] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const categorias = ['Encanamento', 'Mudança', 'Carpintaria', 'Elétricista', 'Jardinagem', 'Limpeza'];

  const toggleCategoria = (categoria: string) => {
    if (categoriasServico.includes(categoria)) {
      setCategoriasServico(categoriasServico.filter(cat => cat !== categoria));
    } else {
      setCategoriasServico([...categoriasServico, categoria]);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!nome || !email || !telefone || !senha || !confirmarSenha) {
          Alert.alert('Erro', 'Por favor, preencha todos os campos da etapa 1');
          return false;
        }
        if (senha !== confirmarSenha) {
          Alert.alert('Erro', 'As senhas não coincidem');
          return false;
        }
        return true;
      case 2:
        if (!rua || !cidade || !estado || !cep) {
          Alert.alert('Erro', 'Por favor, preencha todos os campos de endereço');
          return false;
        }
        return true;
      case 3:
        if (categoriasServico.length === 0 || !descricao || !valor) {
          Alert.alert('Erro', 'Por favor, preencha todos os campos profissionais');
          return false;
        }
        const valorNumerico = parseFloat(valor.replace(',', '.'));
        if (isNaN(valorNumerico)) {
          Alert.alert('Erro', 'Por favor, insira um valor válido');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCadastro = async () => {
    if (!validateStep(3)) {
      return;
    }

    setLoading(true);

    try {
      const endereco: typeEndereco = {
        rua,
        cidade,
        estado,
        cep
      };

      const valorNumerico = parseFloat(valor.replace(',', '.'));

      const fornecedor: Partial<typeFornecedor> = {
        nome,
        email,
        telefone,
        senha,
        endereco,
        categoria_servico: categoriasServico,
        descricao,
        sub_descricao: subDescricao,
        valor: valorNumerico,
        disponibilidade: [],
        solicitacoes: [],
        media_avaliacoes: 0,
        imagemPerfil: '',
        imagemIlustrativa: ''
      };

      const response = await authService.cadastrarFornecedor(fornecedor);
      
      if (response.success) {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        onNavigate('Login');
      } else {
        Alert.alert('Erro', response.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar realizar o cadastro');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicatorContainer}>
        {[1, 2, 3].map((step) => (
          <View key={step} style={styles.stepRow}>
            <View style={[
              styles.stepCircle,
              currentStep === step && styles.stepCircleActive,
              currentStep > step && styles.stepCircleCompleted
            ]}>
              {currentStep > step ? (
                <Icon name="check" size={20} color="#FFFFFF" />
              ) : (
                <Text style={[
                  styles.stepNumber,
                  (currentStep === step || currentStep > step) && styles.stepNumberActive
                ]}>
                  {step}
                </Text>
              )}
            </View>
            <Text style={[
              styles.stepText,
              currentStep === step && styles.stepTextActive
            ]}>
              {step === 1 ? 'Dados Pessoais' : step === 2 ? 'Endereço' : 'Dados Profissionais'}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderStep1 = () => (
    <View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Nome Completo *</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite seu nome completo"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite seu email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Telefone *</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          placeholder="Digite seu telefone"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Senha *</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          placeholder="Digite sua senha"
          placeholderTextColor="#999"
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Confirmar Senha *</Text>
        <TextInput
          style={styles.input}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          placeholder="Confirme sua senha"
          placeholderTextColor="#999"
          secureTextEntry
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Rua *</Text>
        <TextInput
          style={styles.input}
          value={rua}
          onChangeText={setRua}
          placeholder="Digite sua rua"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Cidade *</Text>
        <TextInput
          style={styles.input}
          value={cidade}
          onChangeText={setCidade}
          placeholder="Digite sua cidade"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Estado *</Text>
        <TextInput
          style={styles.input}
          value={estado}
          onChangeText={setEstado}
          placeholder="Digite seu estado"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>CEP *</Text>
        <TextInput
          style={styles.input}
          value={cep}
          onChangeText={setCep}
          placeholder="Digite seu CEP"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Categorias de Serviço *</Text>
        <View style={styles.categoriasContainer}>
          {categorias.map((categoria) => (
            <TouchableOpacity
              key={categoria}
              style={[
                styles.categoriaButton,
                categoriasServico.includes(categoria) && styles.categoriaButtonSelected
              ]}
              onPress={() => toggleCategoria(categoria)}
            >
              <Icon 
                name={
                  categoria === 'Encanamento' ? 'pipe' :
                  categoria === 'Mudança' ? 'truck' :
                  categoria === 'Carpintaria' ? 'hammer' :
                  categoria === 'Elétricista' ? 'flash' :
                  categoria === 'Jardinagem' ? 'flower' :
                  'broom'
                } 
                size={24} 
                color={categoriasServico.includes(categoria) ? '#FFFFFF' : '#7A2D00'} 
              />
              <Text style={[
                styles.categoriaButtonText,
                categoriasServico.includes(categoria) && styles.categoriaButtonTextSelected
              ]}>
                {categoria}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Descrição dos Serviços *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descreva os serviços que você oferece"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Informações Adicionais</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={subDescricao}
          onChangeText={setSubDescricao}
          placeholder="Informações adicionais sobre seus serviços"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Valor Hora/Serviço (R$) *</Text>
        <TextInput
          style={styles.input}
          value={valor}
          onChangeText={setValor}
          placeholder="Digite o valor do seu serviço"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>HANDYMAN</Text>
          <Text style={styles.subtitle}>Cadastro Profissional</Text>
          <Text style={styles.description}>Junte-se à nossa rede de profissionais qualificados!</Text>
        </View>

        {renderStepIndicator()}

        <View style={styles.card}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <View style={styles.buttonContainer}>
            {currentStep === 1 ? (
              <>
                <TouchableOpacity
                  style={[styles.navigationButton, styles.prevButton]}
                  onPress={onBack}
                >
                  <Text style={styles.navigationButtonText}>Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navigationButton, styles.nextButton]}
                  onPress={nextStep}
                >
                  <Text style={styles.navigationButtonText}>Próximo</Text>
                </TouchableOpacity>
              </>
            ) : currentStep < 3 ? (
              <>
                <TouchableOpacity
                  style={[styles.navigationButton, styles.prevButton]}
                  onPress={prevStep}
                >
                  <Text style={styles.navigationButtonText}>Anterior</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navigationButton, styles.nextButton]}
                  onPress={nextStep}
                >
                  <Text style={styles.navigationButtonText}>Próximo</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.navigationButton, styles.prevButton]}
                  onPress={prevStep}
                >
                  <Text style={styles.navigationButtonText}>Anterior</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navigationButton, styles.nextButton, loading && styles.buttonDisabled]}
                  onPress={handleCadastro}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.navigationButtonText}>Finalizar Cadastro</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
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
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  stepRow: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE1C5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#7A2D00',
  },
  stepCircleCompleted: {
    backgroundColor: '#7A2D00',
  },
  stepNumber: {
    color: '#7A2D00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepText: {
    color: '#7A2D00',
    fontSize: 12,
    textAlign: 'center',
  },
  stepTextActive: {
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#EEB16C',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  categoriasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  categoriaButton: {
    backgroundColor: '#FFE1C5',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  categoriaButtonSelected: {
    backgroundColor: '#7A2D00',
  },
  categoriaButtonText: {
    color: '#7A2D00',
    fontSize: 14,
    marginLeft: 8,
  },
  categoriaButtonTextSelected: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  prevButton: {
    backgroundColor: '#7A2D00',
  },
  nextButton: {
    backgroundColor: '#7A2D00',
  },
  navigationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default CadastroFornecedor; 