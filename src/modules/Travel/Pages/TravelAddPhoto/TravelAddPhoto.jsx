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
            <div className='content'>
                <div className='add-photo-image'>
                    <img className='img-abs' src={url || DEFAULT_IMG_URL} alt={'add_photo'}/>
                </div>
                <Container className='column'>
                    <TextArea
                        className='mt-20 h-full'
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder='Добавить описание'
                        rows={4}
                        autoResize={false}
                    />
                </Container>
            </div>
            <Container className='footer footer-btn-container'>
                <Button className=''>Добавить</Button>
            </Container>
        </div>
    )
}