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
      console.log('Checking biometric hardware...');
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      console.log('Has biometric hardware:', hasHardware);

      console.log('Checking if biometrics are enrolled...');
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      console.log('Has enrolled biometrics:', isEnrolled);
      
      const isAvailable = hasHardware && isEnrolled;
      console.log('Setting biometric availability to:', isAvailable);
      setIsBiometricAvailable(isAvailable);
      
      if (hasHardware) {
        console.log('Getting supported authentication types...');
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        console.log('Supported types:', supportedTypes);

        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          console.log('Setting biometric type to fingerprint');
          setBiometricType('fingerprint');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          console.log('Setting biometric type to face');
          setBiometricType('face');
        }
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsBiometricAvailable(false);
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      if (!isBiometricAvailable) {
        console.log('Biometric authentication is not available');
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