/**
 * Данный предпологается использовать для хранения вычислений конкретного путешествия
 * @category Types
 * @name UpdateTravelInfoType
 * @typedef {Object} UpdateTravelInfoType
 * @property {string} primary_entity_id primary_entity_id путешествия
 * @property {number} actual_expenses_total сумма актуальных расходов путешествия с id primary_id
 * @property {number} planned_expenses_total сумма плановых расходов путешествия с id primary_id
 * @property {{common: TotalBySectionType, personal: TotalBySectionType}[]} actual_list поле представляет список актуальных расходов вида: "id секции расходов" - "сумма расходов для данной секции"
 * @property {{common: TotalBySectionType, personal: TotalBySectionType}[]} planned_list поле представляет список актуальных расходов вида: "id секции расходов" - "сумма расходов для данной секции"
 * @property {number} updated_at время последнего обновления данной записи в бд
 */