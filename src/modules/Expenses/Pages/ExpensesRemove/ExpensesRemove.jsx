import {PageHeader} from "../../../../components/ui";
import Container from "../../components/Container/Container";
import Button from "../../components/Button/Button";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import constants from "../../db/constants";

export default function ExpensesRemove({user_id, primary_entity_type, expensesType = 'plan'}) {
    const {expenseCode} = useParams()
    const navigate = useNavigate()
    const {pathname} = useLocation()

    const {controller} =useContext(ExpensesContext)

    useEffect(()=> {
        if (controller && expenseCode){
            const storeName = expensesType === 'plan' ? constants.store.EXPENSES_PLAN : constants.store.EXPENSES_ACTUAL

            controller.write({
                storeName,
                action: 'remove',
                data: expenseCode,
                user_id
            })
                .then(() =>{
                    const idx = pathname.indexOf('remove')

                    idx > -1
                        ? navigate(pathname.slice(0, idx))
                        : navigate(-1)

                })
        }
    }, [])

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader arrowBack title={'Удалить'}/>
            </Container>
            <div className='footer-btn-container footer'>
                <Button>Удалить</Button>
            </div>
        </div>
    )
}