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

import http from "../../../utils/http-common";
// import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import CategoriesComponent from 'src/components/Categories';

const EditProduct = props => {
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState({ visible: false, image: '', title: '' });
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [isColor, setIsColor] = useState(true);
  const [isSize, setIsSize] = useState(true);
  const [listOptions, setListOptions] = useState([]);
  const [modeView, setModeView] = useState("");
  // { id: 1, color: 0, size: 0, price: {id: 0, value: 0}, quantity: {id: 0, value: 0}, images: [] }
  const [attributes, setAttributes] = useState({
    id: 0, name: '', description: '', short_description: '', highlight: '',
    discount: 0, isFreeship: false, parentCategory: 16, category: 0, brand: 0,
    material: '', style: '', season: '', madein: '', purpose: ''
  });

  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [pathCategory, setPathCategory] = useState({});


  useEffect(() => {
    const loadDetail = async (idProduct) => {
      if (typeof (idProduct) === "number") {

        const response = await http.get(`/product/${idProduct}`);
        const data = await response.data;
        if (data === null || data === '' || typeof (data) === "undefined")
          return;
        const { id, name, description, shortDescription, highlight,
          promotionPercent, freeShip, category, categories, brand,
          material, style, suitable_season, madeIn, purpose,
          attributes, option_products } = data;
        setAttributes(prev => ({
          ...prev, id: id, name, description, short_description: shortDescription, highlight, discount: promotionPercent,
          isFreeship: freeShip, category: category.id, parentCategory: parseInt(categories.split('/')[1]), brand: brand !== null ? brand.id : -1,
          material, style, season: suitable_season, madein: madeIn === null ? "Không rõ" : madeIn, purpose
        }));

        // loadSubCategories(parseInt(categories.split('/')[1]))

        const path = await findPathCategories(category.id);
        setPathCategory(path);
        setSelected(category.id.toString());
        setExpanded(path.category_ids);

        let is_color = attributes.some(a => a.id === 80);
        let is_size = attributes.some(s => s.id === 164);
        if (!is_color)
          setFileList(attributes.find(x => x.id === 240799).options)

        setIsColor(is_color);
        setIsSize(is_size);

        setListOptions(option_products.map(op => {
          let option_color = op.option.find(v => v.attribute_id === 80);
          let option_size = op.option.find(v => v.attribute_id === 164);

          let oP = {
            id: op.product_option_id, price: op.price, quantity: op.quantity,
            color: typeof (option_color) === "undefined" ? 0 : option_color.id,
            size: typeof (option_size) === "undefined" ? 0 : option_size.id,
            images: op.list_images
          }

          return oP;
        }));

      }
    }

    loadBrand();
    loadColor();
    loadSize();
    loadDetail(props.productId);

    setModeView(props.mode);

  }, [props.mode, props.productId])



  const loadBrand = async () => {
    const response = await axios.get("http://localhost:8080/api/v1/brand/get-all");
    const data = await response.data;
    setBrands(data);
  };

  const loadSubCategories = async (idCategory) => {
    const response = await axios.get(`http://localhost:8080/api/v1/categories/${idCategory}/sub-categories`);
    const data = await response.data;
    let subCategoriesNew = [];
    await updateDataSubCategories(data, subCategoriesNew);
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

  const updateDataSubCategories = async (data, subCategoriesNew) => {
    await data.forEach(v => {
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
      return { id: await f.name, value: await preview };
    }));
    // setFileList(filess);

    if (id !== 0)
      setListOptions(listOptions.map(x => (x.id === id ? { ...x, images: filess } : x)));
    else setFileList(filess);

    setLoadingImage(false);
  }

  const handleCancel = () => setPreview({ visible: false });

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
    setAttributes(prev => ({ ...prev, ...attribute }));
  }

  const handleSaveChange = (e) => {
    e.preventDefault();
    swal({
      title: "Bạn muốn lưu những thay đổi?",
      // text: "Nếu đồng ý thì mọi thay đổi sẽ biến mất.",
      icon: "info",
      buttons: {
        ok: "Đồng ý",
        cancel: "Huỷ"
      },
      // dangerMode: true,
    }).then((value) => {
      if (value === 'ok') {
        // setAttributes({
        //   name: '', description: '', short_description: '', highlight: '',
        //   discount: 0, isFreeship: false, category: 0, brand: 0,
        //   material: '', style: '', season: '', madein: '', purpose: ''
        // });
        // setListOptions([{ id: 1, color: 0, size: 0, price: 0, quantity: 0, images: [] }]);
        // setIsColor(true);
        // setIsSize(true);
        swal("Đã lưu thay đổi", {
          icon: "success",
        });
      }
    });
  }

  const handleDeleteProduct = (e) => {
    e.preventDefault();
    swal({
      title: "Bạn muốn xoá sản phẩm này?",
      // text: "Nếu đồng ý thì mọi thay đổi sẽ biến mất.",
      icon: "warning",
      buttons: {
        ok: "Đồng ý",
        cancel: "Huỷ"
      },
      // dangerMode: true,
    }).then((value) => {
      if (value === 'ok') {
        // setAttributes({
        //   name: '', description: '', short_description: '', highlight: '',
        //   discount: 0, isFreeship: false, category: 0, brand: 0,
        //   material: '', style: '', season: '', madein: '', purpose: ''
        // });
        // setListOptions([{ id: 1, color: 0, size: 0, price: 0, quantity: 0, images: [] }]);
        // setIsColor(true);
        // setIsSize(true);
        swal("Xoá sản phẩm thành công", {
          icon: "success",
        });
      }
    });
  }
  const handleChangeMode = new_mode => {
    setModeView(new_mode);
    props.handleChangeTitle("edit");
  }

  const handleToggle = (event, nodeIds) => {
    // setExpanded(nodeIds);
  };

  const handleSelect = async (event, nodeIds) => {
    let index = expanded.indexOf(nodeIds);

    if (index > -1) {
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
    listOptions.forEach((value, index) => {
      // console.log(value)
      components.push(
        <CFormGroup row key={value.id} style={{ backgroundColor: 'rgba(242, 242, 242, 0.6)', borderRadius: 5, marginBottom: '8px' }}>
          <CCol style={{ display: isColor ? "flex" : "none" }}>
            <CFormGroup>
              <CLabel htmlFor="color">Màu sắc</CLabel>
              <CSelect className="disable-detail" disabled={modeView === "edit" ? false : true} custom name="color" id="color" value={value.color} onChange={(e) => { handleChangeOption(value.id, { color: e.target.value }) }}>

                <option value="0" key={0}>Chọn</option>
                {
                  colors.map(v => <option value={v.id} key={v.id}>{v.value}</option>)
                }
              </CSelect>
            </CFormGroup>
          </CCol>
          <CCol style={{ display: isSize ? "flex" : 'none' }}>
            <CFormGroup>
              <CLabel htmlFor="size">Kích thước</CLabel>
              <CSelect className="disable-detail" disabled={modeView === "edit" ? false : true} custom name="size" id="size" value={value.size} onChange={(e) => { handleChangeOption(value.id, { size: e.target.value }) }}>

                <option value="0" key={0}>Chọn</option>
                {
                  sizes.map(v => <option value={v.id} key={v.id}>{v.value}</option>)
                }
              </CSelect>
            </CFormGroup>
          </CCol>
          <CCol>
            <CFormGroup>
              <CLabel htmlFor="price">Đơn giá</CLabel>
              <CInput className="disable-detail" disabled={modeView === "edit" ? false : true} type="number" id="price" placeholder="Nhập giá" value={value.price.value} onChange={(e) => { handleChangeOption(value.id, { price: e.target.value }) }} />
            </CFormGroup>
          </CCol>
          <CCol>
            <CFormGroup>
              <CLabel htmlFor="quantity">Số lượng</CLabel>
              <CInput className="disable-detail" disabled={modeView === "edit" ? false : true} type="number" id="quantity" placeholder="Nhập SL" value={value.quantity.value} onChange={(e) => { handleChangeOption(value.id, { quantity: e.target.value }) }} />
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
                <CButton
                  className="btn-image-plus"
                  variant="outline" color="dark"
                  style={{ width: 80, height: 80, marginBottom: 5, display: modeView === "edit" ? "inline" : "none" }}
                  onClick={() => { document.getElementById(`file-multiple-input${value.id}`).click() }}
                >
                  <CIcon name="cil-plus" size="lg" /><br /><small>Thêm ảnh</small>
                </CButton>
                {
                  value.images.map((file, index) => {
                    return (
                      <div key={index} style={{
                        width: 100, height: 80, display: 'flex', justifyContent: 'space-between',
                        marginLeft: 8, border: '1px solid #e6e6e6', padding: 5
                      }}>
                        <img alt="select" style={{ width: 60, height: '100%' }} src={file.value} onClick={() => { handlePreview(file) }} className="img-thumbnail-table" />
                        <CButton
                          disabled={modeView === "edit" ? false : true}
                          className="button-delete-image" onClick={() => { handleDeleteImage(value.id, index) }}
                          style={{
                            width: 24, height: '100%', border: 0, display: 'flex',
                            justifyContent: 'center', alignItems: 'center',
                          }}>
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
                    <CButton color="secondary" onClick={handleCancel}>Đóng</CButton>
                  </CModalFooter>
                </CModal>
              </div>
            </CFormGroup>
          </CCol>
          <CButton
            color="secondary"
            style={{ borderRadius: 13, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', padding: 0, position: 'absolute', right: -1, display: (listOptions.length > 1) && (modeView === "edit") ? "flex" : "none" }}
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
              <CCardBody>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="id">Id</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput disabled id="id" name="id" placeholder="" value={attributes.id} onChange={(e) => { handleChangeAtrribute({ id: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="name">Tên sản phẩm</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput className="disable-detail" disabled={modeView === "edit" ? false : true} id="name" name="name" placeholder="Nhập tên..." value={attributes.name} onChange={(e) => { handleChangeAtrribute({ name: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="description">Mô tả</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CTextarea
                      className="disable-detail"
                      disabled={modeView === "edit" ? false : true}
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
                      className="disable-detail"
                      disabled={modeView === "edit" ? false : true}
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
                      className="disable-detail"
                      disabled={modeView === "edit" ? false : true}
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
                    <CLabel className="disable-detail" htmlFor="discount">Giảm giá(%)</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput className="disable-detail" disabled={modeView === "edit" ? false : true} value={attributes.discount} onChange={(e) => { handleChangeAtrribute({ discount: e.target.value }) }} type="number" id="discount" name="discount" max={100} min={0} placeholder="Nhập giảm giá..." />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol tag="label" sm="3" className="col-form-label">
                    <CLabel style={{ marginBottom: 0 }} htmlFor="free_ship">Miễn phí vận chuyển</CLabel>
                  </CCol>
                  <CCol sm="9" style={{ display: 'flex', alignItems: 'center' }}>
                    <CSwitch
                      className="disable-detail mx-1"
                      disabled={modeView === "edit" ? false : true}
                      id="free_ship"
                      name="free_ship"
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
                  <CCol xs="12" md="9">
                    <CInputGroup>
                      <CDropdown style={{ display: modeView === "edit" ? 'flex' : 'none' }} className="input-group-prepend">
                        <CDropdownToggle caret color="primary">
                          Chọn danh mục
                        </CDropdownToggle>
                        <CDropdownMenu style={{ padding: 15 }}>
                          <CategoriesComponent expanded={expanded} selected={selected} onNodeToggle={handleToggle} onNodeSelect={handleSelect} />
                        </CDropdownMenu>
                      </CDropdown>
                      <CInput disabled className="disable-detail" id="category-edit-product" name="category" placeholder="chọn danh mục..." value={pathCategory.name} />
                    </CInputGroup>
                  </CCol>
                </CFormGroup>
                {/* <CFormGroup row>
                  <CCol md="3" style={{ display: 'flex', alignItems: 'center' }}>
                    <CLabel>Danh mục</CLabel>
                  </CCol>
                  <CCol md="9">
                    <FormControl component="fieldset" >
                      <RadioGroup row aria-label="categories-edit" name="categories-edit" style={{ display: 'flex', alignItems: 'center' }}
                        onChange={(e) => { handleChangeRadioCategory(e.target.value) }} value={attributes.parentCategory}>
                        <FormControlLabel style={{ display: (attributes.parentCategory === 16 && modeView === "detail") || modeView === "edit" ? "inline" : "none" }} value={16} control={<Radio size="small" color="primary" />} label="Thời trang nam" />
                        <FormControlLabel style={{ display: (attributes.parentCategory === 17 && modeView === "detail") || modeView === "edit" ? "inline" : "none" }} value={17} control={<Radio size="small" color="primary" />} label="Thời trang nữ" />
                        <FormControlLabel style={{ display: (attributes.parentCategory === 324 && modeView === "detail") || modeView === "edit" ? "inline" : "none" }} value={324} control={<Radio size="small" color="primary" />} label="Làm đẹp" />
                      </RadioGroup>
                    </FormControl>
                  </CCol>
                </CFormGroup> */}
                {/* <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="sub_cateogires">Danh mục con</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CSelect className="disable-detail" disabled={modeView === "edit" ? false : true} custom name="sub-categories" id="sub-cateogories" value={attributes.category} onChange={(e) => { handleChangeAtrribute({ category: e.target.value }) }}>

                      <option value="0" key={0}>Chọn danh mục con</option>
                      {
                        subCategories.map(v => <option value={v.id} key={v.id}>{v.name}</option>)
                      }
                    </CSelect>
                  </CCol>
                </CFormGroup> */}
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="brand">Thương hiệu</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CSelect className="disable-detail" disabled={modeView === "edit" ? false : true} custom name="brand" id="brand" value={attributes.brand} onChange={(e) => { handleChangeAtrribute({ brand: e.target.value }) }}>

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
                    <CInput className="disable-detail" disabled={modeView === "edit" ? false : true} id="material" name="material" placeholder="Nhập chất liệu" value={attributes.material} onChange={(e) => { handleChangeAtrribute({ material: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="style">Kiểu dáng</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput className="disable-detail" disabled={modeView === "edit" ? false : true} id="style" name="style" placeholder="Nhập kiểu dáng" value={attributes.style} onChange={(e) => { handleChangeAtrribute({ style: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="purpose">Mục đích sử dụng</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput className="disable-detail" disabled={modeView === "edit" ? false : true} id="purpose" name="purpose" placeholder="Nhập mục đích sử dụng" value={attributes.purpose} onChange={(e) => { handleChangeAtrribute({ purpose: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="season">Mùa phù hợp</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput className="disable-detail" disabled={modeView === "edit" ? false : true} id="season" name="season" placeholder="Nhập kiểu dáng" value={attributes.season} onChange={(e) => { handleChangeAtrribute({ season: e.target.value }) }} />
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="madein">Xuất xứ</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput className="disable-detail" disabled={modeView === "edit" ? false : true} id="madein" name="madein" placeholder="Nhập xuất xứ" value={attributes.madein} onChange={(e) => { handleChangeAtrribute({ madein: e.target.value }) }} />
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
                <CFormGroup row className="my-0" style={{ display: modeView === "edit" ? "flex" : "none" }}>
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
                <CButton style={{ display: (!isColor && !isSize) || modeView === "detail" ? "none" : "flex" }} color="success" variant="outline" size="sm" onClick={() => { handleAddOption() }}>
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
                      <CButton
                        className="btn-image-plus"
                        variant="outline" color="dark"
                        style={{ width: 80, height: 80, display: modeView === "edit" ? "inline" : "none" }}
                        onClick={() => { document.getElementById("file-multiple-input").click() }}>
                        <CIcon name="cil-plus" size="lg" /><br /><small>Thêm ảnh</small>
                      </CButton>
                      {
                        fileList.map((file, index) => {
                          return (
                            <div key={index} style={{
                              width: 100, height: 80, display: 'flex', justifyContent: 'space-between',
                              marginLeft: 8, border: '1px solid #e6e6e6', padding: 5
                            }}>
                              <img className="img-thumbnail-table" alt="select" style={{ width: 60, height: '100%' }} src={file.value} onClick={() => { handlePreview(file) }} />
                              <CButton disabled={modeView === "edit" ? false : true} className="button-delete-image" onClick={() => { handleDeleteImage(0, index) }}
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
                      <CButton color="secondary" onClick={handleCancel}>Đóng</CButton>
                    </CModalFooter>
                  </CModal>
                </CFormGroup>
              </CCardBody>
              <CCardFooter>
                <CButton style={{ display: modeView === "detail" ? "inline" : "none", marginRight: 10 }} type="button" size="sm" color="info" onClick={() => { handleChangeMode("edit") }}><CIcon name="cil-pen" style={{ paddingRight: 2 }} />Sửa sản phẩm</CButton>
                <CButton style={{ display: modeView === "detail" ? "none" : "inline", marginRight: 10 }} type="button" size="sm" color="primary" onClick={(e) => { handleSaveChange(e) }}><CIcon name="cil-save" style={{ paddingRight: 2 }} />Lưu lại</CButton>
                <CButton style={{ display: modeView === "detail" ? "none" : "inline", marginRight: 10 }} type="button" size="sm" color="danger" onClick={(e) => { handleDeleteProduct(e) }}>
                  <DeleteOutline style={{ paddingRight: 2, fontSize: 22 }} />
                  Xoá sản phẩm</CButton>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CForm >
    </>
  )
}

EditProduct.defaultProps = {
  mode: 'detail',
  productId: 0
}

export default EditProduct
