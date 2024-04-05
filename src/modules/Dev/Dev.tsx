import React, {useEffect, useRef, useState} from 'react'
import {useNavigate} from "react-router-dom";

import Container from "../../components/Container/Container";
import {PageHeader, DropDown, Chip} from "../../components/ui";
import Input from "../../components/ui/Input/Input";
import MSwipe from "../../components/MSwipe/MSwipe";

import './dev.css'


export function Dev() {
    const navigate = useNavigate()
    const [toastVisible, setToastVisible] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)


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
            <Container className={'overflow-x-hidden'}>
                <PageHeader title={'Главная страница'}/>

                <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    gap: '20px',
                    flexDirection: 'column',
                    letterSpacing: '1px'
                }}>
                    <Input
                        ref={inputRef}
                        onFocus={() => setToastVisible(true)}
                        onBlur ={() => setToastVisible(false)}
                    />
                    <DropDown
                        items={['item 1', 'item 2', 'item 3', 'item 4', 'item 5']}
                        node={inputRef}
                        max={3}
                        onSubmit={(item) => console.log(`submit ${item}`)}
                        onSelect={(item) => console.log(`select ${item}`)}
                        onDropDownClose={() => {
                            inputRef.current?.blur()
                            console.log(`close`)
                        }}
                        visible={toastVisible}
                    />
                    <div className={'hide-scroll'}>
                        <MSwipe shift={80}>
                            <MSwipe.Body>
                                <Input value={';alkds'} />
                                <Chip>asd</Chip>
                                <p>a';sdl</p>
                            </MSwipe.Body>

                            <MSwipe.LeftButton>
                                <div className='h-full' style={{width: '180px', backgroundColor: '#faf'}}>
                                    Lorem
                                </div>
                            </MSwipe.LeftButton>

                            <MSwipe.RightButton>
                                <div className='h-full bg-grey-light' style={{width: '180px', backgroundColor: '#aff'}}>
                                    right
                                </div>
                            </MSwipe.RightButton>
                        </MSwipe>
                    </div>
                </div>
            </Container>
        </>
    )
}
