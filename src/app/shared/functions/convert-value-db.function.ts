import { padLeft } from "./pad-left.function";

/**
 * Converte o valor para o formato aceito pelo banco de dados
 * formata para 9 digitos com 2 casas decimais
 * exe: 0000000.00
 * @param value valor a ser convertido
 * @returns valor convertido
 */
const convertToValueDB = (value: string | number): number => {
    // remove as virgulas e pontos
    value = +(value.toString().replace('.','').replace(',', ''));
    return +padLeft(value.toString(),9,'0').replace(/(\d{7})(\d{2})/g,"\$1.\$2");
}

export default convertToValueDB;