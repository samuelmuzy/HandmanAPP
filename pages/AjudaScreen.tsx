import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import HeaderNavigation from '../HeaderNavigation';
import BarraDeNavegacao from '../BarraDeNavegacao';

const { width, height } = Dimensions.get('window');

interface AjudaScreenProps {
  onNavigate: (screen: string) => void;
  activeScreen: string;
}

const AjudaScreen: React.FC<AjudaScreenProps> = ({ onNavigate, activeScreen }) => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <HeaderNavigation onNavigate={onNavigate} activeScreen={activeScreen} />
        {/* Seção 1: Bem-vindo */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Handyman</Text>
          <Text style={styles.welcome}>Bem-vindo à Handyman, a sua plataforma confiável para serviços manuais!</Text>
          <Text style={styles.description}>
            Estamos aqui para ajudar! Se precisar de suporte com algum serviço, nossa equipe está pronta para te auxiliar com praticidade e segurança. Entre em contato e resolva suas dúvidas rapidamente.
          </Text>
        </View>

        {/* Seção 2: Como Funciona */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como o HandyMan Funciona?</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Pesquise profissionais – </Text>
            Toque para procurar os profissionais de acordo com o tipo de serviço desejado.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Escolha um prestador – </Text>
            Escolha entre uma infinidade de profissionais qualificados e experientes.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Contrate com segurança – </Text>
            Todos os serviços são garantidos para sua total segurança.
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Conclua o serviço – </Text>
            Após a conclusão do serviço, avalie o profissional e deixe seu comentário.
          </Text>
          <Text style={styles.text}>
            Se precisar de ajuda em qualquer etapa, nosso suporte está disponível 24/7 para te atender!
          </Text>
        </View>

        {/* Seção 3: Nossa Essência */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossa Essência</Text>
          <Text style={styles.text}>
            A Handyman foi criada para simplificar sua vida. Nosso objetivo é conectar você a profissionais confiáveis para resolver qualquer necessidade do dia a dia, com transparência e eficiência. Conte conosco para um suporte rápido e soluções práticas.
          </Text>
          <Image
            source={require('../assets/mesa.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </ScrollView>
      
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

export default AjudaScreen;