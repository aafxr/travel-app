import React from 'react'
import ErrorReport from "../../controllers/ErrorReport";
import {CRITICAL_ERROR} from "../../static/constants";
import errorToObject from "../../utils/errorToObject";
import ErrorPage from "../../modules/OtherPages/ErrorPage";

/**
 * Компонет оборачивает приложение и, в случае возникновения ошибки, отображает страницу об ошибке
 * @category Components
 */
export default class ErrorBoundary extends React.Component {

    constructor(props) {

        super(props);

        this.state = {hasError: false};

    }

    static getDerivedStateFromError(error) {
        // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
        localStorage.setItem(CRITICAL_ERROR, JSON.stringify(errorToObject(error)))
        ErrorReport.sendError(error).catch(console.error)

        return {hasError: true};

    }

    componentDidCatch(error, errorInfo) {
        // Можно также сохранить информацию об ошибке в соответствующую службу журнала ошибок
        console.log('boundary catch')
    }

    render() {
        if (this.state.hasError) {
            this.setState({hasError: false})
            return <ErrorPage />
        }
        return this.props.children;
    }
}