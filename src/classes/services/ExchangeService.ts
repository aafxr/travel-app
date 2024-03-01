import {Expense} from "../StoreEntities";
import {DB} from "../db/DB";
import {StoreName} from "../../types/StoreName";
import {ExchangeType} from "../../contexts/ExchangeContext";
import {CurrencyType} from "../../contexts/ExchangeContext";
import {fetchExchangeCourse} from "../../api/fetch/fetchExchangeCource";

export class ExchangeService {

    //инициализация курса валют для списка расходов
    static async initExpensesExchange(expenses: Expense[], _retry = false): Promise<{
        [key: string]: CurrencyType[]
    }> {
        const min_date = expenses.reduce<Date>((a, e) => a < e.created_at ? a : e.created_at, new Date()).getTime()
        const max_date = expenses.reduce<Date>((a, e) => a > e.created_at ? a : e.created_at, new Date(0)).getTime()
        const exchande_type = await DB.getMany<ExchangeType>(StoreName.CURRENCY, IDBKeyRange.bound(min_date, max_date))
        const exchange = exchande_type.reduce<{ [key: string]: CurrencyType[] }>((a, e) => {
            const key = new Date(e.date).toLocaleDateString()
            a[key] = e.value
            return a
        }, {})


        if (!_retry && !expenses.some(e => !exchange[e.created_at.toLocaleDateString()]))
            return exchange
        else if (_retry) {
            for (const e of expenses) {
                if (exchange[e.created_at.toLocaleDateString()]) {
                    const closestCourse = (await DB.getClosest<ExchangeType>(StoreName.CURRENCY, IDBKeyRange.upperBound(e.created_at.getTime())))[0]
                    const key = new Date(closestCourse.date).toLocaleDateString()
                    exchange[key] = closestCourse.value
                }
            }
            return exchange
        }


        const response = await fetchExchangeCourse(new Date(min_date), new Date(max_date))
        for await (const [time, value] of Object.entries(response)) {
            const [ dd,mm,yy] = time.split('.')
            const _time = new Date([mm,dd,yy].join('.'))
            const item: ExchangeType = {
                date: new Date(_time).getTime(),
                value: value
            }
            await DB.update(StoreName.CURRENCY, item)
        }
        return await ExchangeService.initExpensesExchange(expenses, true)
    }


    static async getExchangeCourse(from:Date, to: Date){
        const course = await DB.getMany<ExchangeType>(StoreName.CURRENCY, IDBKeyRange.bound(from.getTime(), to.getTime()))
        const result: {[key: string]: ExchangeType['value']} = {}

        for (const c of course){
            const key = new Date(c.date).toLocaleDateString()
            result[key] = c.value
        }
        return result
    }
}