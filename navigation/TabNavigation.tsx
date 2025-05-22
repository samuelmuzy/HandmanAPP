import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HandyManApp } from '../pages/HomeScrenn';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export type RootTabParamList = {
    Home: undefined;
    Serviços: undefined;
    Agenda: undefined;
    Perfil: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export const TabNavigation = () => {
    return (
        <Tab.Navigator 
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#EEB16C',
                    height: 60,
                    paddingBottom: 5,
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
                tabBarActiveTintColor: 'yellow',
                tabBarInactiveTintColor: 'white',
            }}
        >
            <Tab.Screen 
                name='Home' 
                component={HandyManApp}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Icon name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name='Serviços' 
                component={HandyManApp}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Icon name="tools" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name='Agenda' 
                component={HandyManApp}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Icon name="calendar" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen 
                name='Perfil' 
                component={HandyManApp}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Icon name="account" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}; 