import {ChecklistType} from "../../types/ChecklistType";
import {StoreEntity} from "./StoreEntity";
import {DBFlagType} from "../../types/DBFlagType";
import {StoreName} from "../../types/StoreName";

type ChecklistOptionsType = Partial<ChecklistType> & Pick<ChecklistType, 'id'>

export class Checklist extends StoreEntity implements ChecklistType {
    storeName: StoreName = StoreName.CHECKLIST

    id: string;
    records: { [p: string]: DBFlagType } = {};

    constructor(options: ChecklistOptionsType) {
        super();

        this.id = options.id
        if (options.records) this.records = options.records
    }

    dto(): { id: string; [p: string]: any } {
        return {
            id: this.id,
            records: {...this.records},
        };
    }

    static getRecords(chl: Checklist): string[] {
        return Object.keys(chl.records)
    }

    static getRecordValue(chl: Checklist, record: string): boolean {
        if (record in chl.records)
            return Boolean(chl.records[record])
        return false
    }

    static setRecord(chl: Checklist, record: string, value: DBFlagType | boolean) {
        chl.records[record] = value ? 1 : 0
    }

    static removeRecord(chl: Checklist, record: string) {
        delete chl.records[record]
    }
}