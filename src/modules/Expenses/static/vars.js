
export const filterType = ['personal', 'common', 'all']

export const local = {
    'personal': 'Личные',
    'common': 'Общие',
    'all': "Все"
}

export const EXPENSES_FILTER = 'EXPENSES_FILTER'
/**
 * @returns {ExpenseFilterType}
 */
export const defaultFilterValue = () => localStorage.getItem(EXPENSES_FILTER) || 'all'
