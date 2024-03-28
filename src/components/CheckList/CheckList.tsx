import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

import defaultHandleError from "../../utils/error-handlers/defaultHandleError";
import {useTravel, useUser} from "../../contexts/AppContextProvider";
import {CheckListService} from "../../classes/services";
import {Checklist} from "../../classes/StoreEntities";
import Container from "../Container/Container";
import Checkbox from "../ui/Checkbox/Checkbox";
import Button from "../ui/Button/Button";
import {Input, PageHeader} from "../ui";
import {PlusIcon} from "../svg";

import './CheckList.css'

/**
 * Компонент отображает чеклист путешествия
 * @returns {JSX.Element}
 * @category Pages
 */
export default function CheckListComponent() {
    const user = useUser()
    const travel = useTravel()
    const navigate = useNavigate()
    const {travelCode} = useParams()
    /*** значение в input */
    const [value, setValue] = useState('')
    /*** сущность чеклист полученная из локальной бд либо сгенерированная (если в бд отсутствует) */
    const [checkList, setCheckList] = useState<Checklist>()
    /*** флаг указывает на то, что чеклист изменен */
    const [changed, setChanged] = useState(false)
    const [loading, setLoading] = useState(false)

    //загрузка чеклистаиз хранилища ===================================================================================
    useEffect(() => {
        if (!user) return
        if (!travel) return
        if (travelCode && travelCode !== travel.id) {
            setLoading(true)
            CheckListService.getCheckList(travel, user)
                .then(chl => setCheckList(chl))
                .catch(defaultHandleError)
                .finally(() => setLoading(false))
        }
    }, [travelCode, user, travel])

    // созранение измененного чеклиста ===============================================================================
    function handleSubmit() {
        if (checkList && changed) {
            CheckListService.updateChecklist(checkList)
                .then(() => navigate(-1))
                .catch(defaultHandleError)
        }
    }

    // добавление нового поля в чпичок чеклиста =======================================================================
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!checkList) return
        e.stopPropagation()
        if (e.keyCode === 13 && value.length) {
            Checklist.setRecord(checkList, value, false)
            setCheckList(new Checklist(checkList))
            setChanged(true)
            setValue('')
        }
    }


    // обработка клика по чекбоксу, обновление текущих полей из списка чеклиста ======================================
    function handleItemCheckChange(record: string) {
        if (!checkList) return
        const prevRecordValue = Checklist.getRecordValue(checkList, record)
        Checklist.setRecord(checkList, record, !prevRecordValue)
        setCheckList(new Checklist(checkList))
        !changed && setChanged(true)
    }

    function handleRemoveCheckListItem(e: React.MouseEvent | React.TouchEvent, record: string) {
        if (!checkList) return
        e.stopPropagation()
        Checklist.removeRecord(checkList, record)
        setCheckList(new Checklist(checkList))
        !changed && setChanged(true)
    }


    if (!checkList) return null

    return (
        <Container className='check-list wrapper pb-20' loading={loading}>
            <PageHeader arrowBack title='Чек лист'/>
            <Input
                value={value}
                onChange={setValue}
                onKeyDown={handleKeyDown}
                placeholder='Добавить запись'
            />
            <div className='content checkbox-content'>
                {
                    Checklist.getRecords(checkList).map(rec => (
                        <Checkbox
                            key={rec}
                            checked={Checklist.getRecordValue(checkList, rec)}
                            left
                            onChange={() => handleItemCheckChange(rec)}
                        >
                            <div className='flex-between align-center'>
                                <span>{rec}</span>
                                <PlusIcon
                                    className='check-list-item-remove center flex-0'
                                    onClick={(e) => handleRemoveCheckListItem(e, rec)}
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
