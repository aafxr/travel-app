import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";

import Container from "../../components/Container/Container";
import {PageHeader, Toast} from "../../components/ui";

import './dev.css'
import Input from "../../components/ui/Input/Input";



export function Dev() {
    const navigate = useNavigate()
    const [toastVisible, setToastVisible] = useState(false)


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
                    <Input
                        onFocus={() => setToastVisible(true)}
                        onBlur ={() => setToastVisible(false)}
                    />
                    <Toast max={5} onSubmit={console.log} visible={toastVisible}/>
                </div>
            </Container>
        </>
    )
}