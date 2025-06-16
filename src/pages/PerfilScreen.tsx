import React from 'react';
import { useGetToken } from '../hooks/useGetToken';
import PerfilUsuario from '../components/perfil/perfilUsuario';
import { PerfilFornecedor } from '../components/perfil/PerfilFornecedor';



const PerfilScreen = () => {

  const token = useGetToken();
 
  return (
    token?.role === 'Fornecedor' ? (
      <PerfilFornecedor />
    ) : (
      <PerfilUsuario />
    )
  );
};

export default PerfilScreen;

