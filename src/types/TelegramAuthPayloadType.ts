/** данные полученные от telegram  при авторизации через виджет telegram-auth */
export interface TelegramAuthPayloadType{
    id: string
    first_name: string
    last_name: string
    auth_date: string
    hash: string
}