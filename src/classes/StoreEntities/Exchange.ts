import {CurrencyName, CurrencyType} from "../../types/CurrencyTypes";
import {ExchangeType} from "../../types/ExchangeType";
import {StoreName} from "../../types/StoreName";
import {StoreEntity} from "./StoreEntity";
import {DB} from "../db/DB";

type ExchangePropsType = string | Date | ExchangeType | undefined

enum ExchangeStatus {
    pure,
    loading,
    done
}


/**
 * представление записи курса валют в бд
 */
export class Exchange extends StoreEntity implements ExchangeType {
    storeName = StoreName.CURRENCY

    date: number = 0;
    value: CurrencyType<any>[] = [];
    status: ExchangeStatus = ExchangeStatus.pure


    constructor(date?: ExchangePropsType) {
        super();

        if (!date) return

        let time: Date | undefined
        if (typeof date === 'string') time = new Date(date)
        else if (date instanceof Date) time = new Date(date)
        else if (date && typeof date === 'object') {
            this.date = date.date
            this.value = date.value
            return
        }

        if (time) {
            time.setHours(0, 0, 0, 0)
            this.loadExchange(time)
        }

    }


    private loadExchange(date: Date) {
        this.status = ExchangeStatus.loading
        DB.getClosest<ExchangeType>(StoreName.CURRENCY, IDBKeyRange.upperBound(date.getTime()))
            .then(ex => {
                if (ex.length) this.setExchangeData(ex[0])
            })
    }

    setExchangeData(ex: ExchangeType) {
        this.date = ex.date
        this.value = ex.value
        this.status = ExchangeStatus.done
        this.emit('update', [this])
    }

    getCoefficient(key: keyof CurrencyName) {
        const c = this.value.find(c => c.char_code === key)
        if (c) return c.value
        return 1
    }


    // @ts-ignore
    dto(): ExchangeType {
        return {
            date: this.date,
            value: this.value,
        };
    }


}
