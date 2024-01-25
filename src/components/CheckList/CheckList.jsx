import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import Container from "../Container/Container";
import storeDB from "../../classes/db/storeDB/storeDB";
import constants from "../../static/constants";
import Checkbox from "../ui/Checkbox/Checkbox";
import createId from "../../utils/createId";
import Button from "../ui/Button/Button";
import {Input, PageHeader} from "../ui";
import {PlusIcon} from "../svg";

import './CheckList.css'

/**
 * @typedef {Object} ChecklistItemType
 * @property {string} id
 * @property {string} title
 * @property {0 | 1} checked
 */

/**
 * @typedef {Object} ChecklistType
 * @property {string} id
 * @property {string} primary_entity_id
 * @property {ChecklistType[]} items
 */

/**
 * Компонент отображает чеклист путешествия
 * @returns {JSX.Element}
 * @category Pages
 */
export default function CheckList() {
    const navigate = useNavigate()
    const {travelCode} = useParams()
    /*** значение в input */
    const [value, setValue] = useState('')
    /*** сущность чеклист полученная из локальной бд либо сгенерированная (если в бд отсутствует) */
    const [checkList, setCheckList] = useState(/**@type{ChecklistType[] | null} */null)
    /*** список неободимого для поездки */
    const [checkListItems, setCheckListItems] = useState(/**@type{ChecklistItemType[]} */[])
    /*** флаг указывает на то, что чеклист изменен */
    const [changed, setChanged] = useState(false)

    //загрузка чеклистаиз хранилища ===================================================================================
    useEffect(() => {
        if (travelCode) {
            storeDB.getOneFromIndex(constants.store.CHECKLIST, constants.indexes.PRIMARY_ENTITY_ID, travelCode)
                .then( /*** @param {ChecklistType} list */ list => {
                    if (list) {
                        setCheckList(list)
                        setCheckListItems(list.items || [])
                    } else {
                        const newList = {
                            id: createId(),
                            primary_entity_id: travelCode,
                            items: []
                        }
                        setCheckList(newList)
                        setCheckListItems(newList.items)
                        setChanged(true)
                    }
                })
        }
    }, [travelCode])

    // созранение измененного чеклиста ===============================================================================
    function handleSubmit() {
        if (changed) {
            const newList = {
                ...checkList,
                items: checkListItems
            }
            storeDB.editElement(constants.store.CHECKLIST, newList)
                .then(() => navigate(-1))
        }
    }

    // добавление нового поля в чпичок чеклиста =======================================================================
    function handleKeyDown(e) {
        e.stopPropagation()
        if (e.keyCode === 13 && value.length) {
            const newItem = {id: createId(), title: value, checked: 0}
            setCheckListItems([...checkListItems, newItem])
            setChanged(true)
            setValue('')
        }
    }


    // обработка клика по чекбоксу, обновление текущих полей из списка чеклиста ======================================
    function handleItemCheckChange(item) {
        const idx = checkListItems.findIndex(el => el === item)
        checkListItems[idx].checked = !item.checked
        setCheckListItems([...checkListItems])
        !changed && setChanged(true)
    }

    function handleRemoveCheckListItem(e, item) {
        e.stopPropagation()
        const newList = checkListItems.filter(el => el !== item)
        setCheckListItems(newList)
        !changed && setChanged(true)
    }


    return (
        <Container className='check-list wrapper pb-20'>
            <PageHeader arrowBack title='Чек лист' />
            <Input
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Добавить запись'
            />
            <div className='content checkbox-content'>
                {
                    checkListItems.map(c => (
                        <Checkbox
                            key={c.id}
                            checked={c.checked}
                            left
                            onChange={() => handleItemCheckChange(c)}
                        >
                            <div className='flex-between align-center'>
                                    <span>{c.title}</span>
                                <PlusIcon
                                    className='check-list-item-remove center flex-0'
                                    onClick={(e) => handleRemoveCheckListItem(e, c)}
                                />
                            </div>
                        </Checkbox>
                    ))
                }
            </div>
            <div className='footer column gap-0.25'>
                <Button onClick={handleSubmit} disabled={!changed}>Сохранить</Button>
            </div>
        </Container>
    )
}
