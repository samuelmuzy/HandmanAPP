import { View } from "lucide-react-native"
import { ActivityIndicatorBase, StyleSheet } from "react-native"


export const Loading = () => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicatorBase size="large" color="#AC5906" />
        </View>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});