import {PageHeader} from "../../../../components/ui";
import Container from "../../components/Container/Container";
import Button from "../../components/Button/Button";

export default function ExpensesEdit({user_id, primary_entity_type, expensesType = 'plan'}) {

    return (
        <Container className='wrapper'>
            <div className='content'>
                <PageHeader arrowBack title={'Редактировать расходы'}/>
            </div>
            <Button className='footer'>Сохранить</Button>
        </Container>
    )
}