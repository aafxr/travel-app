import Container from "../Expenses/components/Container/Container";
import {PageHeader} from "../../components/ui";
import {useNavigate} from "react-router-dom";
import Button from "../../components/ui/Button/Button";

export default function ErrorPage(){
const navigate = useNavigate()
    /**@type {Error}*/
    const error = window.travelerError

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader title={'Произошла ошибка'} />
                {
                    !!error && (
                        <>
                            <div>{error.message}</div>
                            <div>{error.stack}</div>
                        </>
                    )}
            </Container>
            <Container className='footer footer-btn-container'>
                <Button onClick={() => navigate('/')} >
                    На главную
                </Button>
            </Container>
        </div>
    )
}