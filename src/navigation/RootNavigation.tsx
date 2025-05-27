import { NavigationContainer } from "@react-navigation/native";
import { AuthStackNavigation} from "./AuthStackNavigation";
import { useContext } from "react";
import { TabNavigation } from "./TabNavigation";
import { useAuth } from "../context/AuthContext";

export const RootNavigation = () =>{
    const { isAuthenticated } = useAuth();
    console.log('isAuthenticated:', isAuthenticated);
    return(
        <NavigationContainer>
            {isAuthenticated ? <TabNavigation /> : <AuthStackNavigation />}
        </NavigationContainer>
    )
}