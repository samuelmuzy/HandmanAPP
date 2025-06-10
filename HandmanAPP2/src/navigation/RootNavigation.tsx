import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackNavigation } from "./AuthStackNavigation";
import SplashScreen from '../pages/SplashScreen';
import { TabNavigation } from "./TabNavigation";


export type RootStackParamList = {
  Splash: undefined;
  AuthStack: undefined;
  AppStack: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigation = () =>{
    
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="AuthStack" component={AuthStackNavigation} />
                <Stack.Screen name="AppStack" component={TabNavigation} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}