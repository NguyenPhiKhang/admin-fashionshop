import React, { useState } from 'react'

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CInput,
  CFormGroup,
  CSelect,
  CCardFooter,
  CPagination,
  CLabel,
  CInputFile
} from '@coreui/react'


import swal from 'sweetalert';
import { getBase64 } from 'src/utils/ImageConst';
import http from 'src/utils/http-common';
import CIcon from '@coreui/icons-react';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';

/**
* @author
* @function AddNewBrand
**/

const AddNewBrand = (props) => {

  const [attrBrand, setAttrBrand] = useState({ name: '' });
  const [fileList, setFileList] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [preview, setPreview] = useState({ visible: false, image: '', title: '' });

  const fileChanged = async (event) => {
    setLoadingImage(true);
    let files = [];
    for (let i = 0; i < event.target.files.length; i++) {
      files.push(event.target.files[i]);
    }
    const filess = await Promise.all(files.map(async f => {
      const preview = await getBase64(f);
      return { filename: await f, value: await preview };
    }));
    setFileList(filess);

    setLoadingImage(false);
  }

  const handleChangeAttrBrand = (attribute) => {
    setAttrBrand(prev => ({ ...prev, ...attribute }));
  }

  const handlePreview = async file => {
    if (!file.value) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreview({
      image: file.value,
      visible: true,
      title: file.id,
    });
  };

  const handleDeleteImage = (index) => {
    let files = [...fileList];
    files.splice(index, 1);

    setFileList(files);
  }

  const handleReload = (e) => {
    e.preventDefault();
    swal({
      title: "Bạn muốn làm mới?",
      text: "Nếu đồng ý thì mọi thay đổi sẽ biến mất.",
      icon: "warning",
      buttons: {
        ok: "Đồng ý",
        cancel: "Huỷ"
      },
      // dangerMode: true,
    }).then((value) => {
      if (value === 'ok') {
        setAttrBrand({name:''})
        setFileList([]);
      }
    });
  }

  const handleCancel = () => setPreview({ visible: false });

  return (
    <>
      <CFormGroup className="form-horizontal">
        <CRow>
          <CCol>
            <CCard>
              <CCardBody>
                <CFormGroup row style={{ marginBottom: 30 }}>
                  <CCol xs="12">
                    <CLabel htmlFor="brand">Tên thương hiệu</CLabel>
                  </CCol>
                  <CCol xs="12">
                    <CInput className="disable-detail" style={{ padding: 10, height: 'auto' }} size="normal" id="name-brand-add" name="name-brand-add" placeholder="Nhập tên thương hiệu..." value={attrBrand.name} onChange={(e) => { handleChangeAttrBrand({ name: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup style={{ marginBottom: 30 }}>
                  <CInputFile
                    id={`file-input-add`}
                    name={`file-input-add`}
                    custom
                    hidden
                    onChange={(e) => { fileChanged(e) }}
                  />
                  <CLabel htmlFor="images">Icon</CLabel>
                  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                    <CButton className="btn-image-plus" variant="outline" color="dark" style={{ width: 80, height: 80 }} onClick={() => { document.getElementById(`file-input-add`).click() }}>
                      <CIcon name="cil-plus" size="lg" /><br /><small>Thêm ảnh</small>
                    </CButton>
                    {
                      fileList.map((file, index) => {
                        console.log(file)
                        return (
                          <div key={index} style={{
                            width: 100, height: 80, display: 'flex', justifyContent: 'space-between',
                            marginLeft: 8, border: '1px solid #e6e6e6', padding: 5
                          }}>
                            <img className="img-thumbnail-table" alt="select" style={{ width: 60, height: '100%' }} src={file.value} onClick={() => { handlePreview(file) }} />
                            <CButton className="button-delete-image" onClick={() => { handleDeleteImage(index) }}
                              style={{ width: 24, height: '100%', border: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <RemoveCircleOutlineOutlinedIcon style={{ color: '#ff8080' }} />
                            </CButton>
                          </div>
                        );
                      })
                    }
                    <CModal
                      scrollable
                      show={preview.visible}
                      onClose={handleCancel}
                    // color="info"
                    >
                      <CModalHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <CModalTitle>{preview.title}</CModalTitle>
                        <CButton onClick={handleCancel}><CIcon name='cil-x' size="sm" /></CButton>
                      </CModalHeader>
                      <CModalBody>
                        <img alt="image_product" style={{ width: '100%' }} src={preview.image} />
                      </CModalBody>
                      <CModalFooter>
                        <CButton color="secondary" onClick={handleCancel}>Đóng</CButton>
                      </CModalFooter>
                    </CModal>
                  </div>
                </CFormGroup>
                <CFormGroup>
                  <CButton type="submit" size="sm" color="primary" style={{ marginRight: 10 }}><CIcon name="cil-save" style={{ paddingRight: 2 }} />Thêm</CButton>
                  <CButton type="reset" size="sm" color="dark" style={{ marginRight: 10 }} onClick={(e) => { handleReload(e) }}><CIcon name="cil-reload" style={{ paddingRight: 2 }} />Làm mới</CButton>
                </CFormGroup>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CFormGroup>
    </>
  )
}

export default AddNewBrand