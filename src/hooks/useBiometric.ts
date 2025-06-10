import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export const useBiometric = () => {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  useEffect(() => {
    console.log('useBiometric hook mounted');
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
  
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
      
      const isAvailable = hasHardware && isEnrolled;

      setIsBiometricAvailable(isAvailable);
      
      if (hasHardware) {
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          
          setBiometricType('fingerprint');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
         
          setBiometricType('face');
        }
      }
    } catch (error) {
      console.log(error)
      setIsBiometricAvailable(false);
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      if (!isBiometricAvailable) {
        
        return false;
      }

      console.log('Starting biometric authentication...');
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirme sua identidade',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
        fallbackLabel: 'Use senha',
      });

      console.log('Authentication result:', result);
      return result.success;
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      return false;
    }
  };

  return {
    isBiometricAvailable,
    biometricType,
    authenticateWithBiometrics,
    checkBiometricAvailability
  };
}; 