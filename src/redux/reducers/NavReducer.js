import { SET_STATE_NAV } from "../const/NavConst";


const initialState = {
    sidebarShow: 'responsive'
};

const NavReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STATE_NAV:
            let data = { ...state, ...action.payload };
            return data;
        default:
            return state
    }
}

export default NavReducer;