export const filterType = ['personal', 'common', 'all']

export const local = {
    'personal': 'Личные',
    'common': 'Общие',
    'all': "Все"
}

export const EXPENSES_FILTER = 'EXPENSES_FILTER'
export const defaultFilterValue = () => localStorage.getItem(EXPENSES_FILTER) || 'all'

export const currency = [
    {
        code: 'RUB',
        symbol: '₽',
        link: '',
    },
    {
        code: 'KZT',
        symbol: '₸',
        link: '',
    },
    {
        code: 'USD',
        symbol: '$',
        link: '',
    },
    {
        code: 'EUR',
        symbol: '€',
        link: '',
    },
    {
        code: 'CNY',
        symbol: '¥',
        link: '',
    },
    {
        code: 'AED',
        symbol: 'Dh',
        link: '',
    },
]
