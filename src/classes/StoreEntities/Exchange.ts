import {StoreEntity} from "./StoreEntity";
import {ExchangeType} from "../../types/ExchangeType";
import {CurrencyType} from "../../types/CurrencyTypes";
import {DB} from "../db/DB";
import {StoreName} from "../../types/StoreName";
import {Context} from "../Context/Context";

type ExchangePropsType = string | Date | undefined

enum ExchangeStatus{
    pure,
    loading,
    done
}

export class Exchange extends StoreEntity implements ExchangeType{
    date: number = 0;
    value: CurrencyType<any>[] = [];
    status: ExchangeStatus = ExchangeStatus.pure

    ctx: Context


    constructor(ctx: Context, date : ExchangePropsType) {
        super();

        this.ctx = ctx

        if(!date) return

        let time: Date
        if( typeof date === 'string') time = new Date(date)
        else time = new Date(date)

        time.setHours(0,0,0,0)
        this.loadExchange(time)

    }


    private loadExchange(date:Date){
        this.status = ExchangeStatus.loading
        DB.getClosest<ExchangeType>(StoreName.CURRENCY, IDBKeyRange.upperBound(date.getTime()))
            .then(ex => {
                if(ex.length) this.setExchangeData(ex[0])
            })
    }

    setExchangeData(ex:ExchangeType){
        this.date = ex.date
        this.value = ex.value
        this.status = ExchangeStatus.done
        this.emit('update')
    }



    // @ts-ignore
    dto(): ExchangeType {
        return {
            date:this.date,
            value: this.value,
        };
    }


}