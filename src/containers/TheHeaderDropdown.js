import React, { useEffect, useState } from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { connect } from 'react-redux'
import { PropTypes } from "prop-types";
import { logoutUser, setUserData } from 'src/redux/actions/UserAction';
import jwtAuthService from 'src/services/jwtAuthService';
import { useHistory } from 'react-router-dom';

const TheHeaderDropdown = (props) => {
  const history = useHistory();

  const [user, setUser] = useState({ name: '', image_url: '' });

  useEffect(() => {
    const checkLogin = async () => {
      const data = await jwtAuthService.loginWithToken();
      console.log(data)
      if (data.success === 1) {
        props.setUserData(data.data);
        // history.push("/");
      } else {
        history.push("/login");
      }
    }

    checkLogin();
  }, [])

  useEffect(() => {
    if(typeof(props.userData)!=="undefined")
      setUser({ image_url: props.userData.image_url, name: props.userData.name })

  }, [props.userData])

  const handleClickSignOut = () => {
    props.logoutUser();
    history.push("/login");
  }

  const handleClickProfile = ()=>{
    history.push("/profile/user")
  }

  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(44, 56, 74, 0.1)', borderRadius: 30, height: 50 }}>
          <span style={{ padding: 15, fontWeight: 'bold' }}>{user.name}</span>
          <div className="c-avatar">
            <img src={user.image_url} style={{ width: 50, height: 50, borderRadius: 30 }} />
          </div>
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem
          header
          tag="div"
          color="light"
          className="text-center"
        >
          <strong>Tài khoản</strong>
        </CDropdownItem>
        <CDropdownItem onClick={handleClickProfile}>
          <CIcon name="cil-user" className="mfe-2" />Xem thông tin
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem onClick={handleClickSignOut}>
          <CIcon name="cil-account-logout" className="mfe-2" />
          Đăng xuất
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

const mapStateToProps = state => ({
  setUserData: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  userData: state.user.user
});

export default connect(
  mapStateToProps,
  { setUserData, logoutUser }
)(TheHeaderDropdown);
