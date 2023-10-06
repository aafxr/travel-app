/**
 * возвращает массив элементов сгруппированных по секции
 * @param {Array.<import('../../../types/SectionType').SectionType>} sections
 * @param {Array.<import('../../../types/LimitType').LimitType>} limits
 * @param {Array.<import('../../../types/ExpenseType').ExpenseType>} expenses
 * @return {*[]}
 */
export default function getReportObj(sections, limits, expenses) {
    const result = []

    sections.forEach(sec => {
        let limit = limits.find(l => l.section_id === sec.id) || 0
        limit && (limit = limit.value)
        const exp = expenses.filter(e => e.section_id === sec.id)
        result.push({
            id: sec.id,
            name: sec.title,
            expLimit: limit,
            expenses: exp
        })
    })

    return result
}