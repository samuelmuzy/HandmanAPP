import { useEffect, useRef, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

Notifications.setNotificationHandler({
    handleNotification: async (): Promise<any> => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  

export const useNotifications = (userId: string | undefined) => {
    const [expoPushToken, setExpoPushToken] = useState<string>('');
    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const responseListener = useRef<Notifications.EventSubscription | null>(null);


    async function registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
                sound: 'default'
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            console.log('Status atual das permissões:', existingStatus);

            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
                console.log('Novo status das permissões:', status);
            }

            if (finalStatus !== 'granted') {
                console.log('Falha ao obter token para notificação push!');
                return;
            }

            try {
                token = (await Notifications.getExpoPushTokenAsync({
                    projectId: 'snack-8f8e781c-db99-4f20-881a-5b19ef3f4fcf'
                })).data;
                console.log('Token obtido com sucesso:', token);
            } catch (error) {
                console.error('Erro ao obter token:', error);
            }
        } else {
            console.log('É necessário um dispositivo físico para Push Notifications');
        }

        return token;
    }

    async function savePushToken(token: string) {
        try {
            console.log('Salvando token:', token);
            await axios.post(`${API_URL}/fornecedor/push-token`, {
                userId,
                pushToken: token
            });
            console.log('Token salvo com sucesso no backend');
        } catch (error) {
            console.error('Erro ao salvar token de notificação:', error);
        }
    }

    useEffect(() => {
        if (!userId) {
            console.log('userId não disponível ainda');
            return;
        }

        console.log('Iniciando registro de notificações para userId:', userId);

        registerForPushNotificationsAsync().then(token => {
            if (token) {
                console.log('Token registrado:', token);
                setExpoPushToken(token);
                savePushToken(token);
            }
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notificação recebida:', notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Resposta à notificação:', response);
        });

        return () => {
            console.log('Limpando listeners de notificação');
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, [userId]);

    return { expoPushToken };
}; 