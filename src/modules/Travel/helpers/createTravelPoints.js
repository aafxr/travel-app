import createId from "../../../utils/createId";

export default function createTravelPoints(primary_entity_id, points){
    return {
        id: createId(),
        primary_entity_id,
        points
    }
}