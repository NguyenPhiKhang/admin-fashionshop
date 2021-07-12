import React, { useEffect, useState } from 'react'
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
  CPagination
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import axios from 'axios';
import {
  IconButton,
  Icon,
} from "@material-ui/core";

import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import AddNewProduct from '../AddNewProduct';

import EditProduct from '../EditProduct';
import http from 'src/utils/http-common';

const fields = [
  { key: 'id', label: 'Id', _style: { width: '5%' } },
  { key: 'name', label: 'Tên sản phẩm', _style: { width: '23%' } },
  { key: 'img_url', label: 'Ảnh', _style: { width: '10%' } },
  { key: 'category', label: 'Danh mục', _style: { width: '20%' } },
  { key: 'price', label: 'Giá', _style: { width: '15%' } },
  { key: 'quantity', label: 'Tồn kho', _style: { width: '8%' } },
  { key: 'order_count', label: 'Đã bán', _style: { width: '8%' } },
  { key: 'action', label: 'Action', _style: { width: '10%' } }
]

const AllProducts = () => {

  const [products, setProducts] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [editModal, setEditModal] = useState({ visible: false, mode: 'detail', id: 0 });
  const [categorySelected, setCategorySelected] = useState(0);
  const [categoriesList, setCategoriesList] = useState([]);
  const [statusSelected, setStatusSelected] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("")


  const loadTotalPage = async () => {
    const response = await http.get(`/products/count-product-filter?category_id=${categorySelected}&status=${statusSelected}&search=${search}`);
    const data = await response.data;

    let totalPageNew = Math.ceil(data / pageSize);

    setTotalPage(totalPageNew);
  }

  const loadProducts = async () => {
    setLoading(true);
    const response = await http.get(`/products/get-all-filter?p=${page}&p_size=5&category_id=${categorySelected}&status=${statusSelected}&search=${search}`);
    const data = await response.data;
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    console.log("useeffect 1")

    if (page === 1)
      loadProducts();
    else {
      setPage(1);
    }
    loadTotalPage();
  }, [statusSelected, categorySelected, search])


  useEffect(() => {
    console.log("useeffect 2")
    loadProducts();
  }, [page]);

  useEffect(() => {
    console.log("useeffect 3")
    const loadCategories = async () => {
      const response = await http.get("/categories/get-all?p=1&p_size=113");
      const data = await response.data;

      setCategoriesList(data);
    }

    loadCategories();
  }, [])

  const toggle = () => {
    setVisibleModal(prev => !prev);
  }

  const toggleEdit = (id, mode) => {
    setEditModal(prev => ({ id: id, mode: mode, visible: !prev.visible }));
  }

  const handleSelectCategory = async (e) => {
    setCategorySelected(e.target.value);
  }

  const handleSelectStatus = (e) => {
    setStatusSelected(e.target.value)
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleChangePage = number => {
    setPage(number);
  };

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12" md="12">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontWeight: "bold" }}>Tất cả sản phẩm</h3>
            <CButton className="btn-create btn-brand mr-1 mb-1" onClick={toggle}><CIcon name="cil-plus" /><span className="mfs-2">Nhập hàng</span></CButton>
          </div>
        </CCol>
        <CCol xs="12" sm="12" md="12">
          <CCard>
            <CCardHeader >
              <CFormGroup row style={{ marginTop: 10, marginBottom: 10 }}>
                <CCol xs="12" sm="4">
                  <CInput style={{ padding: 10, height: 'auto' }} size="normal" id="searchProduct" name="searchProduct" placeholder="Tìm kiếm sản phẩm..." value={search} onChange={handleSearch} />
                </CCol>
                <CCol xs="12" sm="8" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <CCol xs="12" sm="4">
                    <CSelect
                      style={{ padding: 12, height: 'auto' }}
                      name="categories-all" id="categories-all" value={categorySelected}
                      onChange={handleSelectCategory}
                    >
                      <option value="0" key={0}>Tất Cả Danh Mục</option>
                      {
                        categoriesList.map(v => <option value={v.id} key={v.id}>{v.name}</option>)
                      }
                    </CSelect>
                  </CCol>
                  <CCol xs="12" sm="4">
                    <CSelect
                      style={{ padding: 12, height: 'auto' }}
                      name="status-all" id="status-all"
                      value={statusSelected}
                      onChange={handleSelectStatus}
                    >
                      <option value="-1" key={-1}>Hiện tất cả trạng thái</option>
                      <option value="1" key={1}>Hoạt động</option>
                      <option value="0" key={0}>Không hoạt động</option>
                    </CSelect>
                  </CCol>
                </CCol>
              </CFormGroup>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                loading={loading}
                items={products}
                fields={fields}
                // itemsPerPage={5}
                // pagination
                hover
                sorter={false}
                scopedSlots={{
                  'action':
                    (item) => (
                      <td style={{ display: 'flex', alignItems: 'center', height: 97 }}>
                        <IconButton style={{ outline: 'none' }} title="Xem chi tiết" onClick={() => { toggleEdit(item.id, "detail") }}>
                          <VisibilityOutlinedIcon style={{ fontSize: 20 }} />
                        </IconButton>
                        <IconButton style={{ outline: 'none' }} title="Sửa" onClick={() => { toggleEdit(item.id, "edit") }}>
                          <CreateOutlinedIcon style={{ fontSize: 20, color: 'rgb(13, 93, 241)' }} />
                        </IconButton>
                      </td>
                    ),
                  'category':
                    (item) => (
                      <td className="td-middle">
                        {item.category.name}
                      </td>
                    ),
                  'price':
                    (item) => (
                      <td className="td-middle">
                        {
                          item.price.price_max === item.price.price_min ? item.price.price_max : item.price.price_min + ' - ' + item.price.price_max
                        }
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
                  'quantity':
                    (item) => (
                      <td className="td-middle">
                        {item.quantity}
                      </td>
                    ),
                  'order_count':
                    (item) => (
                      <td className="td-middle">
                        {item.order_count}
                      </td>
                    ),
                  'img_url':
                    (item) => (
                      <td className="td-middle">
                        <img src={item.img_url} alt="imgae_product" width='60' className="img-thumbnail-table"/>
                      </td>
                    ),
                }}
              />

              <CModal
                scrollable
                show={visibleModal}
                onClose={toggle}
                size="xl"
                className="inactive-modal"
              >
                <CModalHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CModalTitle>Thêm sản phẩm</CModalTitle>
                  <CButton onClick={toggle}><CIcon name='cil-x' size="sm" /></CButton>
                </CModalHeader>
                <CModalBody>
                  <AddNewProduct isHeader={false} />
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={toggle}>Đóng</CButton>
                </CModalFooter>
              </CModal>
              <CModal
                scrollable
                show={editModal.visible}
                onClose={toggleEdit}
                size="xl"
                className="inactive-modal"
              >
                <CModalHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CModalTitle>{editModal.mode === "edit" ? "Sửa sản phẩm" : "Chi tiết sản phẩm"}</CModalTitle>
                  <CButton onClick={toggleEdit}><CIcon name='cil-x' size="sm" /></CButton>
                </CModalHeader>
                <CModalBody>
                  <EditProduct productId={editModal.id} mode={editModal.mode} />
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={toggleEdit}>Đóng</CButton>
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
export default AllProducts