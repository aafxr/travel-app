/**
 * @typedef SalesmanPointType
 * @property {CoordinatesType} location
 * @property {string} id
 */


/**
 * @function
 * @name salesmanAlgorithm
 * @param {SalesmanPointType[]} points
 * @param {(point_1: SalesmanPointType, point_2: SalesmanPointType) => number} cb колбэк, возвращает растояние между переданными точками
 * @category Utils
 */
export default function salesmanAlgorithm(points, cb) {
    const matrix = new Array(points.length)
        .fill(0)
        .map(() => new Array(points.length).fill(0))

    for (let y = 0; y < points.length; y++) {
        for (let x = 0; x < points.length; x++) {
            if(matrix[y][x]) continue
            if(x === y ){
                matrix[y][x] = Number.POSITIVE_INFINITY
                continue
            }
            matrix[y][x] = cb(points[y], points[x])
            matrix[x][y] = matrix[y][x]
        }
    }

    console.log(matrix)

    const dx = []
    const dy = []

    for (let y = 0; y < points.length; y++) {
        const d = []
        for (let x = 0; x < points.length; x++) {
            d.push(matrix[y][x])
        }
        dx.push(Math.min(...d))
    }

    for (let x = 0; x < points.length; x++) {
        const d = []
        for (let y = 0; y < points.length; y++) {
            d.push(matrix[y][x])
        }
        dy.push(Math.min(...d))
    }

    console.log(dx)
    console.log(dy)

    for (let y = 0; y < points.length; y++) {
        for (let x = 0; x < points.length; x++) {
            matrix[y][x] -= dy[x] - dx[y]
        }
    }

}