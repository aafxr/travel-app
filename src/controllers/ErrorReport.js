import {CRITICAL_ERROR} from '../static/constants'
import aFetch from "../axios";

class ErrorReport {
    constructor() {
        this.isProd = process.env.NODE_ENV === 'production'

        const sendReport = this.sendReport.bind(this)
        global.addEventListener('keydown', function (e) {
            const {key, altKey, ctrlKey, shiftKey} = e

            if (ctrlKey && altKey && shiftKey && key === 'F10') {
                const isConfirm = window.confirm("Отправить отчет о последней ошибке?")
                isConfirm && sendReport()
            }
        })
    }

    async sendError(error) {
        if (this.isProd) {
            const  extraInfo = this.getExtraInfo()
            await aFetch.post('/log/addEvent/',{
                    error: {
                        message: error.message,
                        stack: error.stack
                    },
                    ...extraInfo
                }
            ).catch(console.error)
        }
    }



    async sendReport() {
        if (this.isProd) {
            const error = localStorage.getItem(CRITICAL_ERROR) || null

            if (error) {
            const  extraInfo = this.getExtraInfo()
                await aFetch.post('/log/addReport/', {
                        error: {
                            message: error.message,
                            stack: error.stack
                        },
                        ...extraInfo
                    }
                ).catch(console.error)

                localStorage.setItem(CRITICAL_ERROR, JSON.stringify(null))
            }
        }
    }


    getExtraInfo(){
        const userAgent = navigator.userAgent

        return {
            userAgent
        }
    }
}


const errorReport = new ErrorReport()

export default errorReport
