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

import './allProduct.css'
import EditProduct from '../EditProduct';

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

  useEffect(() => {
    const loadAllProduct = async () => {
      const response = await axios.get("http://localhost:8080/api/v1/cat/259/products?filter=new&p=1");
      const data = await response.data;
      setProducts(data);
    };

    loadAllProduct();
  }, [])

  const toggle = () => {
    setVisibleModal(prev => !prev);
  }

  const toggleEdit = (id, mode) => {
    setEditModal(prev => ({ id: id, mode: mode, visible: !prev.visible }));
  }

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12" md="12">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{fontWeight: "bold"}}>Tất cả sản phẩm</h3>
            <CButton className="btn-create btn-brand mr-1 mb-1" onClick={toggle}><CIcon name="cil-plus" /><span className="mfs-2">Nhập hàng</span></CButton>
          </div>
        </CCol>
        <CCol xs="12" sm="12" md="12">
          <CCard>
            <CCardHeader >
              <CFormGroup row style={{marginTop: 10, marginBottom: 10}}>
                <CCol xs="12" sm="4">
                  <CInput size="normal" id="searchProduct" name="searchProduct" placeholder="Tìm kiếm sản phẩm..." />
                </CCol>
                <CCol xs="12">

                </CCol>
              </CFormGroup>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={products}
                fields={fields}
                itemsPerPage={5}
                pagination
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
                        <img src={item.img_url} alt="imgae_product" width='50' />
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
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
export default AllProducts