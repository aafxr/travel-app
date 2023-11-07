/**
 * @template T
 * @param {Array<T>} arr
 * @param {(a: T, b: T)  => boolean} comparator
 * @returns {Array<T>}
 */
export default function quickSort(arr, comparator){
    if (arr.length < 2) return arr;
    /**@type{T}*/
    let pivot = arr[0];
    /**@type{T[]}*/
    const left = [];
    /**@type{T[]}*/
    const right = [];

    for (let i = 1; i < arr.length; i++) {
        if (pivot > arr[i]) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left, comparator).concat(pivot, quickSort(right, comparator));
}
