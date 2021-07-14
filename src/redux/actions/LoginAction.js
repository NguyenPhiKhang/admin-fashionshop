import jwtAuthService from "src/services/jwtAuthService";
import { LOGIN_LOADING } from "../const/LoginConst";

export const loginWithUsernameAndPassword = (data) => dispatch => {
  dispatch({
    type: LOGIN_LOADING
  });

  jwtAuthService
    .loginWithUsernameAndPassword(email, password)
    .then(user => {
      dispatch(setUserData(user));

      history.push({
        pathname: "/"
      });

      return dispatch({
        type: LOGIN_SUCCESS
      });
    })
    .catch(error => {
      return dispatch({
        type: LOGIN_ERROR,
        payload: error
      });
    });
}

export function resetPassword({ email }) {
  return dispatch => {
    dispatch({
      payload: email,
      type: RESET_PASSWORD
    });
  };
}