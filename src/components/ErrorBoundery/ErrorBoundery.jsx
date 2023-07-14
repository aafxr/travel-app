import React from 'react'
import {CRITICAL_ERROR} from "../../controllers/ErrorReport";

export default class ErrorBoundary extends React.Component {

    constructor(props) {

        super(props);

        this.state = { hasError: false };

    }

    static getDerivedStateFromError(error) {
        // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
        localStorage.setItem(CRITICAL_ERROR, JSON.stringify(error))

        return { hasError: true };

    }

    componentDidCatch(error, errorInfo) {

        // Можно также сохранить информацию об ошибке в соответствующую службу журнала ошибок
        console.log('boundary catch')
        console.log(error)
        console.log(errorInfo)
        // logErrorToMyService(error, errorInfo);

    }

    render() {

        if (this.state.hasError) {

            // Можно отрендерить запасной UI произвольного вида
                window.location.href = '/'
            return <h1>Что-то пошло не так.</h1>;

        }

        return this.props.children;

    }
}