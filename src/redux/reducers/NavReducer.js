import {SET_STATE_NAV} from '../actions/NavAction';

const initialState = {
    sidebarShow: 'responsive'
};

const NavReducer = (state = initialState, { type, ...rest }) => {
    switch (type) {
        case SET_STATE_NAV:
            return { ...state, ...rest }
        default:
            return state
    }
}

export default NavReducer;