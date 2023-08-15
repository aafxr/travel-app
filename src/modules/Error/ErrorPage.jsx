import Container from "../../components/Container/Container";
import {PageHeader} from "../../components/ui";
import {useNavigate} from "react-router-dom";
import Button from "../../components/ui/Button/Button";
import {useEffect, useState} from "react";
import {CRITICAL_ERROR} from "../../static/constants";

export default function ErrorPage() {
    const navigate = useNavigate()

    /**@type {[Error, function]}*/
    const [error, setError] = useState(null)

    useEffect(() => {
        const e = JSON.parse(localStorage.getItem(CRITICAL_ERROR))
        setError(e)
    }, [])


    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader title={'Произошла ошибка'}/>
                {
                    !!error && (
                            <div className='column gap-1'>
                                <div>
                                    <b>Error: </b>
                                    {error.message}
                                </div>
                                <div>
                                    <b>Stack: </b>
                                    {error.stack}
                                </div>
                            </div>
                    )}
            </Container>
            <Container className='footer footer-btn-container'>
                <Button onClick={() => navigate('/')}>
                    На главную
                </Button>
            </Container>
        </div>
    )
}