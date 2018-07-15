import constants from 'core/types'
import contract from 'truffle-contract'
import Merchandise from 'contracts/Merchandise.json'
import web3 from 'web3'

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