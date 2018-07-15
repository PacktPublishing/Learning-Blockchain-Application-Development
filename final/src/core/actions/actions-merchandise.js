import constants from 'core/types'
import contract from 'truffle-contract'
import Merchandise from 'contracts/Merchandise.json'
import web3 from 'web3'


function getItemFromContract(MerchandiseContract, id, resolve, reject) {
    MerchandiseContract.deployed().then((merchandisecontract) => {
        return merchandisecontract.getItem(id)
    })
    .then(result => {
        const transaction = (result !== null) ? result: null
        resolve(transaction)
    })
    .catch((error) => {
        reject(error)
    })
}

function submitPurchaseToNetwork(MerchandiseContract, id, price, resolve, reject) {
    MerchandiseContract.deployed().then((merchandisecontract) => {
        return merchandisecontract.buyItem(id, {
            value: web3.utils.toWei(price, 'ether')
        })
    })
    .then(result => {
        const transaction = (result !== null) ? result : null
        resolve(transaction)
    })
    .catch((error) => {
        reject(error)
    })
}

function registerListing(MerchandiseContract, merch, resolve, reject) {
    MerchandiseContract.deployed().then((merchandisecontract) => {
        return merchandisecontract.addItem(
            merch.itemName, 
            merch.itemDesc, 
            web3.utils.toWei(merch.itemPrice, 'ether')
        )
    })
    .then(result => {
        const transaction = (result !== null) ? result : null
        resolve(transaction)
    })
    .catch((error) => {
        reject(error)
    })
}

function claimFundsFromContract(MerchandiseContract, resolve, reject) {
    MerchandiseContract.deployed().then((merchandisecontract) => {
        return merchandisecontract.claimFunds( 0, {
            gas: 1000000,
            gasPrice: 20000000000
        })
    })
    .then(result => {
        const transaction = (result !== null) ? result : null
        resolve(transaction)
    })
    .catch((error) => {
        reject(error)
    })
}

function dispatchItemRetrieved(transaction, dispatch) {
    dispatch((() => {
        return {
            type: constants.ITEM_RETRIEVED,
            transaction: transaction,
            success: true
        }
    })())
}

function dispatchItemRetrieveFailed(dispatch) {
    dispatch((() => {
        return {
            type: constants.ITEM_RETRIEVED,
            success: false
        }
    })())
}

function dispatchPurchaseComplete(transaction, dispatch) {
    dispatch((() => {
        return {
            type: constants.ITEM_SOLD,
            transaction: transaction,
            success: true
        }
    })())
}

function dispatchPurchaseFailed(dispatch) {
    dispatch((() => {
        return {
            type: constants.ITEM_SOLD,
            success: false
        }
    })())
}

function dispatchListingCreated(transaction, dispatch) {
    dispatch((() => {
        return {
            type: constants.NEW_ITEM_ADDED,
            itemId: transaction,
            success: true
        }
    })())
}

function dispatchCreationError(dispatch) {
    dispatch((() => {
        return {
            type: constants.NEW_ITEM_ADDED,
            success: false
        }
    })())
}

function dispatchFundsTransfer(transaction, dispatch) {
    dispatch((() => {
        return {
            type: constants.FUNDS_TRANSFER,
            transaction: transaction,
            success: true
        }
    })())
}

function dispatchFundsFail(dispatch) {
    dispatch((() => {
        return {
            type: constants.FUNDS_TRANSFER,
            success: false
        }
    }))
}

export function getItem(id) {
    return (dispatch, getState) => {
        const { web3Provider } = getState().provider
        const MerchandiseContract = contract(Merchandise)
        MerchandiseContract.setProvider(web3Provider.currentProvider)
        MerchandiseContract.defaults({from: web3Provider.eth.defaultAccount})

        return new Promise((resolve, reject) => {
            getItemFromContract(MerchandiseContract, id, resolve, reject)
        })
        .then((transaction) => {
            if (transaction) {
                dispatchItemRetrieved(transaction, dispatch)
            } else {
                dispatchItemRetrieveFailed(dispatch)
            }
        })
    }
}

export function buyItem(id, price) {
    return (dispatch, getState) => {
        const { web3Provider } = getState().provider

        console.log(`Purchasing item ${id} for ${price} ether`)
        const MerchandiseContract = contract(Merchandise)

        MerchandiseContract.setProvider(web3Provider.currentProvider)
        MerchandiseContract.defaults({from: web3Provider.eth.defaultAccount})
        console.log(`Buy item using address ${web3Provider.eth.defaultAccount}`)

        return new Promise((resolve, reject) => {
            submitPurchaseToNetwork(MerchandiseContract, id, price, resolve, reject)
        })
        .then((transaction) => {
            if (transaction) {
                console.log("Transaction submitted and promise resolved")
                dispatchPurchaseComplete(transaction, dispatch)
            } else {
                console.log("Transaction rejected")
                dispatchPurchaseFailed(dispatch)
            }

        })
    }
}

export function addListing(merch) {
    return (dispatch, getState) => {
        const { web3Provider } = getState().provider

        console.log("Adding Listing")
        const MerchandiseContract = contract(Merchandise)

        MerchandiseContract.setProvider(web3Provider.currentProvider)
        MerchandiseContract.defaults({from: web3Provider.eth.defaultAccount})
        console.log(`New item using address ${web3Provider.eth.defaultAccount}`)

        return new Promise((resolve, reject) => {
            registerListing(MerchandiseContract, merch, resolve, reject)
        })
        .then((transaction) => {
            if (transaction) {
                console.log("Transaction submitted and promise resolved")
                dispatchListingCreated(transaction, dispatch)
            } else {
                console.log("Transaction rejected")
                dispatchCreationError(dispatch)
            }
        })
    }
}

export function claimFunds() {
    return (dispatch, getState) => {
        const { web3Provider } = getState().provider

        const MerchandiseContract = contract(Merchandise)

        MerchandiseContract.setProvider(web3Provider.currentProvider)
        MerchandiseContract.defaults({from: web3Provider.eth.defaultAccount})
        console.log(`Claim funds for address ${web3Provider.eth.defaultAccount}`)

        return new Promise((resolve, reject) => {
            claimFundsFromContract(MerchandiseContract, resolve, reject)
        })
        .then((transaction) => {
            if (transaction) {
                dispatchFundsTransfer(transaction, dispatch)
            } else {
                dispatchFundsFail(dispatch)
            }
        })
    }
}