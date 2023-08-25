import React, {useEffect} from 'react'
import {Link, useNavigate} from "react-router-dom";
import {Input, PageHeader} from "../../components/ui";
import Container from "../../components/Container/Container";

import Select from "../../components/ui/Select/Select";
import IconButton from "../../components/ui/IconButton/IconButton";
import {ChatIcon, ChecklistIcon, Money} from "../../components/svg";
import AvatarPlaceHolder from "../../components/UserCard/AvatarPlaceholder";

// const tepl = {
//     created_at: "2023-08-10T04:37:31+03:00",
//     created_ip: "82.200.95.130",
//     created_location: "Novosibirsk",
//     created_user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
//     uid: "66",
//     update_location: "Novosibirsk",
//     updated_at: "2023-08-10T04:37:31+03:00",
//     updated_ip: "82.200.95.130",
// }

export default function Dev({
                                user_id,
                                primary_entity_type,
                                primary_entity_id
                            }) {
    const navigate = useNavigate()


    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            navigate('/')
        }
    }, [navigate])

    if (process.env.NODE_ENV === 'production') {
        return null
    }

    return (
        <>
            <Container>
                <PageHeader title={'Главная страница'}/>

                <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    gap: '20px',
                    flexDirection: 'column',
                    letterSpacing: '1px'
                }}>
                    <h2 style={{fontWeight: '900'}}>
                        <b>Опции</b>
                    </h2>
                    <Link to={`/travel/123/expenses/`} style={{color: 'green'}}>Список расходов</Link>
                    <Link to={`/travel/123/expenses/limit/123`} style={{color: 'green'}}>Редактировать лимит</Link>
                    <Link to={`/travel/123/expenses/plan/`} style={{color: 'green'}}>План расходов</Link>
                    <Link to={`/travel/123/expenses/add/`} style={{color: 'green'}}>Добавить расходы</Link>
                    <Link to={`/travel/123/expenses/plan/add/`} style={{color: 'green'}}>Добавить план расходов</Link>
                    <Link to={`/travel/123/expenses/section/add/`} style={{color: 'green'}}>Добавить секцию</Link>
                    <Link to={`/travel/44/add/`}>Новый маршрут</Link>
                    <Link to={`/travel/44/add/1/`} style={{textDecoration: 'line-through'}}>Направление</Link>

                </div>

                <Select options={['AFN', 'RUB', 'KZT', 'USD', 'EUR']} defaultValue={'RUB'}/>

                <div className='flex-between gap-0.75'>
                    <IconButton icon={<Money/>} title='Расходы'/>
                    <IconButton icon={<ChecklistIcon/>} title='Чек-лист'/>
                    <IconButton icon={<ChatIcon badge/>}/>
                </div>
                <div className='column'>
                    <AvatarPlaceHolder variant={'horizontal'}/>
                </div>
                <div className='flex-stretch'>
                <Input className='br-right-0' type={'date'} placeholder={'Дата'}/>
                <Input className='br-left-0' type={'time'} placeholder={'Время'}/>
                </div>

            </Container>
        </>
    )
}