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
  CInputGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'

import swal from 'sweetalert';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import { getBase64 } from 'src/utils/ImageConst';
import CategoriesComponent from 'src/components/Categories';
import http from 'src/utils/http-common';

const AddNewProduct = props => {
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
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
  });

  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [pathCategory, setPathCategory] = useState({});


  useEffect(() => {
    loadBrand();
    loadColor();
    loadSize();
  }, [])

  const loadBrand = async () => {
    const response = await axios.get("http://localhost:8080/api/v1/brand/get-all");
    const data = await response.data;
    setBrands(data);
  };

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
      title: "B???n mu???n l??m m???i?",
      text: "N???u ?????ng ?? th?? m???i thay ?????i s??? bi???n m???t.",
      icon: "warning",
      buttons: {
        ok: "?????ng ??",
        cancel: "Hu???"
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

  const handleToggle = (event, nodeIds) => {
    // setExpanded(nodeIds);
  };

  const handleSelect = async (event, nodeIds) => {
    
    let index = expanded.indexOf(nodeIds);

    if (index !== -1) {
      setExpanded(prev => prev.slice(index + 1, prev.length - index));
    } else {
      const path = await findPathCategories(nodeIds);

      if (path.is_subcategory)
        setExpanded(path.category_ids);
      else {
        setPathCategory(path);
        setSelected(nodeIds);
      };
    }
  };

  const findPathCategories = async (id) => {
    const response = await http.get(`/category/${id}/get-detail`);
    const data = response.data;
    return data;
  }

  const optionComponent = () => {
    var components = [];
    listOptions.map((value, index) => {
      // console.log(value)
      components.push(
        <CFormGroup row key={value.id} style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', borderRadius: 5, marginBottom: '8px' }}>
          <CCol style={{ display: isColor ? "flex" : "none" }}>
            <CFormGroup>
              <CLabel htmlFor="color">M??u s???c</CLabel>
              <CSelect custom name="color" id="color-add" value={value.color} onChange={(e) => { handleChangeOption(value.id, { color: e.target.value }) }}>

                <option value="0" key={0}>Ch???n</option>
                {
                  colors.map(v => <option value={v.id} key={v.id}>{v.value}</option>)
                }
              </CSelect>
            </CFormGroup>
          </CCol>
          <CCol style={{ display: isSize ? "flex" : 'none' }}>
            <CFormGroup>
              <CLabel htmlFor="size">K??ch th?????c</CLabel>
              <CSelect custom name="size" id="size-add" value={value.size} onChange={(e) => { handleChangeOption(value.id, { size: e.target.value }) }}>

                <option value="0" key={0}>Ch???n</option>
                {
                  sizes.map(v => <option value={v.id} key={v.id}>{v.value}</option>)
                }
              </CSelect>
            </CFormGroup>
          </CCol>
          <CCol >
            <CFormGroup>
              <CLabel htmlFor="price">????n gi??</CLabel>
              <CInput type="number" id="-add" placeholder="Nh???p gi??" value={value.price} onChange={(e) => { handleChangeOption(value.id, { price: e.target.value }) }} />
            </CFormGroup>
          </CCol>
          <CCol>
            <CFormGroup>
              <CLabel htmlFor="quantity">S??? l?????ng</CLabel>
              <CInput type="number" id="quantity-add" placeholder="Nh???p SL" value={value.quantity} onChange={(e) => { handleChangeOption(value.id, { quantity: e.target.value }) }} />
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
              <CLabel htmlFor="images">???nh</CLabel>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                <CButton className="btn-image-plus" variant="outline" color="dark" style={{ width: 80, height: 80 }} onClick={() => { document.getElementById(`file-multiple-input${value.id}`).click() }}>
                  <CIcon name="cil-plus" size="lg" /><br /><small>Th??m ???nh</small>
                </CButton>
                {
                  value.images.map((file, index) => {
                    return (
                      <div key={index} style={{
                        width: 100, height: 80, display: 'flex', justifyContent: 'space-between',
                        marginLeft: 8, border: '1px solid #e6e6e6', padding: 5
                      }}>
                        <img className="img-thumbnail-table" alt="select" style={{ width: 60, height: '100%' }} src={file.preview} onClick={() => { handlePreview(file) }} />
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
                  <CModalHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <CModalTitle>{preview.title}</CModalTitle>
                    <CButton onClick={handleCancel}><CIcon name='cil-x' size="sm" /></CButton>
                  </CModalHeader>
                  <CModalBody>
                    <img alt="image_product" style={{ width: '100%' }} src={preview.image} />
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={handleCancel}>????ng</CButton>
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
          <CCol xs="12" sm="12" md="12" style={{ display: props.isHeader ? "block" : "none" }}>
            <h3 style={{ marginBottom: 20, fontWeight: "bold" }}>Th??m s???n ph???m</h3>
          </CCol>
          <CCol xs="12" sm="6" md="7">
            <CCard>
              <CCardHeader>
                <p style={{ fontSize: 15, fontWeight: "bold", marginBottom: 0 }}>Th??ng tin chung</p>
              </CCardHeader>
              <CCardBody>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="name">T??n s???n ph???m</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="name-add" name="name" placeholder="Nh???p t??n..." value={attributes.name} onChange={(e) => { handleChangeAtrribute({ name: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="description">M?? t???</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CTextarea
                      name="description"
                      id="description-add"
                      rows="5"
                      placeholder="Nh???p m?? t??? s???n ph???m..."
                      value={attributes.description}
                      onChange={(e) => { handleChangeAtrribute({ description: e.target.value }) }}
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="short_description">M?? t??? ng???n g???n</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CTextarea
                      name="short_description"
                      id="short_description-add"
                      rows="3"
                      placeholder="Nh???p m?? t??? ng???n g???n..."
                      value={attributes.short_description}
                      onChange={(e) => { handleChangeAtrribute({ short_description: e.target.value }) }}
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="highlight">??i???m n???i b???t</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CTextarea
                      name="highlight"
                      id="highlight-add"
                      rows="3"
                      placeholder="Nh???p ??i???m n???i b???t..."
                      value={attributes.highlight}
                      onChange={(e) => { handleChangeAtrribute({ highlight: e.target.value }) }}
                    />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="discount">Gi???m gi??(%)</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput value={attributes.discount} onChange={(e) => { handleChangeAtrribute({ discount: e.target.value }) }} type="number" id="discount-add" name="discount" max={100} min={0} placeholder="Nh???p gi???m gi??..." />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol tag="label" sm="3" className="col-form-label">
                    <CLabel style={{ marginBottom: 0 }} htmlFor="free_ship">Mi???n ph?? v???n chuy???n</CLabel>
                  </CCol>
                  <CCol sm="9" style={{ display: 'flex', alignItems: 'center' }}>
                    <CSwitch
                      id="free_ship-add"
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
                    <CLabel>Danh m???c</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInputGroup>
                      <CDropdown className="input-group-prepend">
                        <CDropdownToggle caret color="primary">
                          Ch???n danh m???c
                        </CDropdownToggle>
                        <CDropdownMenu style={{ padding: 15 }}>
                          <CategoriesComponent expanded={expanded} selected={selected} onNodeToggle={handleToggle} onNodeSelect={handleSelect} />
                        </CDropdownMenu>
                      </CDropdown>
                      <CInput disabled className="disable-detail" id="category-add-product" name="category" placeholder="ch???n danh m???c..." value={pathCategory.name} />
                    </CInputGroup>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="brand">Th????ng hi???u</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CSelect
                      custom name="brand" id="brand-add" value={attributes.brand} onChange={(e) => { handleChangeAtrribute({ brand: e.target.value }) }}>

                      <option value="0" key={0}>Ch???n th????ng hi???u</option>
                      {
                        brands.map(v => <option value={v.id} key={v.id}>{v.name}</option>)
                      }
                    </CSelect>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="material">Ch???t li???u</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="material-add" name="material" placeholder="Nh???p ch???t li???u" value={attributes.material} onChange={(e) => { handleChangeAtrribute({ material: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="style">Ki???u d??ng</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="style-add" name="style" placeholder="Nh???p ki???u d??ng" value={attributes.style} onChange={(e) => { handleChangeAtrribute({ style: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="purpose">M???c ????ch s??? d???ng</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="purpose-add" name="purpose" placeholder="Nh???p m???c ????ch s??? d???ng" value={attributes.purpose} onChange={(e) => { handleChangeAtrribute({ purpose: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="season">M??a ph?? h???p</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="season-add" name="season" placeholder="Nh???p ki???u d??ng" value={attributes.season} onChange={(e) => { handleChangeAtrribute({ season: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="madein">Xu???t x???</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput id="madein-add" name="madein" placeholder="Nh???p xu???t x???" value={attributes.madein} onChange={(e) => { handleChangeAtrribute({ madein: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol xs="12" sm="6" md="5">
            <CCard>
              <CCardHeader>
                <p style={{ fontSize: 15, fontWeight: "bold", marginBottom: 0 }}>Options</p>
              </CCardHeader>
              <CCardBody>
                <CFormGroup row className="my-0">
                  <CCol xs="6">
                    <CFormGroup row>
                      <CCol tag="label" sm="6" className="col-form-label">
                        <CLabel style={{ marginBottom: 0 }} htmlFor="is_color">C?? m??u s???c</CLabel>
                      </CCol>
                      <CCol sm="6" style={{ display: 'flex', alignItems: 'center' }}>
                        <CSwitch
                          size="sm"
                          id="is_color-add"
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
                        <CLabel style={{ marginBottom: 0 }} htmlFor="is_size">C?? k??ch th?????c</CLabel>
                      </CCol>
                      <CCol sm="6" style={{ display: 'flex', alignItems: 'center' }}>
                        <CSwitch
                          size="sm"
                          id="is_size-add"
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
                <CButton style={{ display: !isColor && !isSize ? "none" : "flex" }} color="success" variant="outline" size="sm" onClick={() => { handleAddOption() }}>
                  <CIcon name="cil-plus" size="sm" />
                  Th??m Option
                </CButton>
                <CFormGroup row style={{ display: !isColor ? "flex" : "none", marginTop: 10 }}>
                  <CCol xs="12" md="1">
                    <CInputFile
                      id="file-multiple-input-add"
                      name="file-multiple-input"
                      multiple
                      custom
                      hidden
                      onChange={(e) => { fileChanged(e, 0) }}
                    />
                    <CLabel htmlFor="images">???nh</CLabel>
                  </CCol>
                  <CCol md="11">
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                      <CButton className="btn-image-plus" variant="outline" color="dark" style={{ width: 80, height: 80 }} onClick={() => { document.getElementById("file-multiple-input").click() }}>
                        <CIcon name="cil-plus" size="lg" /><br /><small>Th??m ???nh</small>
                      </CButton>
                      {
                        fileList.map((file, index) => {
                          return (
                            <div key={index} style={{
                              width: 100, height: 80, display: 'flex', justifyContent: 'space-between',
                              marginLeft: 8, border: '1px solid #e6e6e6', padding: 5
                            }}>
                              <img className="img-thumbnail-table" alt="select" style={{ width: 60, height: '100%' }} src={file.preview} onClick={() => { handlePreview(file) }} />
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
                    <CModalHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <CModalTitle>{preview.title}</CModalTitle>
                      <CButton onClick={handleCancel}><CIcon name='cil-x' size="sm" /></CButton>
                    </CModalHeader>
                    <CModalBody>
                      <img alt="image_product" style={{ width: '100%' }} src={preview.image} />
                    </CModalBody>
                    <CModalFooter>
                      <CButton color="secondary" onClick={handleCancel}>????ng</CButton>
                    </CModalFooter>
                  </CModal>
                </CFormGroup>
              </CCardBody>
              <CCardFooter>
                <CButton type="submit" size="sm" color="primary" style={{ marginRight: 10 }}><CIcon name="cil-save" style={{ paddingRight: 2 }} />Nh???p s???n ph???m</CButton>
                <CButton type="reset" size="sm" color="dark" style={{ marginRight: 10 }} onClick={(e) => { handleReload(e) }}><CIcon name="cil-reload" style={{ paddingRight: 2 }} />L??m m???i</CButton>
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
