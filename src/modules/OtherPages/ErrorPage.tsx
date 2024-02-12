import {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";

import Container from "../../components/Container/Container";
import Button from "../../components/ui/Button/Button";
import {PageHeader} from "../../components/ui";


type ErrorPagePropsType = {
    error: Error
    resetError?: () => unknown
}

/**
 * компонент отображения ошибки
 * @param error
 * @param resetError
 * @returns {JSX.Element}
 * @constructor
 */
export default function ErrorPage({error, resetError}: ErrorPagePropsType) {
    const navigate = useNavigate()

    useEffect(() => {
        console.error(error)
    }, [error])


    function handleReset() {
        resetError && resetError()
        navigate('/')
    }

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader title={'Произошла ошибка'}/>
                {!!error && (
                        <div className='column gap-1'>
                            <div>Some Error happens</div>
                        </div>
                    )}
                <div className='link' onClick={handleReset}>На главную</div>
            </Container>
        </div>
    )
}