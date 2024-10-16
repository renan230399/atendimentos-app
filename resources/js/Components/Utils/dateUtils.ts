import { formatWithOptions } from 'date-fns/fp';
import { ptBR } from 'date-fns/locale';
import { differenceInYears } from 'date-fns';

const formatWithLocale = formatWithOptions({ locale: ptBR });

export const formatDateAndAge = (dateString: string): string => {
    const date = new Date(dateString); // Converte a string para um objeto Date
    const formattedDate = formatWithLocale('dd/MM/yyyy', date); // Formata a data no padrão brasileiro
    const age = differenceInYears(new Date(), date); // Calcula a idade
    return `${formattedDate} (${age} anos)`; // Retorna a data formatada e a idade
};
