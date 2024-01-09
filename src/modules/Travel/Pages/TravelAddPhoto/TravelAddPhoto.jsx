import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";

import {TextArea} from "../../../../components/ui/TextArea/TextArea";
import Container from "../../../../components/Container/Container";
import {DEFAULT_IMG_URL} from "../../../../static/constants";
import Button from "../../../../components/ui/Button/Button";
import {PageHeader} from "../../../../components/ui";

import './TravelAddPhoto.css'

export default function TravelAddPhoto() {
    const [search] = useSearchParams()
    const [url, setUrl] = useState('')
    const [text, setText] = useState('')

    useEffect(() => {
        const url = search.get('q')
        setUrl(url)
    }, [])

    return (
        <div className='wrapper'>
            <Container>
                <PageHeader arrowBack title={'Добавить фото'}/>
            </Container>
            <Container className='add-photo-container content'>
                <div className='add-photo flex-1'>
                    <div className='add-photo-image'>
                        <img className='img-abs' src={url || DEFAULT_IMG_URL} alt={'add_photo'}/>
                    </div>
                    <TextArea
                        className='mt-20'
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder='Добавить описание'
                    />
                </div>
            </Container>
            <Container className='footer pt-20 pb-20'>
                <Button className='add-photo-button'>Добавить</Button>
            </Container>
        </div>
    )
}