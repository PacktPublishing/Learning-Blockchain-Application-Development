import constants from 'core/types'
import web3 from 'web3'

const initialState = {
    itemId: '',
    itemName: '',
    itemDesc: '',
    itemPrice: '',
    merchandise: '',
    transaction: ''
}

export function merchandiseReducer(state = initialState, action) {
    switch (action.type) {
        case constants.NEW_ITEM_ADDED:
            return Object.assign({}, state, {
                itemId: action.transaction
            })

        case constants.FUNDS_TRANSFER:
            return Object.assign({}, state, {
                transaction: action.transaction.tx
            })

        default:
            return state
    }
}