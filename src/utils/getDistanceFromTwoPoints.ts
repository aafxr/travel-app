import {CoordinatesType} from "../types/CoordinatesType";

/**
 * возвращает растояние поп прямой в метрах __(м)__
 * @function
 * @name getDistanceFromTwoPoints
 * @param {CoordinatesType} point_1
 * @param {CoordinatesType} point_2
 * @returns {number}
 */
export default function getDistanceFromTwoPoints(point_1: CoordinatesType, point_2: CoordinatesType) {
    if(!point_1 || !point_2) return 0
    const R = 6371;

    const [lat1, lon1] = point_1
    const [lat2, lon2] = point_2

    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1);
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function deg2rad(deg: number) {
    return deg * (Math.PI/180)
}