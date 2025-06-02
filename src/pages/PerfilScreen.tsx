import React, { useEffect, useState } from 'react';
import { useGetToken } from '../hooks/useGetToken';
import PerfilUsuario from '../components/perfilUsuario';
import PerfilFornecedor from '../components/PerfilFornecedor';



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

