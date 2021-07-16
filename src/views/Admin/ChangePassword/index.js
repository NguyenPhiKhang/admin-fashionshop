import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormGroup, CInput, CLabel } from '@coreui/react'
import { FastfoodOutlined } from '@material-ui/icons';
import React, { useState } from 'react'
import httpCommon from 'src/utils/http-common';
import swal from 'sweetalert';

/**
* @author
* @function ChangePassword
**/

const ChangePassword = (props) => {

  const [validateNewPassAgain, setValidateNewPassAgain] = useState({ invalid: false, valid: false });
  const [pass, setPass] = useState('')
  const [newPass, setNewPass] = useState('');
  const [againPass, setAgainPass] = useState('');


  const handleChangeNewPass = (e) => {
    setNewPass(e.target.value)
    if (e.target.value === againPass && e.target.value !== '') {
      console.log("same")
      setValidateNewPassAgain({ invalid: false, valid: true })
    } else {
      setValidateNewPassAgain({ invalid: true, valid: false })
    }
  }

  const handleChangeAgainPass = (e) => {
    setAgainPass(e.target.value)
    if (e.target.value === newPass && e.target.value !== '') {
      console.log("same")
      setValidateNewPassAgain({ invalid: false, valid: true })
    } else {
      setValidateNewPassAgain({ invalid: true, valid: false })
    }
  }

  const handleClickChange = async () => {
    if (!(validateNewPassAgain.invalid === false && validateNewPassAgain.valid === true)) {
      swal({
        title: "Vui lòng nhập đúng mật khẩu",
        // text: "Nếu đồng ý thì mọi thay đổi sẽ biến mất.",
        icon: "error",
        buttons: {
          ok: "Đồng ý",
        },
        // dangerMode: true,
      }).then((value) => {
        if (value === 'ok') {
          // loadOrderDetail();
          // props.reloadPage();
          // props.setUserData({ ...props.userData, user: { ...data } })
          // setIsEdit(false);
        }
      });
    } else {

      const response = await httpCommon.put(`/account/${props.user_id}/change-password`, { newPassword: newPass, oldPassword: pass });
      const data = await response.data;

      if (data.data === -1) {
        swal({
          title: `${data.message}`,
          // text: "Nếu đồng ý thì mọi thay đổi sẽ biến mất.",
          icon: "error",
          buttons: {
            ok: "Đồng ý",
          },
          // dangerMode: true,
        }).then((value) => {
          if (value === 'ok') {
            // loadOrderDetail();
            // props.reloadPage();
            // props.setUserData({ ...props.userData, user: { ...data } })
            // setIsEdit(false);
          }
        });
      } else {
        swal({
          title: `${data.message}`,
          // text: "Nếu đồng ý thì mọi thay đổi sẽ biến mất.",
          icon: "success",
          buttons: {
            ok: "Đồng ý",
          },
          // dangerMode: true,
        }).then((value) => {
          if (value === 'ok') {
            setNewPass('')
            setPass('')
            setAgainPass('')
            setValidateNewPassAgain({ invalid: false, valid: false });
          }
        });
      }
    }
  }

  return (
    <CForm>
      <CCol xs="12" >
        <CCard>
          <CCardBody>
            <CFormGroup>
              <CLabel htmlFor="current-pass">Mật khẩu hiện tại</CLabel>
              <CInput type="password" autoComplete="current-pass" style={{ padding: 10, height: 'auto' }} id="current-pass" name="current-pass"
                placeholder="Nhập mật khẩu hiện tại"
                value={pass}
                onChange={(e) => { setPass(e.target.value) }}
              />
            </CFormGroup>
            <CFormGroup>
              <CLabel htmlFor="new-pass">Mật khẩu mới</CLabel>
              <CInput
                type="password" autoComplete="new-pass"
                style={{ padding: 10, height: 'auto' }}
                id="new-pass" name="new-pass"
                placeholder="Nhập mật khẩu mới"
                value={newPass}
                onChange={handleChangeNewPass} />
            </CFormGroup>
            <CFormGroup>
              <CLabel htmlFor="again-pass">Nhập lại mật khẩu mới</CLabel>
              <CInput
                type="password" autoComplete="again-pass"
                invalid={validateNewPassAgain.invalid}
                valid={validateNewPassAgain.valid}
                style={{ padding: 10, height: 'auto' }}
                id="again-pass" name="again-pass" placeholder="Nhập lại mật khẩu mới"
                value={againPass}
                onChange={handleChangeAgainPass}
              />
            </CFormGroup>
            <CFormGroup>
              <CButton block color="info" onClick={handleClickChange}>Thay đổi</CButton>
            </CFormGroup>
          </CCardBody>
        </CCard>
      </CCol>
    </CForm>
  )

}

export default ChangePassword