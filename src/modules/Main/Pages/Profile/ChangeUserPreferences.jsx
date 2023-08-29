import React from "react";
import {useDispatch, useSelector} from "react-redux";

import RadioButtonGroup from "../../../../components/RadioButtonGroup/RadioButtonGroup";
import LinkComponent from "../../../../components/ui/LinkComponent/LinkComponent";
import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";
import constants from "../../../../static/constants";
import {actions} from "../../../../redux/store";

const variants = [
    'Темная тема',
    'Светлая тема'
]

const themeConvertor = {
    ['Темная тема']: 'dark-theme',
    ['Светлая тема']: 'light-theme',
    ['dark-theme']: 'Темная тема',
    ['light-theme']: 'Светлая тема'
}

export default function ChangeUserPreferences() {
    const {theme} = useSelector(state => state[constants.redux.USER])
    const dispatch = useDispatch()

    function handleThemeChange(newTheme) {
        if (variants.includes(newTheme)) {
            dispatch(actions.userActions.changeTheme(themeConvertor[newTheme]))
        }
    }

    return (
        <div className='wrapper'>
            <Container className='content'>
                <PageHeader arrowBack/>
                <LinkComponent title={'Изменить имя'} to='/profile/settings/user/name/edite/' arrow/>
                <LinkComponent title={'Изменить фото'} to='/profile/settings/user/photo/edite/' arrow/>
                <RadioButtonGroup
                    title={'Изменить тему'}
                    checklist={variants}
                    onChange={handleThemeChange}
                    initValue={themeConvertor[theme]}
                />
            </Container>
        </div>
    )
}