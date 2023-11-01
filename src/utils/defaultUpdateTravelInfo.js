/**
 * @function
 * @name defaultUpdateTravelInfo
 * @param {string} primary_entity_id
 * @returns {UpdateTravelInfoType}
 * @category Utils
 */
export default function defaultUpdateTravelInfo(primary_entity_id) {
    if (typeof primary_entity_id !== 'string' && !primary_entity_id.length)
        throw new Error('primary_entity_id should be defined and not empty string')

    return {
        primary_entity_id: primary_entity_id,
        actual_list: [],
        actual_expenses_total: 0,
        planned_list: [],
        planned_expenses_total: 0,
        updated_at: Date.now(),
    }
}