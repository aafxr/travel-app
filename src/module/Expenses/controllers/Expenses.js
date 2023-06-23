class Expenses {
    actions = []

    constructor( userId, primaryEntityType, primaryEntityId, db ) {
        this.userId = userId
        this.primaryEntityId = primaryEntityId
        this.db = db
    }

    section(action, entity){

    }

    limit(action, entity){}

    expensesActual(action, entity){}

    expensesPlaned(action, entity){}

    action(){}

    myExpenses(){}

    allExpenses(){}

    commonExpenses(){}
}