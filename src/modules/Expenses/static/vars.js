
export const filterType = ['Personal', 'Common', 'All']

export const local = {
    'Personal': 'Личные',
    'Common': 'Общие',
    'All': "Все"
}

export const EXPENSES_FILTER = 'EXPENSES_FILTER'
/**
 * @returns {ExpenseFilterType}
 */
export const defaultFilterValue = () => localStorage.getItem(EXPENSES_FILTER) || 'All'
