import {Expense} from "../StoreEntities";
import {DB} from "../db/DB";
import {StoreName} from "../../types/StoreName";
import {ExchangeType} from "../../types/ExchangeType";
import {CurrencyType} from "../../types/CurrencyTypes";
import {fetchExchangeCourse} from "../../api/fetch/fetchExchangeCource";

export class ExchangeService {

    //инициализация курса валют для списка расходов
    static async initExpensesExchange(expenses: Expense[], _retry = false): Promise<{
        [key: string]: CurrencyType<any>[]
    }> {
        const min_date = Math.min(...expenses.map(e => e.created_at.getTime()))
        const max_date = Math.max(...expenses.map(e => e.created_at.getTime()))
        const exchande_type = await DB.getClosest<ExchangeType>(StoreName.CURRENCY, IDBKeyRange.bound(min_date, max_date), Number.MAX_SAFE_INTEGER)
        const exchange = exchande_type.reduce<{ [key: string]: CurrencyType<any>[] }>((a, e) => {
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



        const response = await fetchExchangeCourse(min_date, max_date)
        for await (const [time, value] of Object.entries(response)) {
            const item: ExchangeType = {
                date: new Date(time).getTime() || -1,
                value
            }
            await DB.update(StoreName.CURRENCY, item)
        }
        return await ExchangeService.initExpensesExchange(expenses, true)
    }
}