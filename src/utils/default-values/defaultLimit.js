import createId from "../createId";

/**
 * Утилита возвращает лимит с дефотными полями
 * @function
 * @name defaultLimit
 * @param {string} primary_entity_id id путешествия
 * @param {string} section_id id секции, для которой установлен лимит
 * @param {number} value значение лимита
 * @param {string} [user_id] id пользователя для которого установлен лимит
 * @returns{LimitType}
 * @category Utils
 */
export default function defaultLimit(primary_entity_id, section_id, value, user_id) {
    if (!primary_entity_id) throw new Error("Prop primary_entity_id is required")

    return {
        id: user_id ? createId(user_id) : createId(),
        value: value > 0 ? value : 0,
        section_id: section_id,
        personal: user_id ? 1 : 0,
        primary_entity_id
    }
}
