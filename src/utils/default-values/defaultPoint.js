import createId from "../createId";

/**
 * Функция возвращает PointType с дефолтными полями
 * @function
 * @name defaultPoint
 * @param {string} primary_entity_id
 * @param {Partial<PointType>} options
 * @returns {PointType}
 */
export default function defaultPoint(primary_entity_id, options= {}){
    return {
        id: createId(primary_entity_id),
        kind: options.kind          || '',
        address: options.address    || '',
        coords: options.coords      || [],
        locality: options.locality  || ''
    }
}