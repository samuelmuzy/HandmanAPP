import React, { useEffect, useState } from "react"
import { typeFornecedor } from "../model/Fornecedor"
import { FornecedorView } from "../views/FornecedorView";
import { FornecedorService } from "../services/FornecedoresService";
import { UserService } from "../services/UserService";
import { useGetToken } from "../hooks/useGetToken";
import { User } from "../model/User";

export const FornecedorController = () => {
    const [fornecedoresPorCategoria, setFornecedoresPorCategoria] = useState<typeFornecedor[] | undefined>([]);
    const [fornecedoresMelhoresPreco, setFornecedoresMelhoresPreco] = useState<typeFornecedor[] | undefined>([]);
    const [fornecedoresMelhoresAvaliados, setFornecedoresMelhoresAvaliados] = useState<typeFornecedor[] | undefined>([]);
    const [usuario, setUsuario] = useState<User | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    const [categoria, setCategoria] = useState('Controle');

    const token = useGetToken();

    const userId = token?.id;

    const handleGetFornecedores = async (categoria: string, ordenarPor?: 'avaliacao' | 'preco', ordem?: 'asc' | 'desc') => {
        const fornecedores = await FornecedorService.getFornecedoresPorCategoria(categoria, ordenarPor, ordem);
        return fornecedores || [];
    }

    const handleGetUser = async () => {
        setLoading(true);
        try {
            if (!userId) {
                console.log('Aguardando token...');
                return;
            }
            const user = await UserService.getUsers(userId);
            setUsuario(user);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchFornecedores = async () => {
        setLoading(true);
        try {
            // Busca por categoria
            const porCategoria = await handleGetFornecedores(categoria);
            setFornecedoresPorCategoria(porCategoria);

            // Busca por melhores preços (ordem ascendente de preço)
            const melhoresPreco = await handleGetFornecedores(categoria, 'preco', 'asc');
            setFornecedoresMelhoresPreco(melhoresPreco);

            // Busca por melhores avaliados (ordem descendente de avaliação)
            const melhoresAvaliados = await handleGetFornecedores(categoria, 'avaliacao', 'desc');
            setFornecedoresMelhoresAvaliados(melhoresAvaliados);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFornecedores();
    }, [categoria])

    useEffect(() => {
        if (userId) {
            handleGetUser();
        }
    }, [userId])

    return (
        <>
            <FornecedorView
                usuario={usuario}
                fornecedoresPorCategoria={fornecedoresPorCategoria}
                fornecedoresMelhoresPreco={fornecedoresMelhoresPreco}
                fornecedoresMelhoresAvaliados={fornecedoresMelhoresAvaliados}
                setCategoria={setCategoria}
                loading={loading}
            />
        </>
    )
}