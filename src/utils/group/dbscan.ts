interface GetCoordsCB<T> {
    (data: T): [number, number]
}

interface DistanceFn {
    (a: [number, number], b: [number, number]): number
}

const NOISE = -2

type DBSCAN_Point = {
    point: [number, number],
    cluster: number
}

type GroupType = {
    [key: string]: DBSCAN_Point[]
}


function squareDistans(p1: [number, number], p2: [number, number]) {
    return Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2);
}


/**
 * метод объеденяет точки в группы основываясь на парамеирах плотности
 * @param data массив точек
 * @param eps отклонение (максимальное растояние)
 * @param min_points минимальное число точек
 * @param getCoords колбэк, извлекает координаты из переданного элемента массива
 * @param getDist метод для расчета дистанции
 */
export function dbscan<T>(data: T[], eps: number, min_points: number, getCoords: GetCoordsCB<T>, getDist = squareDistans) {
    const dataMap = new Map<DBSCAN_Point, T>
    for (const elem of data) {
        dataMap.set({point: getCoords(elem), cluster: -1}, elem)
    }

    const points = Array.from(dataMap.keys())


    let c = 0; //метка кластера
    for (const point of points) {
        if (point.cluster === NOISE) continue;

        // список всех соседей к данной точки
        const neighbors = rangeQuery(points, point, eps, getDist);
        if (neighbors.length < min_points) {
            point.cluster = NOISE;
            continue;
        }

        // если точка удовлетворяет условиям min_points, помечаем ее меткой кластера
        // и далее проверяем ее соседей по той жже схеме
        c += 1;
        point.cluster = c;

        const seed = neighbors;
        let index = 0;
        let seed_point = seed[index];
        // проверка соседей точки
        while (seed_point) {
            if (seed_point.cluster !== undefined && seed_point.cluster !== NOISE) {
                seed_point.cluster = c;
                index++;
                seed_point = seed[index];
                continue;
            }

            seed_point.cluster = c;
            let neighbors_2 = rangeQuery(points, seed_point, eps, getDist);
            //если соседняя точка удовлетворяет условиям плотности
            //добавляем ее новых соседей в конец маассива seed
            if (neighbors_2.length >= min_points) {
                neighbors_2 = neighbors_2.filter((nb) => !seed.includes(nb));
                seed.push(...neighbors_2);
            }

            index++;
            seed_point = seed[index];
        }
    }


    const groups: GroupType = {}
    points.forEach((p) => {
        if (!groups[p.cluster]) groups[p.cluster] = []
        groups[p.cluster].push(p)
    })

    if (!groups[NOISE]) groups[NOISE] = [];

    Object.keys(groups).forEach((key) => {
        if (key !== NOISE.toString() && groups[key] && groups[key].length < min_points) {
            groups[NOISE].push(...groups[key]);
            groups[key].forEach((p) => (p.cluster = NOISE));
            delete groups[key];
        }
    });
    return Object.values(groups)
        .map(group => group.map(p => dataMap.get(p)!));
}

/**
 * поиск всех соседей точки, которые удовлетворяют условиям плотности
 * @returns {Array}
 */
function rangeQuery(points: DBSCAN_Point[], point: DBSCAN_Point, eps: number, getDist: DistanceFn) {
    const neighbors = [];
    const _eps = eps * eps;
    for (const p2 of points) {
        const dist = getDist(point.point, p2.point);
        if (dist && dist < _eps) neighbors.push(p2);
    }
    return neighbors;
}