import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

interface BarraDeNavegacaoProps {
  onNavigate: (screen: string) => void;
  activeScreen: string;
}

const BarraDeNavegacao: React.FC<BarraDeNavegacaoProps> = ({ onNavigate, activeScreen }) => {
  const handlePress = (screen: string) => {
    onNavigate(screen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem} onPress={() => handlePress('Home')}>
        <Image
          source={require('./assets/home.png')}
          style={[styles.image, activeScreen === 'Home' && styles.activeImage]}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => handlePress('Serviços')}>
        <Image
          source={require('./assets/servicos.png')}
          style={[styles.image, activeScreen === 'Serviços' && styles.activeImage]}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => handlePress('Agenda')}>
        <Image
          source={require('./assets/agenda.png')}
          style={[styles.image, activeScreen === 'Agenda' && styles.activeImage]}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => handlePress('Perfil')}>
        <Image
          source={require('./assets/perfil.png')}
          style={[styles.image, activeScreen === 'Perfil' && styles.activeImage]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: height * 0.02,
    backgroundColor: '#EEB16C',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  navItem: {
    padding: width * 0.02,
  },
  image: {
    width: width * 0.08,
    height: width * 0.08,
    tintColor: 'white',
  },
  activeImage: {
    tintColor: 'yellow',
  },
});

export default BarraDeNavegacao;