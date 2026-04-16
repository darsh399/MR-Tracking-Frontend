
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';
import dataReducer from './reducer/dataReducer';

const rootReducer = combineReducers({
  dataReducer,
});

const Store = createStore(rootReducer, applyMiddleware(thunk));

export default Store;