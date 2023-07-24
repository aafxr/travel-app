import {PageHeader} from "../../../../components/ui";
import Container from "../../components/Container/Container";
import Button from "../../components/Button/Button";
import {useNavigate, useParams} from "react-router-dom";
import {useContext} from "react";
import {ExpensesContext} from "../../contextProvider/ExpensesContextProvider";
import {pushAlertMessage} from "../../../../components/Alerts/Alerts";
import useExpense from "../../hooks/useExpense";
import {WorkerContext} from "../../../../contexts/WorkerContextProvider";
import createActionMessage from "../../helpers/createActionMessage";

export default function ExpensesRemove({user_id, primary_entity_type, expensesType = 'plan'}) {
    const {expenseCode} = useParams()
    const navigate = useNavigate()

    const {expensesActualModel, expensesPlanModel} = useContext(ExpensesContext)
    const {worker} = useContext(WorkerContext)

    const model = expensesType === 'plan' ? expensesPlanModel : expensesActualModel
    const expense = useExpense(model, expenseCode)


    function handleRemove() {
        if (model && expense && worker) {
            model.remove(expense.id)
                .then(() => {
                    worker.postMessage(createActionMessage('remove', user_id, model, expense))
                })
                .then(() => {
                    pushAlertMessage({type: 'success', message: `Успешно удалено`})
                    navigate(-1)
                })
        }
    }

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader arrowBack title={'Удалить'}/>
            </Container>
            <div className='footer-btn-container footer'>
                <Button onClick={handleRemove}>Удалить</Button>
            </div>
        </div>
    )
}
