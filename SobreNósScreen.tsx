import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import HeaderNavigation from './HeaderNavigation';
import BarraDeNavegacao from './BarraDeNavegacao';

const { width, height } = Dimensions.get('window'); // Added height here

interface SobreNosScreenProps {
  onNavigate: (screen: string) => void;
  activeScreen: string;
}

const SobreNosScreen: React.FC<SobreNosScreenProps> = ({ onNavigate, activeScreen }) => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <HeaderNavigation onNavigate={onNavigate} activeScreen={activeScreen} />
        {/* Seção 1: Bem-vindo */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Handyman</Text>
          <Text style={styles.welcome}>Bem-vindo à Handyman, a sua plataforma confiável para serviços manuais!</Text>
          <Text style={styles.description}>
            Somos especializados em conectar você a profissionais qualificados para realizar pequenos reparos, reformas, montagens, instalações e muito mais. Nosso objetivo é proporcionar praticidade, segurança e qualidade em cada serviço, garantindo que sua casa ou empresa esteja sempre em ótimas condições.
          </Text>
        </View>

        {/* Seção 2: Como Funciona */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como o HandyMan Funciona?</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Profissionais qualificados – </Text>
            Todos os nossos prestadores são experientes e de confiança.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Agilidade no atendimento – </Text>
            Solicite um serviço de forma rápida e prática.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Orçamentos justos – </Text>
            Preços acessíveis e transparência em cada etapa.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Diversidade de serviços – </Text>
            Desde consertos elétricos até montagem de móveis.
          </Text>
          <Text style={styles.text}>
            Na Handyman, acreditamos que um bom trabalho manual faz toda a diferença no dia a dia. Conte conosco para facilitar sua vida e deixar tudo do jeito que você precisa!
          </Text>
          <Text style={styles.text}>🔧 Entre em contato e solicite um serviço agora mesmo!</Text>
        </View>

        {/* Seção 3: Nossa Essência */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossa Essência</Text>
          <Text style={styles.text}>
            A Handyman nasceu com a missão de conectar você a profissionais qualificados e confiáveis para resolver demandas do seu dia a dia. Valorizamos a excelência, a transparência e a praticidade. Estamos sempre prontos para atender suas necessidades com soluções eficientes e confiáveis.
          </Text>
          <Image
            source={require('./assets/mesa.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </ScrollView>
      <BarraDeNavegacao onNavigate={onNavigate} activeScreen={activeScreen} />
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
  headerSection: {
    backgroundColor: '#fff5e6',
    borderRadius: 8,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    color: '#AD5700',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  welcome: {
    color: '#333',
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
    textAlign: 'center',
  },
  description: {
    color: '#666',
    fontSize: width * 0.035,
    textAlign: 'center',
  },
  section: {
    marginBottom: height * 0.03,
    backgroundColor: '#fff5e6',
    borderRadius: 8,
    padding: width * 0.04,
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
    textAlign: 'center',
  },
  text: {
    fontSize: width * 0.035,
    color: '#333',
    marginBottom: height * 0.01,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: height * 0.2,
    borderRadius: 8,
    marginTop: height * 0.01,
  },
});

export default SobreNosScreen;