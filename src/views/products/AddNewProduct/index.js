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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'

import swal from 'sweetalert';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import { getBase64 } from 'src/utils/ImageConst';

const AddNewProduct = props => {
  const [collapsed, setCollapsed] = useState(true)
  const [showElements, setShowElements] = useState(true)
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [radioCategory, setRadioCategory] = useState(16);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [isOption, setIsOption] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState({ visible: false, image: '', title: '' });
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [isColor, setIsColor] = useState(true);
  const [isSize, setIsSize] = useState(true);
  const [listOptions, setListOptions] = useState([{ id: 1, color: 0, size: 0, price: 0, quantity: 0, images: [] }]);
  const [attributes, setAttributes] = useState({
    name: '', description: '', short_description: '', highlight: '',
    discount: 0, isFreeship: false, category: 0, brand: 0,
    material: '', style: '', season: '', madein: '', purpose: ''
  })


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

    console.log(subCategories)
  }

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(e.target)
    swal("Here's the title!", "...and here's the text!");
  }

  const fileChanged = async (event, id) => {
    console.log(id)
    setLoadingImage(true);
    let files = [];
    for (let i = 0; i < event.target.files.length; i++) {
      files.push(event.target.files[i]);
    }
    const filess = await Promise.all(files.map(async f => {
      const preview = await getBase64(f);
      return { filename: await f, preview: await preview };
    }));
    // setFileList(filess);

    if (id !== 0)
      setListOptions(listOptions.map(x => (x.id === id ? { ...x, images: filess } : x)));
    else setFileList(filess);

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

  const handleDeleteImage = (id, index) => {
    if (id !== 0) {
      let option = listOptions.find(v => v.id === id);
      option.images.splice(index, 1);

      setListOptions(listOptions.map(v => v.id === id ? { ...v, ...option } : v));
    } else {
      let files = [...fileList];
      files.splice(index, 1);

      setFileList(files);
    }
  }

  const handleSetIsColor = (is_color) => {
    if (!isSize && !is_color)
      setListOptions([{ id: 1, color: 0, size: 0, price: 0, quantity: 0, images: [] }]);

    setIsColor(is_color);
  }

  const handleSetIsSize = (is_size) => {
    if (!isColor && !is_size)
      setListOptions([{ id: 1, color: 0, size: 0, price: 0, quantity: 0, images: [] }]);

    setIsSize(is_size);
  }

  const handleAddOption = () => {
    // let newListOptions = listOptions.push({ id: listOptions[listOptions.length - 1].id + 1, color: 0, size: 0, price: 0, quantity: 0, images: [] });
    setListOptions(options => options.concat({ id: listOptions[listOptions.length - 1].id + 1, color: 0, size: 0, price: 0, quantity: 0, images: [] }));
  }

  const handleDeleteOption = (id) => {
    setListOptions(listOptions.filter(v => v.id !== id));
  }

  const handleChangeOption = (id, options) => {
    setListOptions(listOptions.map(x => (x.id === id ? { ...x, ...options } : x)));
  }

  const handleChangeAtrribute = (attribute) => {
    console.log(attribute)
    setAttributes({ ...attributes, ...attribute });
    console.log(attributes)
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
        setAttributes({
          name: '', description: '', short_description: '', highlight: '',
          discount: 0, isFreeship: false, category: 0, brand: 0,
          material: '', style: '', season: '', madein: '', purpose: ''
        });
        setListOptions([{ id: 1, color: 0, size: 0, price: 0, quantity: 0, images: [] }]);
        setIsColor(true);
        setIsSize(true);
      }
    });
  }

  const optionComponent = () => {
    var components = [];
    listOptions.map((value, index) => {
      // console.log(value)
      components.push(
        <CFormGroup row key={value.id} style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', borderRadius: 5, display: isOption ? 'flex' : 'none', marginBottom: '8px' }}>
          <CCol xs="3" style={{ display: isColor ? "flex" : "none" }}>
            <CFormGroup>
              <CLabel htmlFor="color">Màu sắc</CLabel>
              <CSelect custom name="color" id="color" value={value.color} onChange={(e) => { handleChangeOption(value.id, { color: e.target.value }) }}>

                <option value="0" key={0}>Chọn</option>
                {
                  colors.map(v => <option value={v.id} key={v.id}>{v.value}</option>)
                }
              </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="3" style={{ display: isSize ? "flex" : 'none' }}>
            <CFormGroup>
              <CLabel htmlFor="size">Kích thước</CLabel>
              <CSelect custom name="size" id="size" value={value.size} onChange={(e) => { handleChangeOption(value.id, { size: e.target.value }) }}>

                <option value="0" key={0}>Chọn</option>
                {
                  sizes.map(v => <option value={v.id} key={v.id}>{v.value}</option>)
                }
              </CSelect>
            </CFormGroup>
          </CCol>
          <CCol xs="3" >
            <CFormGroup>
              <CLabel htmlFor="price">Đơn giá</CLabel>
              <CInput type="number" id="price" placeholder="Nhập giá" value={value.price} onChange={(e) => { handleChangeOption(value.id, { price: e.target.value }) }} />
            </CFormGroup>
          </CCol>
          <CCol xs="3">
            <CFormGroup>
              <CLabel htmlFor="quantity">Số lượng</CLabel>
              <CInput type="number" id="quantity" placeholder="Nhập SL" value={value.quantity} onChange={(e) => { handleChangeOption(value.id, { quantity: e.target.value }) }} />
            </CFormGroup>
          </CCol>
          <CCol xs="12" style={{ display: isColor ? "flex" : "none" }}>
            <CFormGroup>
              <CInputFile
                id={`file-multiple-input${value.id}`}
                name={`file-multiple-input${value.id}`}
                multiple
                custom
                hidden
                onChange={(e) => { fileChanged(e, value.id) }}
              />
              <CLabel htmlFor="images">Ảnh</CLabel>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                <CButton variant="outline" color="dark" style={{ width: 80, height: 80 }} onClick={() => { document.getElementById(`file-multiple-input${value.id}`).click() }}>
                  <CIcon name="cil-plus" size="lg" /><br /><small>Thêm ảnh</small>
                </CButton>
                {
                  value.images.map((file, index) => {
                    return (
                      <div key={index} style={{
                        width: 100, height: 80, display: 'flex', justifyContent: 'space-between',
                        marginLeft: 8, border: '1px solid #e6e6e6', padding: 5
                      }}>
                        <img alt="select" style={{ width: 60, height: '100%' }} src={file.preview} onClick={() => { handlePreview(file) }} />
                        <CButton className="button-delete-image" onClick={() => { handleDeleteImage(value.id, index) }}
                          style={{ width: 24, height: '100%', border: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <RemoveCircleOutlineOutlinedIcon style={{ color: '#ff8080' }} />
                        </CButton>
                      </div>
                    );
                  })
                }
                {/* <Modal title={preview.title} onClose={handleCancel} show={preview.visible}>
                  <img alt="image_product" style={{ width: '100%' }} src={preview.image} />
                </Modal> */}
                <CModal
                    scrollable
                    show={preview.visible}
                    onClose={handleCancel}
                    // color="info"
                  >
                    <CModalHeader style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <CModalTitle>{preview.title}</CModalTitle>
                      <CButton onClick={handleCancel}><CIcon name='cil-x' size="sm"/></CButton>
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
          </CCol>
          <CButton
            color="secondary"
            style={{ borderRadius: 13, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', padding: 0, position: 'absolute', right: -1, display: listOptions.length > 1 ? "flex" : "none" }}
            onClick={() => { handleDeleteOption(value.id) }}
          >
            <CIcon name='cil-x' style={{ width: 12, height: 12 }} />
          </CButton>
        </CFormGroup>
      )
    });
    return components;
  }

  return (
    <>
      <CForm className="form-horizontal" onSubmit={(e) => { onSubmit(e) }}>
        <CRow>
          <CCol xs="12" sm="6" md="7">
            <CCard>
              <CCardHeader style={{ display: props.isHeader ? "block" : "none" }}>
                <h3>Thêm sản phẩm</h3>
              </CCardHeader>
              <CCardBody>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="name">Tên sản phẩm</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="name" name="name" placeholder="Nhập tên..." value={attributes.name} onChange={(e) => { handleChangeAtrribute({ name: e.target.value }) }} />
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
                      value={attributes.description}
                      onChange={(e) => { handleChangeAtrribute({ description: e.target.value }) }}
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
                      value={attributes.short_description}
                      onChange={(e) => { handleChangeAtrribute({ short_description: e.target.value }) }}
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
                      value={attributes.highlight}
                      onChange={(e) => { handleChangeAtrribute({ highlight: e.target.value }) }}
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="discount">Giảm giá(%)</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput value={attributes.discount} onChange={(e) => { handleChangeAtrribute({ discount: e.target.value }) }} type="number" id="discount" name="discount" max={100} min={0} placeholder="Nhập giảm giá..." />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol tag="label" sm="3" className="col-form-label">
                    <CLabel style={{ marginBottom: 0 }} htmlFor="free_ship">Miễn phí vận chuyển</CLabel>
                  </CCol>
                  <CCol sm="9" style={{ display: 'flex', alignItems: 'center' }}>
                    <CSwitch
                      id="free_ship"
                      name="free_ship"
                      className={'mx-1'}
                      variant={'3d'}
                      color={'primary'}
                      // defaultChecked
                      size={'sm'}
                      checked={attributes.isFreeship}
                      onChange={(e) => { handleChangeAtrribute({ isFreeship: !attributes.isFreeship }) }} />
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
                    <CSelect custom name="sub-categories" id="sub-cateogories" value={attributes.category} onChange={(e) => { handleChangeAtrribute({ category: e.target.value }) }}>

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
                    <CSelect custom name="brand" id="brand" value={attributes.brand} onChange={(e) => { handleChangeAtrribute({ brand: e.target.value }) }}>

                      <option value="0" key={0}>Chọn thương hiệu</option>
                      {
                        brands.map(v => <option value={v.id} key={v.id}>{v.name}</option>)
                      }
                    </CSelect>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="material">Chất liệu</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="material" name="material" placeholder="Nhập chất liệu" value={attributes.material} onChange={(e) => { handleChangeAtrribute({ material: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="style">Kiểu dáng</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="style" name="style" placeholder="Nhập kiểu dáng" value={attributes.style} onChange={(e) => { handleChangeAtrribute({ style: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="purpose">Mục đích sử dụng</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="purpose" name="purpose" placeholder="Nhập mục đích sử dụng" value={attributes.purpose} onChange={(e) => { handleChangeAtrribute({ purpose: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="season">Mùa phù hợp</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="season" name="season" placeholder="Nhập kiểu dáng" value={attributes.season} onChange={(e) => { handleChangeAtrribute({ season: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="madein">Xuất xứ</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="madein" name="madein" placeholder="Nhập xuất xứ" value={attributes.madein} onChange={(e) => { handleChangeAtrribute({ madein: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs="12" sm="6" md="5">
            <CCard>
              <CCardHeader>
                Options
              </CCardHeader>
              <CCardBody>
                <CFormGroup row className="my-0">
                  <CCol xs="6">
                    <CFormGroup row>
                      <CCol tag="label" sm="6" className="col-form-label">
                        <CLabel style={{ marginBottom: 0 }} htmlFor="is_color">Có màu sắc</CLabel>
                      </CCol>
                      <CCol sm="6" style={{ display: 'flex', alignItems: 'center' }}>
                        <CSwitch
                          size="sm"
                          id="is_color"
                          name="is_color"
                          className="mr-1"
                          color="primary"
                          shape="pill"
                          checked={isColor}
                          onChange={() => {
                            handleSetIsColor(!isColor)
                          }}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xs="6">
                    <CFormGroup row>
                      <CCol tag="label" sm="6" className="col-form-label">
                        <CLabel style={{ marginBottom: 0 }} htmlFor="is_size">Có kích thước</CLabel>
                      </CCol>
                      <CCol sm="6" style={{ display: 'flex', alignItems: 'center' }}>
                        <CSwitch
                          size="sm"
                          id="is_size"
                          name="is_size"
                          className="mr-1"
                          color="primary"
                          shape="pill"
                          checked={isSize}
                          onChange={() => {
                            handleSetIsSize(!isSize)
                          }}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
                {
                  optionComponent()
                }
                <CButton color="success" variant="outline" size="sm" onClick={() => { handleAddOption() }}>
                  <CIcon name="cil-plus" size="sm" />
                  Thêm Option
                </CButton>
                <CFormGroup row style={{ display: !isColor ? "flex" : "none", marginTop: 10 }}>
                  <CCol xs="12" md="1">
                    <CInputFile
                      id="file-multiple-input"
                      name="file-multiple-input"
                      multiple
                      custom
                      hidden
                      onChange={(e) => { fileChanged(e, 0) }}
                    />
                    <CLabel htmlFor="images">Ảnh</CLabel>
                  </CCol>
                  <CCol md="11">
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                      <CButton variant="outline" color="dark" style={{ width: 80, height: 80 }} onClick={() => { document.getElementById("file-multiple-input").click() }}>
                        <CIcon name="cil-plus" size="lg" /><br /><small>Thêm ảnh</small>
                      </CButton>
                      {
                        fileList.map((file, index) => {
                          return (
                            <div key={index} style={{
                              width: 100, height: 80, display: 'flex', justifyContent: 'space-between',
                              marginLeft: 8, border: '1px solid #e6e6e6', padding: 5
                            }}>
                              <img alt="select" style={{ width: 60, height: '100%' }} src={file.preview} onClick={() => { handlePreview(file) }} />
                              <CButton className="button-delete-image" onClick={() => { handleDeleteImage(0, index) }}
                                style={{ width: 24, height: '100%', border: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <RemoveCircleOutlineOutlinedIcon style={{ color: '#ff8080' }} />
                              </CButton>
                            </div>
                          );
                        })
                      }
                    </div>
                  </CCol>
                  <CModal
                    scrollable
                    show={preview.visible}
                    onClose={handleCancel}
                    // color="info"
                  >
                    <CModalHeader style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <CModalTitle>{preview.title}</CModalTitle>
                      <CButton onClick={handleCancel}><CIcon name='cil-x' size="sm"/></CButton>
                    </CModalHeader>
                    <CModalBody>
                      <img alt="image_product" style={{ width: '100%' }} src={preview.image} />
                    </CModalBody>
                    <CModalFooter>
                      <CButton color="secondary" onClick={handleCancel}>Đóng</CButton>
                    </CModalFooter>
                  </CModal>
                </CFormGroup>
              </CCardBody>
              <CCardFooter>
                <CButton type="submit" size="sm" color="primary" style={{ marginRight: 10 }}><CIcon name="cil-save" style={{ paddingRight: 2 }} />Nhập sản phẩm</CButton>
                <CButton type="reset" size="sm" color="dark" style={{ marginRight: 10 }} onClick={(e) => { handleReload(e) }}><CIcon name="cil-reload" style={{ paddingRight: 2 }} />Làm mới</CButton>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CForm >
    </>
  )
}

AddNewProduct.defaultProps = {
  isHeader: true
}

export default AddNewProduct
