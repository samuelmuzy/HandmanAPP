import { NavigationContainer } from "@react-navigation/native";
import { AuthStackNavigation} from "./AuthStackNavigation";
import { useContext } from "react";
import { AuthContext, useAuth } from "../context/AuthContext";
import { TabNavigation } from "./TabNavigation";

export const RootNavigation = () =>{
    const { isAuthenticated } = useAuth();
    console.log('isAuthenticated:', isAuthenticated);
    return(
        <NavigationContainer>
            {isAuthenticated ? <TabNavigation /> : <AuthStackNavigation />}
        </NavigationContainer>
    )
}