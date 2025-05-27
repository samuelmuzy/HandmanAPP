import { Image, ListRenderItemInfo, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { CardFornecedor } from "../components/CardFornecedor"
import { typeFornecedor } from "../model/Fornecedor";
import { FlatList } from "react-native";
import { BannerCarousel } from "../components/PromoCard";
import { HeaderUsuario } from "../components/HeaderUsuario";
import { User } from "../model/User";
import { SearchBar } from "../components/SearchBar";
import { CategoryButtons } from "../components/CategoryButtons";

interface FornecedorViewProps {
    usuario:User | undefined,
    fornecedor: typeFornecedor[] | undefined,
    onNavigateExibirFornecedor: (screen: string) => void;
    setCategoria: React.Dispatch<React.SetStateAction<string>>
}

export const FornecedorView = ({usuario, fornecedor,setCategoria }: FornecedorViewProps) => {

    const renderFornecedor = ({ item }: ListRenderItemInfo<typeFornecedor>) => {
        return (
            <CardFornecedor
                fornecedor={item}
            />
        )
    }

    // Lista de categorias de exemplo (você pode buscar isso de uma API ou estado)
    const categorias = ['Encanamento', 'Mudança', 'Carpintaria', 'Elétricista', 'Jardinagem', 'Limpeza'];

    return (
        <ScrollView style={styles.container}>
           <HeaderUsuario imagem={{uri: usuario?.picture}} name={usuario?.nome}/>
            <SearchBar/>
            <BannerCarousel/>
            <CategoryButtons 
                categories={categorias} 
                onSelectCategory={(categoria) => {
                    setCategoria(categoria)
                }}
            />
            
            <Text style={styles.title}>Melhores preços</Text>
            <FlatList
                data={fornecedor}
                renderItem={renderFornecedor}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            />
            <Text style={styles.title}>Melhores Profissionais</Text>
            <FlatList
                data={fornecedor}
                renderItem={renderFornecedor}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            />
            <FlatList
                data={fornecedor}
                renderItem={renderFornecedor}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            />
        </ScrollView>
        
    )
}


const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        alignSelf: 'flex-start',
        width: '100%'
    },
    title:{
        margin:20,
        fontSize: 18,
        color:'#A75C00'
    },
    contentContainer: {
        paddingHorizontal: 10,
        marginBottom:10
    }
}); 