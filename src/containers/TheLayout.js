import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import jwtAuthService from 'src/services/jwtAuthService';
import {
  TheContent,
  TheSidebar,
  TheFooter,
  TheHeader
} from './index'

import { setUserData } from 'src/redux/actions/UserAction'
import { connect } from 'react-redux'
import { PropTypes } from "prop-types";

const TheLayout = (props) => {
  const history = useHistory();

  useEffect(()=>{
    const checkLogin = async () => {
      const data = await jwtAuthService.loginWithToken();
      if (data.success === 1) {
        console.log("layout")
        console.log(data.data)
        props.setUserData(data.data);
        history.push("/");
      }else{
        history.push("/login");
      }
    }

    // checkLogin();
    console.log("layout")
  }, []);

  return (
    <div className="c-app c-default-layout">
      <TheSidebar/>
      <div className="c-wrapper">
        <TheHeader/>
        <div className="c-body">
          <TheContent/>
        </div>
        <TheFooter/>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  setUserData: PropTypes.func.isRequired,
  login: state.login
});

export default connect(
  mapStateToProps,
  { setUserData }
)(TheLayout);
