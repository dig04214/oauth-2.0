import { combineReducers } from 'redux';
import user from './user_reducer';
import client from './client_reducer';

const rootReducer = combineReducers({
  user, client
})

export default rootReducer