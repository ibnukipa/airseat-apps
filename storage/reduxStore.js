import {createStore} from 'redux'

import reducers from './reduxReducers'

const stores = createStore(reducers)
export default stores
