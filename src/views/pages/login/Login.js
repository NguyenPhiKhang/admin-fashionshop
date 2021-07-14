import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormGroup,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import jwtAuthService from 'src/services/jwtAuthService'
import swal from 'sweetalert'
import { setUserData } from 'src/redux/actions/UserAction'
import { connect } from 'react-redux'
import { PropTypes } from "prop-types";


const Login = (props) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkLogin = async () => {
      const data = await jwtAuthService.loginWithToken();
      console.log(data)
      if (data.success === 1) {
        props.setUserData(data.data);
        history.push("/");
      }
    }

    checkLogin();
  }, []);

  const handleLoginClick = async () => {
    const data = await jwtAuthService.loginWithUsernameAndPassword(username, password);
    console.log(data)
    if (data.success === 1) {
      swal({
        title: "Đăng nhập thành công",
        // text: "Nếu đồng ý thì mọi thay đổi sẽ biến mất.",
        icon: "success",
        buttons: {
          ok: "Đồng ý",
        },
        // dangerMode: true,
      }).then((value) => {
        if (value === 'ok') {
          props.setUserData(data.data);
          history.push("/");
        }
      });
    }
  }

  const handleChangeUsername = (e) => {
    setUsername(e.target.value)
  }

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="4">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Đăng nhập</h1>
                    <p className="text-muted">Đăng nhập với tài khoản của bạn</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Username" autoComplete="username" value={username} onChange={handleChangeUsername} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Mật khẩu" autoComplete="current-password" value={password} onChange={handleChangePassword} />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4" onClick={handleLoginClick}>Đăng nhập</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
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
)(Login);
