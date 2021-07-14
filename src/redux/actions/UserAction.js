import { useHistory } from "react-router-dom";
import jwtAuthService from "src/services/jwtAuthService";
import { SET_USER_DATA, USER_LOGGED_OUT } from "../const/UserConst";

export function setUserData(user) {
  return dispatch => {
    dispatch({
      type: SET_USER_DATA,
      data: user
    });
  };
}

export function logoutUser() {
  return dispatch => {
    jwtAuthService.logout();

    dispatch({
      type: USER_LOGGED_OUT
    });
  };
}