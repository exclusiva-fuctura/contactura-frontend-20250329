import moment from "moment";

/**
 * Converte a data para o formato YYYY-MM-DD
 * @param date formato de entrada: YYYY-MM-DDTHH:mm:ss.SSSZ
 * @returns  formato de saída: YYYY-MM-DD
 */
const convertToDateDB = (date: string): string => {
  return moment(date).format('YYYY-MM-DD');
}

export default convertToDateDB;