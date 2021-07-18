import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CInput,
  CFormGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CLabel,
  CInputGroup,
  CInputFile,
} from '@coreui/react'
import { useEffect, useState } from 'react';

import http from 'src/utils/http-common';
import CategoriesComponent from 'src/components/Categories';
import { getBase64 } from 'src/utils/ImageConst';
import CIcon from '@coreui/icons-react';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import { DeleteOutline } from '@material-ui/icons';

import swal from 'sweetalert';



const EditBrand = (props) => {


  const [attrBrand, setAttrBrand] = useState({
    id: 0, name: ''
  });

  const [expanded, setExpanded] = useState([]);

  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState({ visible: false, image: '', title: '' });
  const [loadingImage, setLoadingImage] = useState(false);
  const [modeView, setModeView] = useState("");


  useEffect(() => {
    const loadBrandDetail = async () => {
      if (typeof (props.brandId) === "number" && props.brandId !== -1 && props.brandId !== 0) {
        const response = await http.get(`/brand/${props.brandId}`);
        const data = await response.data;
        if (data === null || data === '' || typeof (data) === "undefined")
          return;
        setAttrBrand(prev => ({ ...prev, id: data.id, name: data.name }));

        setFileList([{ id: data.id, value: data.icon, filename: null }])
      }
    }

    loadBrandDetail();

    setModeView(props.mode)

  }, [props.brandId, props.mode])


  const handleChangeAttrBrand = (attribute) => {
    setAttrBrand(prev => ({ ...prev, ...attribute }));
  }

  const fileChanged = async (event) => {
    setLoadingImage(true);
    let files = [];
    for (let i = 0; i < event.target.files.length; i++) {
      files.push(event.target.files[i]);
    }
    const filess = await Promise.all(files.map(async f => {
      const preview = await getBase64(f);
      return { filename: await f, preview: await preview };
    }));
    setFileList(filess);

    setLoadingImage(false);
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

  const handleCancel = () => setPreview({ visible: false });

  const handleChangeMode = new_mode => {
    setModeView(new_mode);
    props.handleChangeTitle("edit");
  }

  const handleSaveChange = async (e) => {

    const formData = new FormData();
    formData.append("name", attrBrand.name);
    formData.append("id", attrBrand.id)
    if (fileList[0].filename !== null) formData.append("icon", fileList[0].filename);

    const response = await http.post("/brand/create-new", formData);
    const data = await response.data;

    swal({
      title: `${data}`,
      // text: "Nếu đồng ý thì mọi thay đổi sẽ biến mất.",
      icon: "success",
      buttons: {
        ok: "Đồng ý",
      },
      // dangerMode: true,
    }).then((value) => {
      if (value === 'ok') {
        // loadOrderDetail();
        props.reloadPage();
      }
    });
  }

  const handleDeleteBrand = (e) => {
    e.preventDefault();
    swal({
      title: "Bạn muốn xoá thương hiệu này?",
      // text: "Nếu đồng ý thì mọi thay đổi sẽ biến mất.",
      icon: "warning",
      buttons: {
        ok: "Đồng ý",
        cancel: "Huỷ"
      },
      // dangerMode: true,
    }).then( async (value) => {
      if (value === 'ok') {
        const response = await http.delete(`/brand/${attrBrand.id}/delete`);
        const data = await response.data;


        if(data.data===1){
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
              // loadOrderDetail();
              props.reloadPage();
              props.closeModal();
            }
          });
        }else{
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
            }
          });
        }
      }
    });
  }

  return (
    <>
      <CFormGroup className="form-horizontal">
        <CRow>
          <CCol>
            <CCard>
              <CCardBody>
                <CFormGroup row style={{ marginBottom: 30 }}>
                  <CCol md="12" >
                    <CLabel htmlFor="id">ID</CLabel>
                  </CCol>
                  <CCol xs="12">
                    <CInput disabled id="id" name="id" placeholder="" value={attrBrand.id} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row style={{ marginBottom: 30 }}>
                  <CCol xs="12">
                    <CLabel htmlFor="brand">Tên thương hiệu</CLabel>
                  </CCol>
                  <CCol xs="12">
                    <CInput disabled={modeView === "edit" ? false : true} className="disable-detail" style={{ padding: 10, height: 'auto' }} size="normal" id="name-category-edit" name="name-category-edit" placeholder="Nhập tên danh mục..." value={attrBrand.name} onChange={(e) => { handleChangeAttrBrand({ name: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup style={{ marginBottom: 30 }}>
                  <CInputFile
                    id={`file-input`}
                    name={`file-input`}
                    custom
                    hidden
                    value={[]}
                    onChange={(e) => { fileChanged(e) }}
                  />
                  <CLabel htmlFor="images">Icon</CLabel>
                  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                    <CButton className="btn-image-plus" variant="outline" color="dark" style={{ width: 80, height: 80, display: modeView === "edit" ? "inline" : "none" }} onClick={() => { document.getElementById(`file-input`).click() }}>
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
                            <CButton disabled={modeView === "edit" ? false : true} className="button-delete-image" onClick={() => { handleDeleteImage(index) }}
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
                  <CButton style={{ display: modeView === "detail" ? "inline" : "none", marginRight: 10 }} type="button" size="sm" color="info" onClick={() => { handleChangeMode("edit") }}><CIcon name="cil-pen" style={{ paddingRight: 2 }} />Sửa sản phẩm</CButton>
                  <CButton style={{ display: modeView === "detail" ? "none" : "inline", marginRight: 10 }} type="button" size="sm" color="primary" onClick={(e) => { handleSaveChange(e) }}><CIcon name="cil-save" style={{ paddingRight: 2 }} />Lưu lại</CButton>
                  <CButton style={{ display: modeView === "detail" ? "none" : "inline", marginRight: 10 }} type="button" size="sm" color="danger" onClick={(e) => { handleDeleteBrand(e) }}>
                    <DeleteOutline style={{ paddingRight: 2, fontSize: 22 }} />
                    Xoá sản phẩm</CButton>
                </CFormGroup>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CFormGroup>
    </>
  )
}

EditBrand.defaultProps = {
  mode: 'detail',
  brandId: 0
}

export default EditBrand