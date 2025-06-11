import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window'); // Added height here

// Fallback status bar height for Android or when StatusBar.currentHeight is unavailable
const STATUS_BAR_HEIGHT = Platform.OS === 'android' && StatusBar.currentHeight ? StatusBar.currentHeight : 20;

interface HeaderNavigationProps {
  onNavigate: (screen: string) => void;
  activeScreen: string;
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ onNavigate, activeScreen }) => {
  const navItems = ['Serviços', 'Sobre Nós', 'Ajuda'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.logo}>HANDMAN</Text>
        <View style={styles.nav}>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => onNavigate(item)}
              style={styles.navItemContainer}
            >
              <Text style={[styles.navItem, activeScreen === item ? styles.activeNavItem : null]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: {
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#AD5700',
    padding: width * 0.03,
    borderRadius: 6, 
    marginBottom: height * 0.02, 
    
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
  navItemContainer: {
    marginHorizontal: width * 0.02,
  },
  navItem: {
    fontSize: width * 0.035,
    color: 'white',
    fontWeight: '600',
  },
  activeNavItem: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});

export default HeaderNavigation;