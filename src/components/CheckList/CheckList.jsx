import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import RadioButtonGroup from "../RadioButtonGroup/RadioButtonGroup";
import Container from "../Container/Container";
import storeDB from "../../db/storeDB/storeDB";
import constants from "../../static/constants";
import createId from "../../utils/createId";
import Button from "../ui/Button/Button";
import Modal from "../Modal/Modal";
import {Input} from "../ui";

import './CheckList.css'

export default function CheckList({isVisible, close}) {
    const {travelCode} = useParams()
    const [value, setValue] = useState('')
    const [checkList, setCheckList] = useState(null)
    const [checkListItems, setCheckListItems] = useState([])
    const [changed, setChanged] = useState(false)

    //загрузка чеклистаиз хранилища ===================================================================================
    useEffect(() => {
        if (travelCode) {
            storeDB.getOneFromIndex(constants.store.CHECKLIST, constants.indexes.PRIMARY_ENTITY_ID, travelCode)
                .then(list => {
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
                .then(() => close && close())
        }
    }

    // обработка закрытия модального окна =============================================================================
    function handleClose() {
        close && close()
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
    function handleListGroup(items) {
        const checkedIdList = items.map(item => item.id)
        const updatedList = checkListItems.map(item => {
            item.checked = !!checkedIdList.includes(item.id) ? 1 : 0;
            return item
        })
        setCheckListItems(updatedList)
        setChanged(true)
    }


    return (
        <Modal isVisible={isVisible} close={handleClose} submit={handleSubmit}>
            <Container className='wrapper pt-20 pb-20'>
                <Input
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={e => e.target.focus()}
                    placeholder='Добавить запись'
                />
                <div className='content'>
                    <RadioButtonGroup
                        multy
                        position='left'
                        initValue={checkListItems.filter(item => !!item.checked)}
                        onChange={handleListGroup}
                        checklist={checkListItems}
                    />
                </div>
                <Button className='footer' onClick={handleSubmit} disabled={!changed}>Сохранить</Button>
            </Container>
        </Modal>
    )
}