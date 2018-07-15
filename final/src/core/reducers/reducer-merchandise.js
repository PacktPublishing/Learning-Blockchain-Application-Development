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
        case constants.ITEM_RETRIEVED:
            return Object.assign({}, state, {
                merchandise: {
                    itemId: action.transaction[0],
                    itemName: action.transaction[1],
                    itemDesc: action.transaction[2],
                    itemPrice: web3.utils.fromWei(action.transaction[3].toNumber().toString(), 'ether'),
                    itemSold: action.transaction[4],
                    itemReceived: action.transaction[5],
                    itemShipped: action.transaction[6]
                }
            })

        case constants.ITEM_SOLD:
            return Object.assign({}, state, {
                transaction: action.transaction
            })

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