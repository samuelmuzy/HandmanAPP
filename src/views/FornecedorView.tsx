import { Image, ListRenderItemInfo, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { CardFornecedor } from "../components/CardFornecedor"
import { typeFornecedor } from "../model/Fornecedor";
import { FlatList } from "react-native";
import { BannerCarousel } from "../components/PromoCard";
import { HeaderUsuario } from "../components/HeaderUsuario";
import { User } from "../model/User";
import { SearchBar } from "../components/SearchBar";
import { CategoryButtons } from "../components/CategoryButtons";
import { useState, useEffect } from "react";

interface FornecedorViewProps {
    usuario: User | undefined,
    fornecedoresPorCategoria: typeFornecedor[] | undefined,
    fornecedoresMelhoresPreco: typeFornecedor[] | undefined,
    fornecedoresMelhoresAvaliados: typeFornecedor[] | undefined,
    onNavigateExibirFornecedor: (screen: string) => void;
    setCategoria: React.Dispatch<React.SetStateAction<string>>
}

export const FornecedorView = ({usuario, fornecedoresPorCategoria, fornecedoresMelhoresPreco, fornecedoresMelhoresAvaliados, setCategoria }: FornecedorViewProps) => {
    const [searchText, setSearchText] = useState('');
    const [filteredFornecedores, setFilteredFornecedores] = useState<typeFornecedor[] | undefined>(fornecedoresPorCategoria);

    useEffect(() => {
        if (!searchText.trim()) {
            // Se a busca estiver vazia, mostre a lista por categoria completa
            setFilteredFornecedores(fornecedoresPorCategoria);
            return;
        }

        // Filtra a lista por categoria baseada no texto de busca
        const filtered = fornecedoresPorCategoria?.filter(prof => {
            const searchLower = searchText.toLowerCase();
            return (
                prof.nome?.toLowerCase().includes(searchLower) ||
                prof.categoria_servico?.some(cat => 
                    cat.toLowerCase().includes(searchLower)
                ) ||
                prof.sub_descricao?.toLowerCase().includes(searchLower)
            );
        });

        setFilteredFornecedores(filtered);
    }, [searchText, fornecedoresPorCategoria]);

    const handleSearch = (text: string) => {
        setSearchText(text);
    };

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
            <SearchBar onSearch={handleSearch}/>
            <BannerCarousel/>
            <CategoryButtons 
                categories={categorias} 
                onSelectCategory={(categoria) => {
                    setCategoria(categoria)
                }}
            />
            
            <Text style={styles.title}>Fornecedores por Categoria</Text>
            <FlatList
                data={filteredFornecedores} // Use a lista filtrada aqui
                renderItem={renderFornecedor}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            />

            <Text style={styles.title}>Melhores preços</Text>
            <FlatList
                data={fornecedoresMelhoresPreco}
                renderItem={renderFornecedor}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            />
            
            <Text style={styles.title}>Melhores Profissionais</Text>
            <FlatList
                data={fornecedoresMelhoresAvaliados}
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