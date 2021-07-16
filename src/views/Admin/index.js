import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CTextarea,
  CInput,
  CInputFile,
  CInputRadio,
  CLabel,
  CSelect,
  CRow,
  CSwitch,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CInputGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { PropTypes } from "prop-types";
import { logoutUser, setUserData } from 'src/redux/actions/UserAction';
import { connect } from 'react-redux';
import { CloudUpload } from '@material-ui/icons';
import { FormControl, FormControlLabel, Radio, RadioGroup, Button } from '@material-ui/core';
import http from 'src/utils/http-common';
import { getBase64 } from 'src/utils/ImageConst';
import ChangePassword from './ChangePassword';


/**
* @author
* @function InfoAdmin
**/

const InfoAdmin = (props) => {

  const [info, setInfo] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [address, setAddress] = useState({ province: { id: 0, name: '' }, district: { id: 0, name: '' }, ward: { id: 0, name: '' }, specificAddress: '', id: 0 });
  const [province, setProvince] = useState([])
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [fileList, setFileList] = useState([{ value: '', filename: null }]);
  const [fileInput, setFileInput] = useState([]);
  const [isChangeImage, setIsChangeImage] = useState(false);

  const [invalidDistrict, setInvalidDistrict] = useState(false);
  const [invalidWard, setInavalidWard] = useState(false);
  const [invalidProvince, setInavalidProvince] = useState(false);

  const [modalAction, setModalAction] = useState({ visible: false })

  useEffect(() => {
    const LoadProvince = async () => {
      const response = await http.get("/province/get-all");
      const data = response.data;

      setProvince(data);
    }
    LoadProvince();
    console.log("user data in admin change")
    setInfo(props.userData.user);
    if (props.userData.user.address !== null) {
      setAddress(props.userData.user.address)
    }

    setFileList([{ value: props.userData.user.image_url, filename: null }])

    // console.log(props.userData.sex)
  }, [props.userData.user]);

  useEffect(() => {
    const loadDistrict = async () => {

      if (address.province.id.toString() !== "0") {
        const response = await http.get(`/province/${address.province.id}/get-districts`);
        const data = response.data;

        setDistrict(data);
      } else {
        setDistrict([])
      }
    }

    loadDistrict();

  }, [address.province.id])


  useEffect(() => {
    if (props.userData.user.address === null) {
      if (address.province.id.toString() !== "0") {
        if (address.district.id.toString() === "0")
          setInvalidDistrict(true);
        else setInvalidDistrict(false);

        if (address.ward.id.toString() === "0")
          setInavalidWard(true);
        else setInavalidWard(false);
      }
      else {
        setInavalidWard(false);
        setInvalidDistrict(false);
        setInavalidProvince(false);
      }
    } else {
      if (address.province.id.toString() === "0")
        setInavalidProvince(true);
      else setInavalidProvince(false);
      if (address.district.id.toString() === "0")
        setInvalidDistrict(true);
      else setInvalidDistrict(false);

      if (address.ward.id.toString() === "0")
        setInavalidWard(true);
      else setInavalidWard(false);
    }

  }, [address.district.id, address.ward.id, address.province.id])


  useEffect(() => {
    const loadWard = async () => {

      console.log("district change")

      if (address.district.id.toString() !== "0") {
        const response = await http.get(`/province/district/${address.district.id}/get-wards`);
        const data = response.data;

        setWard(data);
      } else {
        setWard([]);
      }
    }

    loadWard();
  }, [address.district.id])


  const onSubmit = (e) => {
    e.preventDefault();
    console.log(e.target)
    swal("Here's the title!", "...and here's the text!");
  }

  const handleClickEdit = () => {
    setIsEdit(prev => !prev);
  }

  const handleClickCancel = () => {
    setIsEdit(prev => !prev);
    setInfo(props.userData.user);
    if (props.userData.user.address !== null) {
      setAddress(props.userData.user.address)
    } else {
      setAddress({ province: { id: 0, name: '' }, district: { id: 0, name: '' }, ward: { id: 0, name: '' }, specificAddress: '', id: 0 })
    }

    setFileList([{ value: props.userData.user.image_url }])
  }

  const handleChangeInfo = (value) => {
    setInfo(prev => ({ ...prev, ...value }));
  }

  const handleChangeProvince = (e) => {
    setAddress(prev => ({ ...prev, province: { ...prev.province, id: e.target.value }, district: { ...prev.district, id: 0 }, ward: { ...prev.ward, id: 0 } }))
  }

  const handleChangeDistrict = (e) => {
    setAddress(prev => ({ ...prev, district: { ...prev.district, id: e.target.value }, ward: { ...prev.ward, id: 0 } }))
  }

  const handleChangeWard = (e) => {
    setAddress(prev => ({ ...prev, ward: { ...prev.ward, id: e.target.value } }))
  }

  const handleChangeSpecificAddress = (e) => {
    setAddress(prev => ({ ...prev, specificAddress: e.target.value }))
  }

  const fileChanged = async (event) => {
    // setLoadingImage(true);
    let files = [];
    for (let i = 0; i < event.target.files.length; i++) {
      files.push(event.target.files[i]);
    }
    const filess = await Promise.all(files.map(async f => {
      const preview = await getBase64(f);
      return { filename: await f, value: await preview };
    }));
    setFileList(filess);
    // setFileInput(event.target.files)

    // setLoadingImage(false);
  }

  const handleClickSave = async (e) => {
    if (invalidDistrict || invalidWard || invalidProvince) {
      swal({
        title: "Vui lòng nhập đầy đủ",
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


      const infoSave = { id: info.id, name: info.name, birthday: info.birthday, sex: info.sex, phoneNumber: info.phoneNumber }
      const addressSave = { id: address.id, name: address.name, ward: { id: address.ward.id }, defaultIs: address.defaultIs, specificAddress: address.specificAddress, numberPhone: address.numberPhone }

      console.log(addressSave)
      const formData = new FormData();
      formData.append("id", info.id);
      formData.append("name", info.name);
      formData.append("birthday", info.birthday);
      formData.append("sex", info.sex);
      formData.append("phoneNumber", info.phoneNumber);
      formData.append("email", info.email);
      if (fileList[0].filename !== null) formData.append("image", fileList[0].filename)

      const responseAddress = await http.put("/address/update", addressSave);
      const dataAddress = await responseAddress.data;

      const response = await http.put("/user/update", formData);
      const data = await response.data;

      swal({
        title: "Cập nhật thành công",
        // text: "Nếu đồng ý thì mọi thay đổi sẽ biến mất.",
        icon: "success",
        buttons: {
          ok: "Đồng ý",
        },
        // dangerMode: true,
      }).then((value) => {
        if (value === 'ok') {
          // loadOrderDetail();
          // props.reloadPage();
          props.setUserData({ ...props.userData, user: { ...data } })
          setIsEdit(false);
        }
      });
    }
  }

  const toggleAction = () => {
    setModalAction(prev => ({ visible: !prev.visible }))
  }


  return (
    <CForm className="form-horizontal" >
      <CRow>
        <CCol xs="12" sm="12" md="12">
          <h3 style={{ marginBottom: 20, fontWeight: "bold" }}>Thông tin cá nhân</h3>
        </CCol>
        <CCol xs="12" md="4" xl="4">
          <CCard>
            <CCardBody className="card-admin-component">
              <div className="card-header-admin">
                <img className="image-admin-component" src={fileList[0].value} alt="User pic" />
              </div>
              <div className="card-body-admin">
                <h5 className="card-name-admin">{info.name}</h5>
                <div className="card-text-admin">
                  <p style={{ margin: 0 }}>ID: {info.id}</p>
                  <p>{info.email}</p>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                    <CInputFile
                      id={`file-input-info`}
                      name={`file-input-info`}
                      custom
                      hidden
                      value={fileInput}
                      onChange={(e) => { fileChanged(e) }}
                    />
                    <Button
                      disabled={!isEdit}
                      variant="contained"
                      color="primary"
                      startIcon={<CloudUpload />}
                      style={{ textTransform: 'none' }}
                      onClick={() => { document.getElementById(`file-input-info`).click() }}
                    >
                      Thay đổi ảnh
                    </Button>
                  </div>
                  {/* <CButton block variant="outline" color="info">Xem chi tiết</CButton> */}
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs="12" md="8" xl="8">
          <CCard>
            <CCardHeader>
              <p style={{ fontSize: 15, fontWeight: "bold", marginBottom: 0 }}>Thông tin chung</p>
            </CCardHeader>
            <CCardBody>
              <CFormGroup row>
                <CCol xs="12" sm="12">
                  <CCol md="12">
                    <CLabel htmlFor="name-info">Họ và tên</CLabel>
                  </CCol>
                  <CCol xs="12" md="12">
                    <CInput className="disable-detail" disabled={!isEdit} style={{ padding: 10, height: 'auto' }} id="name-info" name="name-info" placeholder="Nhập tên..." value={info.name} onChange={(e) => { handleChangeInfo({ name: e.target.value }) }} />
                  </CCol>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol xs="12" sm="12" md="12">
                  <CCol md="12">
                    <CLabel htmlFor="phone-info">Số điện thoại</CLabel>
                  </CCol>
                  <CCol xs="12" md="12">
                    <CInput className="disable-detail" disabled={!isEdit} style={{ padding: 10, height: 'auto' }} id="phone-info" name="phone-info" placeholder="+1234567890" value={info.phoneNumber} onChange={(e) => { handleChangeInfo({ phoneNumber: e.target.value }) }} />
                  </CCol>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol xs="12" sm="6">
                  <CCol md="12">
                    <CLabel htmlFor="name">Ngày sinh</CLabel>
                  </CCol>
                  <CCol xs="12" md="12">
                    <CInput className="disable-detail" disabled={!isEdit} style={{ padding: 10, height: 'auto' }} type="date" id="date-info" value={info.birthday} onChange={(e) => { handleChangeInfo({ birthday: e.target.value }) }} />
                  </CCol>
                </CCol>
                <CCol xs="12" sm="6">
                  <CCol>
                    <CLabel htmlFor="sex-info">Giới tính</CLabel>
                  </CCol>
                  <CCol xs="7" md="7" lg="7">
                    <CFormGroup row>
                      <CCol>
                        <CSelect value={info.sex} className="disable-detail" disabled={!isEdit} custom name="sex-info" id="sex-info" style={{ padding: 10, height: 'auto' }}>
                          <option value={null} key={0}>Chọn</option>
                          <option value="nam" key={1}>Nam</option>
                          <option value="nu" key={2}>Nữ</option>
                        </CSelect>
                      </CCol >
                    </CFormGroup>
                  </CCol>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol xs="12" sm="12" md="12">
                  <CCol md="12">
                    <CLabel htmlFor="phone-info">Địa chỉ</CLabel>
                  </CCol>
                  <CCol xs="12" md="12">
                    <CFormGroup row>
                      <CCol xs="12" md="4" lg="4">
                        <CSelect className="disable-detail" disabled={!isEdit} custom name="province-info" id="province-info"
                          style={{ padding: 10, height: 'auto' }}
                          value={address.province.id}
                          onChange={handleChangeProvince}
                          invalid={invalidProvince}
                        >

                          <option value="0" key={0}>Tỉnh</option>
                          {
                            province.map(v => <option value={v.id} key={v.id}>{v.name}</option>)
                          }
                        </CSelect>
                      </CCol >
                      <CCol xs="12" md="4" lg="4">
                        <CSelect invalid={invalidDistrict} className="disable-detail" disabled={!isEdit} custom name="district-info" id="district-info"
                          style={{ padding: 10, height: 'auto' }}
                          value={address.district.id}
                          onChange={handleChangeDistrict}
                        >

                          <option value="0" key={0}>Quận/ Huyện</option>
                          {
                            district.map(v => <option value={v.id} key={v.id}>{v.name}</option>)
                          }
                        </CSelect>
                      </CCol>
                      <CCol xs="12" md="4" lg="4">
                        <CSelect className="disable-detail" disabled={!isEdit} custom name="ward-info" id="ward-info"
                          style={{ padding: 10, height: 'auto' }}
                          value={address.ward.id}
                          onChange={handleChangeWard}
                          invalid={invalidWard}
                        >

                          <option value="0" key={0}>Phường/ Xã</option>
                          {
                            ward.map(v => <option value={v.id} key={v.id}>{v.name}</option>)
                          }
                        </CSelect>
                      </CCol>
                      <CCol xl="12" style={{ marginTop: 15 }}>
                        <CInput value={address.specificAddress} onChange={handleChangeSpecificAddress} className="disable-detail" disabled={!isEdit} style={{ padding: 10, height: 'auto' }} id="address-info" name="address-info" placeholder="Nhập địa chỉ cụ thể..." />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol>
                  <CCol style={{ display: 'flex' }}>
                    <CButton block color="info" style={{ display: isEdit ? "none" : "inline", width: 150, padding: 10, height: 'auto', fontSize: 15, fontWeight: 600 }} onClick={handleClickEdit}>Sửa thông tin</CButton>
                    <CButton block color="primary" style={{ display: isEdit ? "inline" : "none", width: 150, padding: 10, height: 'auto', fontSize: 15, fontWeight: 600, marginTop: 0 }} onClick={handleClickSave}>Lưu thay đổi</CButton>
                    <CButton block color="danger" style={{ display: isEdit ? "inline" : "none", width: 150, padding: 10, height: 'auto', fontSize: 15, fontWeight: 600, marginLeft: 5, marginTop: 0 }} onClick={handleClickCancel}>Huỷ</CButton>
                  </CCol>
                </CCol>
              </CFormGroup>
              <CFormGroup>
                <CCol>
                  <hr className="my-5-info" />
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol sx="12" sm="12" md="6">
                  <CCol>
                    <div className="box-password" style={{ display: "flex", justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 7 }}>Mật khẩu</p>
                        <label>Có thể reset hoặc thay đổi mật khẩu</label>
                      </div>
                      <div>
                        <CButton block variant="outline" color="dark" onClick={toggleAction}>Đổi</CButton>
                      </div>
                    </div>
                  </CCol>

                </CCol>
              </CFormGroup>
              <CModal
                scrollable
                show={modalAction.visible}
                onClose={toggleAction}
                className="inactive-modal"
                centered
              >
                <CModalHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CModalTitle>Thay đổi mật khẩu</CModalTitle>
                  <CButton onClick={toggleAction}><CIcon name='cil-x' size="sm" /></CButton>
                </CModalHeader>
                <CModalBody>
                    <ChangePassword user_id={info.id}/>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={toggleAction}>Đóng</CButton>
                </CModalFooter>
              </CModal>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CForm>
  )

}

const mapStateToProps = state => ({
  setUserData: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  userData: state.user
});


export default connect(
  mapStateToProps,
  { setUserData, logoutUser }
)(InfoAdmin);