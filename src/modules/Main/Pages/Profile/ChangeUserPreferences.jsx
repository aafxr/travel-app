import React from "react";
import {useDispatch, useSelector} from "react-redux";

import RadioButtonGroup from "../../../../components/RadioButtonGroup/RadioButtonGroup";
import LinkComponent from "../../../../components/ui/LinkComponent/LinkComponent";
import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";
import constants from "../../../../static/constants";
import {actions} from "../../../../redux/store";

const variants = [
    'По умолчанию',
    'Темная',
    'Светлая'
]

const themeConvertor = {
    ['Темная']: 'dark-theme',
    ['Светлая']: 'light-theme',
    ['По умолчанию']: 'default',
    ['dark-theme']: 'Темная',
    ['light-theme']: 'Светлая',
    ['default']:'По умолчанию'
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
                    groupClassNames='pt-20'
                    title={'Изменить тему'}
                    checklist={variants}
                    onChange={handleThemeChange}
                    initValue={themeConvertor[theme]}
                    position='left'
                />
            </Container>
        </div>
    )
}