import React from 'react'
import ErrorReport from "../../controllers/ErrorReport";
import {CRITICAL_ERROR} from "../../static/constants";

export default class ErrorBoundary extends React.Component {

    constructor(props) {

        super(props);

        this.state = {hasError: false};

    }

    static getDerivedStateFromError(error) {
        // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
        localStorage.setItem(CRITICAL_ERROR, error.toString())
        ErrorReport.sendError(error).catch(console.error)

        return {hasError: true};

    }

    componentDidCatch(error, errorInfo) {
        // Можно также сохранить информацию об ошибке в соответствующую службу журнала ошибок
        console.log('boundary catch')
    }

    render() {
        if (this.state.hasError) {
            this.state.hasError = false
            window.location.href = '/error/'
        }

        return this.props.children;
    }
}