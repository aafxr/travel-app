import aFetch from "../axios";


/**
 * Клас со статическими методами для обращения к api
 * @class
 * @name RestAPI
 * @category Classes
 */
export default class RestAPI{
    /**
     * метод делает запрос к api и возвращает список SectionType
     * @static
     * @name RestAPI.fetchSections
     * @returns {Promise<SectionType[]>}
     */
    static async fetchSections() {
        /**@type {axios.AxiosResponse<APIResponseType<SectionType[]>>}*/
        const response = await aFetch.get('/expenses/getSections/')
        const {ok, data} = response.data
        if(ok){
            return data
        }
        return []
    }
}