import { SET_STATE_NAV } from "../const/NavConst";

export const setStateNav = (data) =>
({
    type: SET_STATE_NAV,
    payload: data
})