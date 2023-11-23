/**
 * возвращает рандомное целое число из диапазона заданного переменными start, end.
 * @function
 * @name randomNumber
 * @param {number} start
 * @param {number} end
 * @param {number[]} [exclude] числа которые не будут возвращены
 * @returns {number}
 */
export default function randomNumber(start, end, exclude = []){
    const range = end - start
    let result
    const MAX_ITERATIONS_COUNT = 100
    let itr = 0

    do {
        result = Math.floor(Math.random() * (start + range))
        itr +=1
    }while (exclude.includes(result) && itr < MAX_ITERATIONS_COUNT)

    return itr === MAX_ITERATIONS_COUNT ? end : result
}