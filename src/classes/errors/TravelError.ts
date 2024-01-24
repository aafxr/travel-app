import {CustomError} from "./CustomError";
import {ErrorCode} from "./ErrorCode";

export class TravelError extends CustomError {
    static permissionDeniedToChangeTravel() {
        return new TravelError('У вас нет прав на изменение', ErrorCode.PERMISSION_DENIED_TO_CHANGE_TRAVEL)
    }

    static permissionDeniedDeleteTravel() {
        return new TravelError('Вы не можете удалить данное путешествие', ErrorCode.PERMISSION_DENIED_DELETE_TRAVEL)
    }

    static unexpectedTravelId(travelId: string){
        return new TravelError(`Путешествие с id="${travelId}" не найдино`, ErrorCode.UNEXPECTED_TRAVEL_ID)
    }
}