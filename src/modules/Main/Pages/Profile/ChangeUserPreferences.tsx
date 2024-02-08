import React, {useContext} from "react";

import RadioButtonGroup, {RadioButtonGroupItemType} from "../../../../components/RadioButtonGroup/RadioButtonGroup";
import LinkComponent from "../../../../components/ui/LinkComponent/LinkComponent";
import {DefaultThemeType, ThemeContext} from "../../../../contexts/ThemeContextProvider";
import Container from "../../../../components/Container/Container";
import {PageHeader} from "../../../../components/ui";

const variants = new Map<RadioButtonGroupItemType, DefaultThemeType>([
    [{id: 1, title: 'По умолчанию'}, "default"],
    [{id: 2, title: 'Темная'}, "dark-theme"],
    [{id: 3, title: 'Светлая'}, "light-theme"]
    ]
)

const variantList = [...variants.keys()]


/** компонент для изменения настроек пользователя */
export default function ChangeUserPreferences() {
    const {theme, setTheme} = useContext(ThemeContext)

    /** обработка изменения темы приложения */
    function handleThemeChange(newTheme: RadioButtonGroupItemType[]) {
        const selectedTheme = variants.get(newTheme[0])
            setTheme(selectedTheme || 'default')
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
                    checklist={variantList}
                    onChange={handleThemeChange}
                    init={variantList.find(key => variants.get(key) === theme) || []}
                    position='left'
                />
            </Container>
        </div>
    )
}