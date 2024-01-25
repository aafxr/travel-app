import React from 'react'
import {useNavigate} from "react-router-dom";

import IconButton from "../../../../components/ui/IconButton/IconButton";
import Navigation from "../../../../components/Navigation/Navigation";
import Container from "../../../../components/Container/Container";
import {useUser} from "../../../../contexts/AppContextProvider";
import {PageHeader} from "../../../../components/ui";


/**
 * компонент отображает добавленные маршруты в избранное
 * @function
 * @name Favorite
 * @category Pages
 */
export default function Favorite() {
    const navigate = useNavigate()
    const user = useUser()


    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader title={'Избранное'} />
                {
                    user
                        ? (
                            <div className='column gap-1'>
                                В разработке
                            </div>
                        ) : (
                            <IconButton
                                border={false}
                                title='Авторизоваться'
                                className='link'
                                onClick={() => navigate('/login/')}
                            />
                        )
                }
            </Container>
            <Navigation className='footer'/>
        </div>
    )
}
