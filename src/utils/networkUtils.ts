import NetInfo from '@react-native-community/netinfo';

export const checkInternetConnection = async (): Promise<boolean> => {
  try {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected ?? false;
  } catch (error) {
    console.error('Erro ao verificar conexão:', error);
    return false;
  }
};

export const handleApiError = (error: any) => {
  if (!error.response) {
    // Erro de rede ou sem conexão
    return {
      success: false,
      message: 'Erro de conexão. Verifique sua internet.',
      useLocalDB: true
    };
  }
  
  return {
    success: false,
    message: error.response.data.error || 'Erro ao processar requisição',
    useLocalDB: false
  };
}; 