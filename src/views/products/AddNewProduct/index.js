import React, { useEffect, useState } from 'react'
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
  CInputCheckbox,
  CInputRadio,
  CLabel,
  CSelect,
  CRow,
  CSwitch,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'

import swal from 'sweetalert';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import { getBase64 } from 'src/redux/const/ImageConst';
import Modal from 'src/components/Modal/Modal';

const AddNewProduct = () => {
  const [collapsed, setCollapsed] = useState(true)
  const [showElements, setShowElements] = useState(true)
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [radioCategory, setRadioCategory] = useState(16);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [isImageOption, setIsImageOption] = useState(true);
  const [isOption, setIsOption] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState({ visible: false, image: '', title: '' });
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

  useEffect(() => {
    loadBrand();
    loadSubCategories();
    loadColor();
    loadSize();
  }, [radioCategory])

  const loadBrand = async () => {
    const response = await axios.get("http://localhost:8080/api/v1/brand/get-all");
    const data = await response.data;
    setBrands(data);
  };

  const loadSubCategories = async () => {
    const response = await axios.get(`http://localhost:8080/api/v1/categories/${radioCategory}/sub-categories`);
    const data = await response.data;
    let subCategoriesNew = [];
    updateDataSubCategories(data, subCategoriesNew);
    setSubCategories(subCategoriesNew);
  }

  const loadColor = async () => {
    const response = await axios.get(`http://localhost:8080/api/v1/option-varchar/80/get-by-attr`);
    const data = await response.data;
    setColors(data);
  }

  const loadSize = async () => {
    const response = await axios.get("http://localhost:8080/api/v1/option-varchar/164/get-by-attr");
    const data = await response.data;
    setSizes(data);
  }

  const updateDataSubCategories = (data, subCategoriesNew) => {
    data.map(v => {
      if (v.categories.length === 0) {
        subCategoriesNew.push(v);
      } else {
        updateDataSubCategories(v.categories, subCategoriesNew);
      }
    })

  }

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(e.target)
    swal("Here's the title!", "...and here's the text!");
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

  const handleCancel = () => setPreview({ visible: false });

  const handlePreview = async file => {
    if (!file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreview({
      image: file.preview,
      visible: true,
      title: file.filename.name,
    });
  };

  const handleDeleteImage = (index) => {
    let files = [...fileList];
    files.splice(index, 1);
    setFileList(files);
  }

  return (
    <>
      <CForm className="form-horizontal" onSubmit={(e) => { onSubmit(e) }}>
        <CRow>
          <CCol xs="12" md="7">
            <CCard>
              <CCardHeader>
                <h3>Thêm sản phẩm</h3>
              </CCardHeader>
              <CCardBody>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="name">Tên sản phẩm</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="name" name="name" placeholder="Nhập tên..." />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="description">Mô tả</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CTextarea
                      name="description"
                      id="description"
                      rows="5"
                      placeholder="Nhập mô tả sản phẩm..."
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="short_description">Mô tả ngắn gọn</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CTextarea
                      name="short_description"
                      id="short_description"
                      rows="3"
                      placeholder="Nhập mô tả ngắn gọn..."
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="highlight">Điểm nổi bật</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CTextarea
                      name="highlight"
                      id="highlight"
                      rows="3"
                      placeholder="Nhập điểm nổi bật..."
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="discount">Giảm giá(%)</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput type="number" id="discount" name="discount" max={100} min={0} placeholder="Nhập giảm giá..." defaultValue={0} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol tag="label" sm="3" className="col-form-label">
                    <CLabel htmlFor="free_ship">Miễn phí vận chuyển</CLabel>
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      id="free_ship"
                      name="free_ship"
                      className="mr-1"
                      color="primary"
                      defaultChecked
                      shape="pill"
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel>Danh mục</CLabel>
                  </CCol>
                  <CCol md="9" onChange={(e) => { setRadioCategory(e.target.value) }}>
                    <CFormGroup variant="custom-radio" inline>
                      <CInputRadio custom id="radio-ttnam" name="inline-radios" value={16} defaultChecked />
                      <CLabel variant="custom-checkbox" htmlFor="radio-ttnam">Thời trang nam</CLabel>
                    </CFormGroup>
                    <CFormGroup variant="custom-radio" inline>
                      <CInputRadio custom id="radio-ttnu" name="inline-radios" value={17} />
                      <CLabel variant="custom-checkbox" htmlFor="radio-ttnu">Thời trang nữ</CLabel>
                    </CFormGroup>
                    <CFormGroup variant="custom-radio" inline>
                      <CInputRadio custom id="radio-lamdep" name="inline-radios" value={324} />
                      <CLabel variant="custom-checkbox" htmlFor="radio-lamdep">Làm đẹp</CLabel>
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="sub_cateogires">Danh mục con</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CSelect custom name="sub-categories" id="sub-cateogories">

                      <option value="0" key={0}>Chọn danh mục con</option>
                      {
                        subCategories.map(v => <option value={v.id} key={v.id}>{v.name}</option>)
                      }
                    </CSelect>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="brand">Thương hiệu</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CSelect custom name="brand" id="brand">

                      <option value="0" key={0}>Chọn thương hiệu</option>
                      {
                        brands.map(v => <option value={v.id} key={v.id}>{v.name}</option>)
                      }
                    </CSelect>
                  </CCol>
                </CFormGroup>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs="12" sm="5">
            <CCard>
              <CCardHeader>
                Thuộc tính sản phẩm
              </CCardHeader>
              <CCardBody>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="material">Chất liệu</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="material" name="material" placeholder="Nhập chất liệu" />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="style">Kiểu dáng</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="style" name="style" placeholder="Nhập kiểu dáng" />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="purpose">Mục đích sử dụng</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="purpose" name="purpose" placeholder="Nhập mục đích sử dụng" />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="season">Mùa phù hợp</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="season" name="season" placeholder="Nhập kiểu dáng" />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="madein">Xuất xứ</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="madein" name="madein" placeholder="Nhập xuất xứ" />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol tag="label" sm="3" className="col-form-label">
                    <CLabel htmlFor="is_option">Có option</CLabel>
                  </CCol>
                  <CCol sm="9">
                    <CSwitch
                      id="is_option"
                      name="is_option"
                      className="mr-1"
                      color="primary"
                      shape="pill"
                      checked={isOption}
                      onChange={() => {
                        setIsOption(!isOption)
                      }}
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row className="my-0" style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', borderRadius: 5, display: isOption ? 'flex' : 'none' }}>
                  <CCol xs="3">
                    <CFormGroup>
                      <CLabel htmlFor="color">Màu sắc</CLabel>
                      <CSelect custom name="color" id="color">

                        <option value="0" key={0}>Chọn</option>
                        {
                          colors.map(v => <option value={v.id} key={v.id}>{v.value}</option>)
                        }
                      </CSelect>
                    </CFormGroup>
                  </CCol>
                  <CCol xs="3" >
                    <CFormGroup>
                      <CLabel htmlFor="size">Kích thước</CLabel>
                      <CSelect custom name="size" id="size">

                        <option value="0" key={0}>Chọn</option>
                        {
                          sizes.map(v => <option value={v.id} key={v.id}>{v.value}</option>)
                        }
                      </CSelect>
                    </CFormGroup>
                  </CCol>
                  <CCol xs="3" >
                    <CFormGroup>
                      <CLabel htmlFor="quantity">Số lượng</CLabel>
                      <CInput type="number" id="quantity" placeholder="Nhập SL" />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="3">
                    <CFormGroup>
                      <CLabel htmlFor="price">Đơn giá</CLabel>
                      <CInput type="number" id="price" placeholder="Nhập giá" />
                    </CFormGroup>
                  </CCol>
                  <CCol xs="12">
                    <CFormGroup>
                      <CInputFile
                        id="file-multiple-input"
                        name="file-multiple-input"
                        multiple
                        custom
                        hidden
                        onChange={fileChanged}
                      />
                      <CLabel htmlFor="images">Ảnh</CLabel>
                      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                        <CButton variant="outline" color="dark" style={{ width: 80, height: 80 }} onClick={() => { document.getElementById("file-multiple-input").click() }}>
                          <CIcon name="cil-plus" size="lg" /><br /><small>Thêm ảnh</small>
                        </CButton>
                        {
                          fileList.map((file, index) => {
                            return (
                              <div key={index} style={{
                                width: 150, height: 80, display: 'flex', justifyContent: 'space-between',
                                marginLeft: 8, border: '1px solid #e6e6e6', padding: 5
                              }}>
                                <img alt="select" style={{ width: 80, height: '100%' }} src={file.preview} onClick={() => { handlePreview(file) }} />
                                <CButton className="button-delete-image" onClick={() => { handleDeleteImage(index) }}
                                  style={{ width: 20, height: '100%', border: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                  <RemoveCircleOutlineOutlinedIcon style={{ color: '#ff8080' }} />
                                </CButton>
                              </div>
                            );
                          })
                        }
                        <Modal title={preview.title} onClose={handleCancel} show={preview.visible}>
                          <img alt="image_product" style={{ width: '100%' }} src={preview.image} />
                        </Modal>
                      </div>
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
              </CCardBody>
              <CCardFooter>
                <CButton type="submit" size="sm" color="primary"><CIcon name="cil-scrubber" /> Submit</CButton>
                <CButton type="reset" size="sm" color="danger"><CIcon name="cil-ban" /> Reset</CButton>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CForm>
    </>
  )
}

export default AddNewProduct
