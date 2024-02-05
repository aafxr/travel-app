export type APIResponseType<T> = {
    ok: false
    message:string
} |{
    ok:true
    data: T
}