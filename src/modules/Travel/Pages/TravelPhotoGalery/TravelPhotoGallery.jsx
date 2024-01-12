import {useNavigate, useParams} from "react-router-dom";

import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";

import './TravelPhotoGallery.css'

export default function TravelPhotoGallery() {
    const navigate = useNavigate()
    const {travelCode} = useParams()

    /** @param {TouchEvent<HTMLImageElement> | MouseEvent<HTMLImageElement>} e */
    function handePhotoClick(e) {
        if (e.target.nodeName === 'IMG') {
            const url = e.target.src || '';
            const query = new URLSearchParams()
            query.set('q', url)

            navigate(`/travel/${travelCode}/photoGallery/add/?${query.toString()}`)
        }
    }


    return (
        <Container className='photo-gallery-container'>
            <PageHeader className='flex-0' arrowBack title={'Добавить фото'}/>
            <div className='photo-gallery-content'>
                <div className='photo-gallery'>
                    <div className='photo-gallery-image'>
                        <img className='img-abs'
                             src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"
                             alt="bridge"
                             onClick={handePhotoClick}
                        />
                    </div>

                </div>
            </div>

        </Container>
    )
}