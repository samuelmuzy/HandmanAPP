import { View, Text, StyleSheet, Image, Button, Dimensions } from "react-native";
import { typeFornecedor } from "../model/Fornecedor"
import { Star } from 'lucide-react-native';

interface CardFornecedorProps{
    fornecedor:typeFornecedor,
    onNavigateExibirFornecedor: (screen: string) => void;
}

const windowWidth = Dimensions.get('window').width;

export const CardFornecedor = ({fornecedor,onNavigateExibirFornecedor}:CardFornecedorProps) =>{
    return(
        <View style={styles.container}>
            <Image 
                source={{ uri: fornecedor.imagemIlustrativa }}
                style={styles.image}
            />
            <View style={styles.contentContainer}>
                <View style={styles.infoContainer}>
                    <Text style={styles.nome}>{fornecedor.nome}</Text>
                    <Text style={styles.email}>{fornecedor.sub_descricao}</Text>
                    <View style={styles.ratingAndValueContainer}>
                        <View style={styles.ratingContainer}>
                            <Star size={16} color="#444" fill="#444"/>
                            <Text style={styles.avaliacao}>{fornecedor.media_avaliacoes}</Text>
                        </View>
                        <Text style={styles.valor}>{"R$ " + fornecedor.valor}</Text>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Button color={'#AC5906'}  title="Contratar" onPress={() => onNavigateExibirFornecedor('DetalhesFornecedor')}/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 2,
        width: windowWidth * 0.8,
        height: 400,
        borderWidth:0.5,
        borderColor:'#AC5906'
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 13,
        marginBottom: 15,
        fontWeight: '500',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    infoContainer: {
        flex: 1,
        gap: 8,
    },
    ratingAndValueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    buttonContainer: {
        marginTop: 15,
        borderRadius: 25,
        overflow: 'hidden',
    },
    nome: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    avaliacao: {
        fontSize: 16,
        color: '#444',
        fontWeight: '500',
    },
    valor: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
    }
})
