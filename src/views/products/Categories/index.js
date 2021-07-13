import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
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
  CCardFooter,
  CPagination,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CLabel,
  CInputGroup,
  CInputFile
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  FormGroup,
} from "@material-ui/core";

import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import http from 'src/utils/http-common';
import CategoriesComponent from 'src/components/Categories';
import { getBase64 } from 'src/utils/ImageConst';
import EditCategory from '../EditCategory';

const fields = [
  { key: 'id', label: 'ID', _style: { width: '5%' } },
  { key: 'name', label: 'Tên danh mục', _style: { width: '25%' } },
  { key: 'icon', label: 'Icon', _style: { width: '15%' } },
  { key: 'level', label: 'Level', _style: { width: '10%' } },
  { key: 'path', label: 'Path', _style: { width: '35%' } },
  { key: 'action', label: 'Action', _style: { width: '10%' } }
]

const CategoriesPage = () => {

  const [categoriesData, setCategoriesData] = useState([]);
  const [editModal, setEditModal] = useState({ visible: false, mode: 'detail', id: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [pathCategory, setPathCategory] = useState({});

  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState({ visible: false, image: '', title: '' });
  const [loadingImage, setLoadingImage] = useState(false);

  const [attrCategory, setAttrCategory] = useState({
    name: '', path: ''
  });

  const [modalAction, setModalAction] = useState({ visible: false, mode: 'detail', id: 0 });


  useEffect(() => {
    const loadCategoriesData = async () => {
      setLoading(true);
      const response = await http.get(`/categories/get-all?p=${page}&p_size=${pageSize}`);
      const data = await response.data;
      setCategoriesData(data);
      setLoading(false);
    };

    loadCategoriesData();
  }, [page]);

  useEffect(()=>{
    const loadTotalPage = async () => {
      const response = await http.get("/categories/count-record");
      const data = await response.data;
  
      let totalPageNew = Math.ceil(data / pageSize);
  
      setTotalPage(totalPageNew);
    }

    loadTotalPage();
  }, [])

  const handleChangePage = number => {
    setPage(number);
  };

  const handleChangeAttrCategory = (attribute) => {
    setAttrCategory(prev=>({...prev, ...attribute}));
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

      setSelected(nodeIds);
      setPathCategory(path);
    }
  };

  const findPathCategories = async (id) => {
    const response = await http.get(`/category/${id}/get-detail`);
    const data = response.data;
    return data;
  }

  const handleCancel = () => setPreview({ visible: false });

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

  const toggleAction = (id, mode)=>{
    setModalAction(prev=>({id: id, mode: mode, visible: !prev.visible}))
  }

  const handleChangeTitle = title=>{
    console.log("change tile")
    if(title==="edit")
      setModalAction(prev=>({...prev, mode: title}))
  }


  return (
    <>
      <CRow>
        <CCol xs="12" sm="12" md="12">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontWeight: "bold" }}>Danh mục</h3>
          </div>
        </CCol>
        <CCol xs="12" sm="12" md="12">
          <CCard>
            {/* <CCardHeader >
              <CFormGroup row style={{ marginTop: 10, marginBottom: 10, display: 'flex', justifyContent: 'flex-end' }}>
                <CCol xs="12" sm="2">
                  <CSelect
                    style={{ padding: 12, height: 'auto' }}
                    name="status-all" id="status-all"
                    value={statusSelected}
                    onChange={handleSelectStatus}
                  >
                    <option value="-1" key={-1}>Tất cả level</option>
                    <option value="1" key={0}>Level 0</option>
                    <option value="0" key={1}>Level 1</option>
                    <option value="0" key={2}>Level 2</option>
                    <option value="0" key={3}>Level 3</option>
                    <option value="0" key={4}>Level 4</option>
                  </CSelect>
                </CCol>
              </CFormGroup>
            </CCardHeader> */}
            <CCardBody>
              <CFormGroup row>
                <CCol xs="12" sm="12" md="4" style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-end" }}>
                  <CFormGroup row style={{ marginBottom: 30 }}>
                    <CCol xs="12">
                      <CLabel htmlFor="material">Tên danh mục</CLabel>
                    </CCol>
                    <CCol xs="12">
                      <CInput style={{ padding: 10, height: 'auto' }} size="normal" id="name-category" name="name-category" placeholder="Nhập tên danh mục..." value={attrCategory.name} onChange={(e) => { handleChangeAttrCategory({ name: e.target.value }) }} />
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row style={{ marginBottom: 30 }}>
                    <CCol xs="12">
                      <CLabel htmlFor="style">Path</CLabel>
                    </CCol>
                    <CCol xs="12">
                      <CInput style={{ padding: 10, height: 'auto' }} size="normal" id="path-category" name="path-category" placeholder="Nhập path..." value={attrCategory.path} onChange={(e) => { handleChangeAttrCategory({ path: e.target.value }) }} />
                    </CCol>
                  </CFormGroup>
                  <CFormGroup row style={{ marginBottom: 30 }}>
                    <CCol xs="12">
                      <CLabel>Danh mục cha</CLabel>
                    </CCol>
                    <CCol xs="12">
                      <CInputGroup>
                        <CDropdown className="input-group-prepend">
                          <CDropdownToggle caret style={{ padding: 10, height: 'auto', backgroundColor: 'rgba(44, 56, 74, 0.1)' }}>
                            Chọn danh mục
                          </CDropdownToggle>
                          <CDropdownMenu style={{ padding: 15 }}>
                            <CategoriesComponent expanded={expanded} selected={selected} onNodeToggle={handleToggle} onNodeSelect={handleSelect} />
                          </CDropdownMenu>
                        </CDropdown>
                        <CInput style={{ padding: 10, height: 'auto' }} disabled className="disable-detail" id="category-add" name="category" placeholder="..." value={pathCategory.name} />
                      </CInputGroup>
                    </CCol>
                  </CFormGroup>
                  <CFormGroup style={{ marginBottom: 30 }}>
                    <CInputFile
                      id={`file-input`}
                      name={`file-input`}
                      custom
                      hidden
                      onChange={(e) => { fileChanged(e) }}
                    />
                    <CLabel htmlFor="images">Icon</CLabel>
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                      <CButton className="btn-image-plus" variant="outline" color="dark" style={{ width: 80, height: 80 }} onClick={() => { document.getElementById(`file-input`).click() }}>
                        <CIcon name="cil-plus" size="lg" /><br /><small>Thêm ảnh</small>
                      </CButton>
                      {
                        fileList.map((file, index) => {
                          return (
                            <div key={index} style={{
                              width: 100, height: 80, display: 'flex', justifyContent: 'space-between',
                              marginLeft: 8, border: '1px solid #e6e6e6', padding: 5
                            }}>
                              <img className="img-thumbnail-table" alt="select" style={{ width: 60, height: '100%' }} src={file.preview} onClick={() => { handlePreview(file) }} />
                              <CButton className="button-delete-image" onClick={() => { handleDeleteImage(index) }}
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
                          <CButton color="secondary" onClick={handleCancel}>Đóng</CButton>
                        </CModalFooter>
                      </CModal>
                    </div>
                  </CFormGroup>
                  <FormGroup>
                    <CButton type="button" size="lg" color="primary" style={{ marginRight: 10 }} className="btn-create"><CIcon name="cil-plus" style={{ paddingRight: 2 }} />Tạo danh mục</CButton>
                  </FormGroup>
                </CCol>
                <CCol xs="12" sm="12" md="8">
                  <CDataTable
                    style={{ marginBottom: 0 }}
                    loading={loading}
                    items={categoriesData}
                    fields={fields}
                    // itemsPerPage={5}
                    // pagination
                    hover
                    sorter={false}
                    scopedSlots={{
                      'action':
                        (item) => (
                          <td className="td-middle">
                            <CDropdown className="m-1">
                              <CDropdownToggle color="white dropdown-table" size="lg" />
                              {/* <IconButton style={{ outline: 'none' }} title="Xem chi tiết" onClick={() => { toggleEdit(item.id, "detail") }}> */}
                              {/* <VisibilityOutlinedIcon style={{ fontSize: 20 }} /> */}
                              {/* </IconButton> */}
                              <CDropdownMenu>
                                <CDropdownItem onClick={()=>{toggleAction(item.id, "detail")}}>Xem chi tiết</CDropdownItem>
                                <CDropdownItem onClick={()=>{toggleAction(item.id, "edit")}}>Chỉnh sửa</CDropdownItem>
                              </CDropdownMenu>
                            </CDropdown>
                          </td>
                        ),
                      'name':
                        (item) => (
                          <td className="td-middle">
                            {item.name}
                          </td>
                        ),
                      'id':
                        (item) => (
                          <td className="td-middle">
                            {item.id}
                          </td>
                        ),
                      'icon':
                        (item) => (
                          <td className="td-middle">
                            <img src={item.icon} alt="imgae_product" width='60' className="img-thumbnail-table" />
                          </td>
                        ),
                      'level':
                        (item) => (
                          <td className="td-middle">
                            {item.level}
                          </td>
                        ),
                      'path':
                        (item) => (
                          <td className="td-middle">
                            {item.path_url}
                          </td>
                        ),
                    }}
                  />
                </CCol>
              </CFormGroup>
              <CModal
                scrollable
                show={modalAction.visible}
                onClose={toggleAction}
                className="inactive-modal"
              >
                <CModalHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CModalTitle>{modalAction.mode === "edit" ? "Sửa danh mục" : "Chi tiết danh mục"}</CModalTitle>
                  <CButton onClick={toggleAction}><CIcon name='cil-x' size="sm" /></CButton>
                </CModalHeader>
                <CModalBody>
                  <EditCategory categoryId={modalAction.id} mode={modalAction.mode} handleChangeTitle={handleChangeTitle}/>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={toggleAction}>Đóng</CButton>
                </CModalFooter>
              </CModal>
            </CCardBody>
            <CCardFooter style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>Trang: {page} / {totalPage}</div>
              <CPagination
                align="end"
                activePage={page}
                pages={totalPage}
                onActivePageChange={n => handleChangePage(n)}
              />
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
export default CategoriesPage;