import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, Dimensions, ImageBackground, TouchableOpacity } from 'react-native';
import LoginScreen from './LoginScreen';
import CadastroScreen from './CadastroScreen';
import BarraDeNavegacao from './BarraDeNavegacao';
import { runMigrations } from './migrations'; 

const { width, height } = Dimensions.get('window');
declare function require(path: string): any;

const backgroundImage = require('./assets/handman.jpg');
const images: Record<string, any> = {
  Mudança: require('./assets/truck.png'),
  Carpintaria: require('./assets/carpintaria.png'),
  Elétrica: require('./assets/operador.png'),
  Limpeza: require('./assets/limpeza.png'),
  Jardinagem: require('./assets/triming.png'),
  Encanamento: require('./assets/pipe.png'),
};

const HandyManApp = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  let currentIndex = 0;
  const [showLogin, setShowLogin] = useState(false);
  const [showCadastro, setShowCadastro] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Home');

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
  };

  if (showLogin) {
    return <LoginScreen onBack={() => setShowLogin(false)} />;
  }

  if (showCadastro) {
    return <CadastroScreen onBack={() => setShowCadastro(false)} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return (
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
              <Text style={styles.logo}>HANDMAN</Text>
              <View style={styles.nav}>
                <Text style={styles.navItem}>Serviços</Text>
                <Text style={styles.navItem}>Sobre Nós</Text>
                <Text style={styles.navItem}>Ajuda</Text>
              </View>
            </View>

            <ImageBackground source={backgroundImage} style={styles.background}>
              <View style={styles.main}>
                <Text style={styles.mainText}>Não faça você mesmo, encontre um profissional</Text>
                <TextInput style={styles.searchInput} placeholder="O que procura?" />
                <View style={styles.services}>
                  {['Mudança', 'Carpintaria', 'Elétrica', 'Limpeza', 'Jardinagem', 'Encanamento'].map((service) => (
                    <View key={service} style={styles.serviceItem}>
                      <Image source={images[service]} style={styles.serviceIcon} />
                      <Text style={styles.serviceText}>{service}</Text>
                    </View>
                  ))}
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
                <Text style={styles.textPoint}>• Receba entregas pontuais e de alta qualidade, seja um trabalho de curto prazo ou um projeto complexo.</Text>
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
                    Contratei o serviço para instalar algumas prateleiras e o profissional fez tudo de forma rápida e eficiente. Em menos de 40 minutos, tudo estava instalado e perfeitamente nivelado. A experiência foi ótima e vou com certeza usar novamente.
                  </Text>
                </View>
                <View style={styles.testimonial}>
                  <Text style={styles.testimonialAuthor}>Elizabeth P.</Text>
                  <Text style={styles.testimonialContent}>
                    Precisei de ajuda para montar móveis e o profissional foi super rápido e cuidadoso. Ele montou dois armários e ainda ajustou uma porta que estava desalinhada, tudo em menos de 1 hora. Serviço excelente e recomendo demais.
                  </Text>
                </View>
                <View style={styles.testimonial}>
                  <Text style={styles.testimonialAuthor}>Amanda L.</Text>
                  <Text style={styles.testimonialContent}>
                    Solicitei o serviço para pequenos reparos e o profissional chegou rápido e resolveu tudo rapidamente. Ele consertou uma torneira vazando e ainda montou um móvel para mim em tempo recorde. Muito satisfeita com o resultado.
                  </Text>
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        );
      case 'Serviços':
        return <Text>Tela de Serviços</Text>;
      case 'Agenda':
        return <Text>Tela de Agenda</Text>;
      case 'Perfil':
        return <Text>Tela de Perfil</Text>;
      default:
        return (
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
              <Text style={styles.logo}>HANDMAN</Text>
              <View style={styles.nav}>
                <Text style={styles.navItem}>Serviços</Text>
                <Text style={styles.navItem}>Sobre Nós</Text>
                <Text style={styles.navItem}>Ajuda</Text>
              </View>
            </View>

            <ImageBackground source={backgroundImage} style={styles.background}>
              <View style={styles.main}>
                <Text style={styles.mainText}>Não faça você mesmo, encontre um profissional</Text>
                <TextInput style={styles.searchInput} placeholder="O que procura?" />
                <View style={styles.services}>
                  {['Mudança', 'Carpintaria', 'Elétrica', 'Limpeza', 'Jardinagem', 'Encanamento'].map((service) => (
                    <View key={service} style={styles.serviceItem}>
                      <Image source={images[service]} style={styles.serviceIcon} />
                      <Text style={styles.serviceText}>{service}</Text>
                    </View>
                  ))}
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
                <Text style={styles.textPoint}>• Receba entregas pontuais e de alta qualidade, seja um trabalho de curto prazo ou um projeto complexo.</Text>
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
                    Contratei o serviço para instalar algumas prateleiras e o profissional fez tudo de forma rápida e eficiente. Em menos de 40 minutos, tudo estava instalado e perfeitamente nivelado. A experiência foi ótima e vou com certeza usar novamente.
                  </Text>
                </View>
                <View style={styles.testimonial}>
                  <Text style={styles.testimonialAuthor}>Elizabeth P.</Text>
                  <Text style={styles.testimonialContent}>
                    Precisei de ajuda para montar móveis e o profissional foi super rápido e cuidadoso. Ele montou dois armários e ainda ajustou uma porta que estava desalinhada, tudo em menos de 1 hora. Serviço excelente e recomendo demais.
                  </Text>
                </View>
                <View style={styles.testimonial}>
                  <Text style={styles.testimonialAuthor}>Amanda L.</Text>
                  <Text style={styles.testimonialContent}>
                    Solicitei o serviço para pequenos reparos e o profissional chegou rápido e resolveu tudo rapidamente. Ele consertou uma torneira vazando e ainda montou um móvel para mim em tempo recorde. Muito satisfeita com o resultado.
                  </Text>
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
      <BarraDeNavegacao onNavigate={handleNavigate} activeScreen={currentScreen} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.05,
    backgroundColor: '#EEB16C',
    paddingBottom: height * 0.1, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#AD5700',
    padding: width * 0.03,
    borderRadius: 8,
    marginTop: height * 0.05,
  },
  logo: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'black',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    marginHorizontal: width * 0.02,
    fontSize: width * 0.035,
    color: 'white',
    fontWeight: '600',
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
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#AD5700',
    marginBottom: height * 0.02,
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

export default HandyManApp;