import React from "react";

import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";
import LinkComponent from "../../../../components/ui/LinkComponent/LinkComponent";

export default function ChangeName(){

    return (
        <div className='wrapper'>
        <Container className='content'>
            <PageHeader arrowBack />
            <LinkComponent title={'Изменить имя'} to='/profile/settings/user/name/edite/' arrow/>
            <LinkComponent title={'Изменить фото'} to='/profile/settings/user/photo/edite/' arrow/>
        </Container>
        </div>
    )
}