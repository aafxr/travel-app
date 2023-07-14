export const CRITICAL_ERROR = 'critical_error'



class ErrorReport {
    constructor() {
        this.isProd = process.env.NODE_ENV === 'production'

        const sendReport = this.sendReport.bind(this)
        window.addEventListener('keydown', function (e) {
            const {key, altKey, ctrlKey, shiftKey} = e

            if (ctrlKey && altKey && shiftKey && key === 'F10') {
                const isConfirm = window.confirm("Отправить отчет о последней ошибке?")
                isConfirm && sendReport()
            }
        })
    }

    async sendError(error) {
        if (this.isProd) {
            await fetch(process.env.REACT_APP_SERVER_URL + '/log/addEvent/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                body: JSON.stringify(error)
            }).catch(console.error)
        }
    }



    async sendReport() {
        if (this.isProd) {
            const error = localStorage.getItem(CRITICAL_ERROR) || null

            if (error) {
                await fetch(process.env.REACT_APP_SERVER_URL + '/log/addReport/', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    },
                    body: JSON.stringify(error)
                }).catch(console.error)

                localStorage.setItem(CRITICAL_ERROR, JSON.stringify(null))
            }
        }
    }
}


export default new ErrorReport()
