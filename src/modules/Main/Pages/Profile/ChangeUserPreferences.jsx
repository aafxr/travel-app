import React, {useContext} from "react";

import RadioButtonGroup from "../../../../components/RadioButtonGroup/RadioButtonGroup";
import LinkComponent from "../../../../components/ui/LinkComponent/LinkComponent";
import {ThemeContext} from "../../../../contexts/ThemeContextProvider";
import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";

const variants = [
    {id: 1,title:'По умолчанию'},
    {id: 2,title:'Темная'},
    {id: 3,title:'Светлая'}
]

const themeConvertor = {
    ['Темная']: 'dark-theme',
    ['Светлая']: 'light-theme',
    ['По умолчанию']: 'default',
    ['dark-theme']: 'Темная',
    ['light-theme']: 'Светлая',
    ['default']:'По умолчанию'
}

/**
 * компонент для изменения настроек пользователя
 * @function
 * @name ChangeUserPreferences
 * @returns {JSX.Element}
 * @category Pages
 */
export default function ChangeUserPreferences() {
    const {theme, setTheme} = useContext(ThemeContext)

    /** обработка изменения темы приложения */
    function handleThemeChange(newTheme) {
        if (variants.includes(newTheme)) {
            setTheme(themeConvertor[newTheme.title])
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
                    initValue={variants.find(v => v.title === themeConvertor[theme])}
                    position='left'
                />
            </Container>
        </div>
    )
}