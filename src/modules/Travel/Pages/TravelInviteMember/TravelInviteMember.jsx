import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import Input from "../../../../components/ui/Input/Input";
import Checkbox from "../../../../components/ui/Checkbox/Checkbox";
import Counter from "../../../../components/Counter/Counter";

export default function TravelInviteMember() {


    return (
        <div className='wrapper'>
            <Container className='content pt-20 pb-20 column gap-0.5'>
                <h2 className='invite-title'>Добавить в поедку</h2>
                <Input
                    placeholder='Имя'
                />
                <Checkbox>Ребенок</Checkbox>
                <div className='invite-child'>
                    <Counter min={0} max={18} initialValue={7}/>
                    <span>лет</span>
                </div>
                <div className='flex-stretch'>
                    <Input placeholder='E-mail' />
                    <button className='invite-button'>Пригласить</button>
                </div>

                <Button className='close-button'>Закрыть</Button>
            </Container>
        </div>
    )
}