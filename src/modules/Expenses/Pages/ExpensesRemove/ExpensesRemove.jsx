import {PageHeader} from "../../../../components/ui";
import Container from "../../components/Container/Container";
import Button from "../../components/Button/Button";

export default function ExpensesRemove({user_id, primary_entity_type, expensesType = 'plan'}) {

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