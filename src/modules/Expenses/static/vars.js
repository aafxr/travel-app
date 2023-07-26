import constants from "../db/constants";

export const filterType = ['personal', 'common', 'all']

export const local = {
    'personal': 'Личные',
    'common': 'Общие',
    'all': "Все"
}

export const EXPENSES_FILTER = 'EXPENSES_FILTER'
export const defaultFilterValue = () => localStorage.getItem(EXPENSES_FILTER) || 'all'

export const actionsBlackList = [constants.store.SECTION, constants.store.LIMIT]
export const actionsWhiteList = [constants.store.EXPENSES_ACTUAL, constants.store.EXPENSES_PLAN]

