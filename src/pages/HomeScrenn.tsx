import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './LoginScreen';
import CadastroScreen from './CadastroScreen';
import SobreNosScreen from './SobreNósScreen';
import AjudaScreen from './AjudaScreen';
import HeaderNavigation from '../../HeaderNavigation';
import BarraDeNavegacao from '../../BarraDeNavegacao';
import { runMigrations } from '../../migrations';
import Login from '../components/Login';
import Cadastro from '../components/Cadastro';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight } from 'lucide-react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../navigation/TabNavigation';

const { width, height } = Dimensions.get('window');
declare function require(path: string): any;

const backgroundImage = require('../assets/handman.jpg');
const images: Record<string, any> = {
  Mudança: require('../assets/truck.png'),
  Carpintaria: require('../assets/carpintaria.png'),
  Elétrica: require('../assets/operador.png'),
  Limpeza: require('../assets/limpeza.png'),
  Jardinagem: require('../assets/triming.png'),
  Encanamento: require('../assets/pipe.png'),
};

type HomeScreenNavigationProp = BottomTabNavigationProp<RootTabParamList, 'Home'>;

const HomeScreen = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  let currentIndex = 0;
  const [showLogin, setShowLogin] = useState(false);
  const [showCadastro, setShowCadastro] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Home');
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    runMigrations().catch((err) => {
      console.error('Erro ao rodar migrations:', err);
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % 3;
      scrollViewRef.current?.scrollTo({
        x: currentIndex * (width * 0.8 + 10),
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
    setShowLogin(false);
    setShowCadastro(false);
  };

  const handleDiscoverPress = () => {
    navigation.navigate('Serviços');
  };

  if (showLogin) {
    return (
      <Login
        onBack={() => setShowLogin(false)}
        onNavigate={handleNavigate}
        currentScreen={currentScreen}
      />
    );
  }

  if (showCadastro) {
    return (
      <Cadastro
        onBack={() => setShowCadastro(false)}
        onNavigate={handleNavigate}
        currentScreen={currentScreen}
      />
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return (
          <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.title}>HANDYMAN</Text>
              <Text style={styles.headerTitle}>Não faça você mesmo,{'\n'}encontre um profissional!</Text>
              <Text style={styles.headerSubtitle}>A sua plataforma confiável para serviços manuais!</Text>
              <TouchableOpacity style={styles.discoverButton} onPress={handleDiscoverPress}>
                <Text style={styles.discoverButtonText}>Descubra</Text>
                <ArrowRight color="#B54708" size={24} />
              </TouchableOpacity>
            </View>

            {/* Nossa Essência Section */}
            <View style={styles.essenciaSection}>
              <Text style={styles.sectionTitle}>Nossa Essência</Text>
              <Text style={styles.essenciaText}>
                A Handyman nasceu com a missão de conectar você a profissionais qualificados para serviços manuais de forma simples e segura. Seja para consertos, instalações, montagens ou pequenos reparos, estamos aqui para facilitar o seu dia a dia com soluções eficientes e confiáveis.
              </Text>
            </View>

            {/* Descubra Profissionais Section */}
            <View style={styles.profissionaisSection}>
              <Text style={styles.profissionaisTitle}>Descubra Profissionais</Text>
              <Image 
                source={require('../assets/worker.jpg')} 
                style={styles.profissionalImage}
                resizeMode="cover"
              />
            </View>
          </ScrollView>
        );
      case 'Serviços':
        return (
          <View style={styles.container}>
            <HeaderNavigation onNavigate={handleNavigate} activeScreen={currentScreen} />
            <Text style={styles.sectionTitle}>Tela de Serviços</Text>
            {/* Add your Serviços screen content here */}
          </View>
        );
      case 'Sobre Nós':
        return (
          <SobreNosScreen onNavigate={handleNavigate} activeScreen={currentScreen} />
        );
      case 'Ajuda':
        return (
          <AjudaScreen onNavigate={handleNavigate} activeScreen={currentScreen} />
        );
      default:
        return (
          <ScrollView contentContainerStyle={styles.container}>
            <HeaderNavigation onNavigate={handleNavigate} activeScreen={currentScreen} />
            <ImageBackground source={backgroundImage} style={styles.background}>
              <View style={styles.main}>
                <Text style={styles.mainText}>Não faça você mesmo, encontre um profissional</Text>
                <TextInput style={styles.searchInput} placeholder="O que procura?" />
                <View style={styles.services}>
                  {['Mudança', 'Carpintaria', 'Elétrica', 'Limpeza', 'Jardinagem', 'Encanamento'].map(
                    (service) => (
                      <View key={service} style={styles.serviceItem}>
                        <Image source={images[service]} style={styles.serviceIcon} />
                        <Text style={styles.serviceText}>{service}</Text>
                      </View>
                    )
                  )}
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.loginButton} onPress={() => setShowLogin(true)}>
                    <Text style={styles.loginButtonText}>Entrar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cadastroButton} onPress={() => setShowCadastro(true)}>
                    <Text style={styles.cadastroButtonText}>Cadastrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
            <View style={styles.howItWorks}>
              <Text style={styles.sectionTitle}>Como o HandyMan funciona?</Text>
              <View style={styles.textSection}>
                <Text style={styles.textPoint}>• Trabalho de qualidade - eficiente e confiável</Text>
                <Text style={styles.textPoint}>
                  • Receba entregas pontuais e de alta qualidade, seja um trabalho de curto prazo ou um
                  projeto complexo.
                </Text>
                <Text style={styles.textPoint}>• Segurança em cada pedido</Text>
                <Text style={styles.textPoint}>• Trabalhe com especialistas que falam português</Text>
                <Text style={styles.textPoint}>• Suporte 24 horas por dia</Text>
              </View>
            </View>
            <View style={styles.testimonials}>
              <Text style={styles.sectionTitle}>O que estão dizendo sobre nós?</Text>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                ref={scrollViewRef}
              >
                <View style={styles.testimonial}>
                  <Text style={styles.testimonialAuthor}>Jana T.</Text>
                  <Text style={styles.testimonialContent}>
                    Contratei o serviço para instalar algumas prateleiras e o profissional fez tudo de forma
                    rápida e eficiente. Em menos de 40 minutos, tudo estava instalado e perfeitamente
                    nivelado. A experiência foi ótima e vou com certeza usar novamente.
                  </Text>
                </View>
                <View style={styles.testimonial}>
                  <Text style={styles.testimonialAuthor}>Elizabeth P.</Text>
                  <Text style={styles.testimonialContent}>
                    Precisei de ajuda para montar móveis e o profissional foi super rápido e cuidadoso. Ele
                    montou dois armários e ainda ajustou uma porta que estava desalinhada, tudo em menos de
                    1 hora. Serviço excelente e recomendo demais.
                  </Text>
                </View>
                <View style={styles.testimonial}>
                  <Text style={styles.testimonialAuthor}>Amanda L.</Text>
                  <Text style={styles.testimonialContent}>
                    Solicitei o serviço para pequenos reparos e o profissional chegou rápido e resolveu tudo
                    rapidamente. Ele consertou uma torneira vazando e ainda montou um móvel para mim em tempo
                    recorde. Muito satisfeita com o resultado.
                  </Text>
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        );
    }
  };

  return (
    <View style={styles.rootContainer}>
      {renderScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF7F1',
  },
  header: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B54708',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    lineHeight: 38,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  discoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#B54708',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  discoverButtonText: {
    color: '#B54708',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  essenciaSection: {
    padding: 24,
    backgroundColor: '#FFE5D1',
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B54708',
    marginBottom: 16,
  },
  essenciaText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    textAlign: 'justify',
  },
  profissionaisSection: {
    padding: 24,
    marginTop: 32,
  },
  profissionaisTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B54708',
    marginBottom: 16,
  },
  profissionalImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginTop: 8,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: height * 0.02,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: width * 0.05,
    marginBottom: height * 0.03,
  },
  mainText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  searchInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: width * 0.03,
    backgroundColor: 'white',
    marginBottom: height * 0.02,
  },
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: height * 0.02,
  },
  serviceItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: height * 0.02,
    backgroundColor: '#fff',
    padding: width * 0.03,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  serviceIcon: {
    width: width * 0.15,
    height: width * 0.15,
  },
  serviceText: {
    marginTop: height * 0.01,
    fontSize: width * 0.035,
    fontWeight: '500',
    color: '#black',
  },
  howItWorks: {
    marginTop: height * 0.03,
    padding: width * 0.05,
    backgroundColor: '#fff5e6',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  textSection: {
    marginBottom: height * 0.02,
  },
  textPoint: {
    fontSize: width * 0.04,
    color: '#333',
    marginBottom: height * 0.01,
  },
  testimonials: {
    marginTop: height * 0.03,
    padding: width * 0.05,
    backgroundColor: '#fff5e6',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  testimonial: {
    width: width * 0.8,
    padding: width * 0.05,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginHorizontal: width * 0.02,
  },
  testimonialAuthor: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    color: '#AD5700',
  },
  testimonialContent: {
    fontSize: width * 0.035,
    color: '#333',
    textAlign: 'justify',
  },
  loginButton: {
    backgroundColor: '#AD5700',
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.1,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: width * 0.02,
  },
  loginButtonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  cadastroButton: {
    backgroundColor: '#AD5700',
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.1,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: width * 0.02,
  },
  cadastroButtonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.02,
  },
});

export default HomeScreen;

