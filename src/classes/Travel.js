import BaseTravel from "./BaseTravel";
import ErrorReport from "../controllers/ErrorReport";
import createId from "../utils/createId";

// Продумать структуру менеджера для работы с сущностями отели, встречи, расходы и тд
// реалирзовать абстракцию менеджера
// добавить описание абстракции
// Реализовать получение "курсора" для работы с большим объемом данных в бд
// Добавить описание методов для работы с "курсором"

/**
 * класс для обработки логики приложения при редактировании путешествия
 * @class
 * @name Travel
 * @extends BaseTravel
 *
 *
 * @param {TravelType} item
 * @constructor
 */
export default class Travel extends BaseTravel{
    /**
     * @param {TravelType} item
     * @constructor
     */
    constructor(item) {
        super(item);
    }

    /**
     * Статический метод преднозначен для создания нового экземпляра BaseTravel
     * @static
     * @name Travel.newTravel
     * @param {string} owner id автора путешествия
     * @param {TravelType} [options] параметры, которые будут использованны в качестве значений по умолчанию (если переданны)
     * @returns {Travel | null}
     */
    static newTravel(owner, options){
        /**@type{Error} */
        let err
        if (typeof owner !== 'string') err = new Error('Owner should be defined')
        else if (options && typeof options !== 'object') err = new Error('Expect that param "options" typeof object')
        if(err) {
            console.error(err)
            ErrorReport.sendError(err).catch(console.error)
            return null
        }

        /**@type{TravelType} */
        const temp = {id: createId() }
        Object
            .keys(options)
            .forEach(key => {
                if(key in BaseTravel.initValue) temp[key] = options[key]
                else console.warn(`Key "${key}" is not exist in type "TravelType" or not define in BaseTravel.initValue`)
            })
        temp.owner_id = owner

        const travel =  new Travel(temp)
        travel
            .setNew(true)
            .setChange(true)

        return travel
    }

}