import { combineReducers } from 'redux';
import LoginReducer from './LoginReducer';
import NavReducer from './NavReducer';
import UserReducer from './UserReducer';

const rootReducer = combineReducers({
    nav: NavReducer,
    user: UserReducer,
    login: LoginReducer
});

export default rootReducer;