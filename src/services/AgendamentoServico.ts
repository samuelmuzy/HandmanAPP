import axios from "axios";
import { Agendamento, HistoricoAgendamento } from "../model/Agendamento";
import { API_URL } from "../constants/ApiUrl";

export const AgendamentoService = {
    async AgendarServico(agendamento:Agendamento){
        try{
            const response = await axios.post(`${API_URL}/servicos`,agendamento);
            console.log(response);
        }catch(error:unknown){
            console.log(error);
        }
    },

    async getAgendamentos(id_usuario:string | undefined):Promise<HistoricoAgendamento[] | undefined>{
        try{
            const response = await axios.get(`${API_URL}/usuarios/historico/${id_usuario}`)
            return response.data;
        }catch(error){  
            console.log(error);
        }
    }
}