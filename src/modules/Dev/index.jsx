import React, {useEffect} from 'react'
import {Link, useNavigate} from "react-router-dom";
import {Input, PageHeader} from "../../components/ui";
import Container from "../../components/Container/Container";

import Categories from "../../components/Categories/Categories";


export default function Dev() {
    const navigate = useNavigate()


    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            navigate('/')
        }
    }, [])

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
                </div>
                <Categories style={{marginTop: '0.5rem'}}/>
                <Categories style={{marginTop: '0.5rem'}}/>
            </Container>
        </>
    )
}