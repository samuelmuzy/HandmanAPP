import { NavigationContainer } from "@react-navigation/native";
import { StackNavigation } from "./StackNavigation";
import { useContext } from "react";
import { AuthContext, useAuth } from "../context/AuthContext";
import { TabNavigation } from "./TabNavigation";

export const RootNavigation = () =>{
    const { isAuthenticated } = useAuth();
    console.log('isAuthenticated:', isAuthenticated);
    return(
        <NavigationContainer>
            {isAuthenticated ? <TabNavigation /> : <StackNavigation />}
        </NavigationContainer>
    )
}