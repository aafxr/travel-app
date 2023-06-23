class Expenses {
    actions = []

    constructor( userId, primaryEntityType, primaryEntityId, db ) {
        this.userId = userId
        this.primaryEntityId = primaryEntityId
        this.db = db
    }

    section(event){

    }

    async limit(event){
        switch (event.action){
            case 'add':
                break;
            case 'edit':
                break;
            case 'remove':
                break;
            default:
                console.error(`[Expenses] Unknown action type: ${event.action}`)
        }
    }

    async expensesActual(event){
        switch (event.action){
            case 'add':
                break;
            case 'edit':
                break;
            case 'remove':
                break;
            default:
                console.error(`[Expenses] Unknown action type: ${event.action}`)
        }
    }

    async expensesPlaned(event){
        switch (event.action){
            case 'add':
                break;
            case 'edit':
                break;
            case 'remove':
                break;
            default:
                console.error(`[Expenses] Unknown action type: ${event.action}`)
        }
    }

    add(event){
        switch (event.entity){
            case 'limit':
                this.limit(event)
                break;
            case 'expenses_actual':
                this.expensesActual(event)
                break;
            case 'expenses_plan':
                this.expensesPlaned(event)
                break;
            default:
                console.error(`[Expenses] Unknown entity type: ${event.entity}`)
        }
    }

    myExpenses(){}

    allExpenses(){}

    commonExpenses(){}
}