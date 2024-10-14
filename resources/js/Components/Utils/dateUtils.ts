import { format, parseISO, differenceInYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Função para formatar data e calcular a idade
export const formatDateAndAge = (dateString: string): string => {
    const date = parseISO(dateString); // Converte a string ISO para um objeto Date
    const formattedDate = format(date, 'dd/MM/yyyy', { locale: ptBR }); // Formata a data no padrão brasileiro
    const age = differenceInYears(new Date(), date); // Calcula a idade
    return `${formattedDate} (${age} anos)`; // Retorna a data formatada e a idade
};
