import {Link} from "react-router-dom";
import React, {PropsWithChildren} from 'react'

import ErrorPage from "../../modules/OtherPages/ErrorPage";
import ErrorReport from "../../controllers/ErrorReport";
import {CRITICAL_ERROR} from "../../static/constants";
import errorToObject from "../../utils/errorToObject";
import Container from "../Container/Container";

interface ErrorBoundaryStateType {
    hasError: boolean,
    error?:Error
}


/**
 * Компонет оборачивает приложение и, в случае возникновения ошибки, отображает страницу об ошибке
 * @category Components
 */
export default class ErrorBoundary extends React.Component<PropsWithChildren, ErrorBoundaryStateType> {
    constructor(props: React.PropsWithChildren) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error:Error) {
        // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
        localStorage.setItem(CRITICAL_ERROR, JSON.stringify(errorToObject(error)))
        ErrorReport.sendError(error).catch(console.error)


        return {hasError: true, error};

    }

    componentDidCatch(error: Error, errorInfo: any) {
        // Можно также сохранить информацию об ошибке в соответствующую службу журнала ошибок
        console.log('boundary catch')
        console.error(error)
        this.setState({
            hasError: true,
            error
        })
    }

    resetState(){
        this.setState({
            hasError: false,
            error: undefined
        })
    }

    render() {
        if (this.state.hasError) {
            return this.state.error
                ? <ErrorPage error={this.state.error} resetError={() => this.resetState()}/>
                : <Container className='ccenter'>
                    Error not founded
                    <Link to={'/'} className='link'>Back to home page</Link>
                </Container>
        }
        return this.props.children;
    }
}