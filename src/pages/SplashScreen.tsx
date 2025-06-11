import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Importar NativeStackNavigationProp

// Importe os tipos do RootNavigation
import { RootStackParamList } from '../navigation/RootNavigation';

// Definir o tipo correto para a navegação nesta tela usando NativeStackNavigationProp
type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>; // Usar NativeStackNavigationProp

const SplashScreen = () => {
  // Usar o tipo correto para o hook useNavigation
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const scaleAnim = useRef(new Animated.Value(1)).current; // Criar valor animado para escala

  useEffect(() => {
    // Animação de pulso: escala de 1 para 1.2 e volta para 1, repetindo
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2, // Aumenta o tamanho em 20%
          duration: 1000, // Duração da animação para aumentar
          easing: Easing.ease, // Efeito suave
          useNativeDriver: true, // Usar driver nativo para melhor performance
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, // Volta ao tamanho original
          duration: 1000, // Duração da animação para diminuir
          easing: Easing.ease, // Efeito suave
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start(); // Inicia a animação

    // Timer para navegar para a próxima tela após alguns segundos
    const timer = setTimeout(() => {
      // Por enquanto, navega diretamente para AuthStack
      navigation.replace('AuthStack');

    }, 3000); // 3 segundos de delay

    // Limpa a animação e o timer se o componente for desmontado
    return () => {
      pulseAnimation.stop(); // Para a animação
      clearTimeout(timer);
    };
  }, [scaleAnim, navigation]); // Adicionado navigation como dependência

  return (
    <View style={styles.container}>
      {/* Aplicar o estilo animado ao Text */}
      <Animated.Text 
        style={[styles.title, { transform: [{ scale: scaleAnim }] }]}> 
        HANDYMAN
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F0E5', // Um fundo claro, como na imagem (pode ser ajustado se a cor do frontend for diferente)
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF7F11', // Cor laranja do design (ajustar se necessário para a cor exata do frontend)
  },
});

export default SplashScreen; 