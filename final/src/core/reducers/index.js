import { combineReducers } from 'redux'
import { providerReducer } from 'core/reducers/reducer-provider'
import { merchandiseReducer } from 'core/reducers/reducer-merchandise'

const rootReducer = combineReducers({
  provider: providerReducer,
  merchandise: merchandiseReducer
})

export default rootReducer
