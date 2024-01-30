import React, {useContext} from "react";

import RadioButtonGroup, {RadioButtonGroupItemType} from "../../../../components/RadioButtonGroup/RadioButtonGroup";
import LinkComponent from "../../../../components/ui/LinkComponent/LinkComponent";
import {DefaultThemeType, ThemeContext} from "../../../../contexts/ThemeContextProvider";
import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";

const variants = [
    {id: 1, title: 'По умолчанию'},
    {id: 2, title: 'Темная'},
    {id: 3, title: 'Светлая'}
]

const themeConvertor: { [key: string]: DefaultThemeType } = {
    ['Темная']: 'dark-theme',
    ['Светлая']: 'light-theme',
    ['По умолчанию']: 'default',
}
const themeToString: Record<DefaultThemeType, string> = {
    ['dark-theme']: 'Темная',
    ['light-theme']: 'Светлая',
    ['default']: 'По умолчанию'
}

/** компонент для изменения настроек пользователя */
export default function ChangeUserPreferences() {
    const {theme, setTheme} = useContext(ThemeContext)

    /** обработка изменения темы приложения */
    function handleThemeChange(newTheme: RadioButtonGroupItemType[]) {
        const key = newTheme[0].title as DefaultThemeType
        if (variants.find(v => v.title === themeToString[key])) {
            setTheme(themeConvertor[newTheme[0].title] || '')
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
                    init={variants.find(v => v.title === themeToString[theme])!}
                    position='left'
                />
            </Container>
        </div>
    )
}