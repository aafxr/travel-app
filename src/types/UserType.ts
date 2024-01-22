/** Тип, описывающий данные пользователя */
export interface UserType{
    id: string,
    first_name: string,
    last_name: string,
    username: string,
    photo: string,
    token: string,
    refresh_token: string,
}