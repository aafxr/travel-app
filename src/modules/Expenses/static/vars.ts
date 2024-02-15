import {ExpenseFilterType} from "../../../types/filtersTypes";
import {CurrencyName} from "../../../contexts/ExchangeContext/CurrencyTypes";

export const filterType: ExpenseFilterType[] = ['personal', 'common', 'all']

export const local:Record<ExpenseFilterType, string> = {
    'personal': 'Личные',
    'common': 'Общие',
    'all': "Все"
}

export const EXPENSES_FILTER = 'EXPENSES_FILTER'
export const defaultFilterValue = (): ExpenseFilterType => localStorage.getItem(EXPENSES_FILTER) as ExpenseFilterType | null || 'all'

export const currencySymbol: Map<string, keyof CurrencyName> = new Map([
    ['₽', 'RUB'],
    ['$', 'USD'],
    ['€', 'EUR'],
    ['د.إ', 'CNY'],
    ['₯', 'KZT'],

    ['RUB','₽' ],
    ['USD','$' ],
    ['EUR','€' ],
    ['CNY','د.إ' ],
    ['KZT','₯' ],
]) as Map<string, keyof CurrencyName>
