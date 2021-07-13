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
import CardBrandComponent from 'src/components/Brand/CardBrand';

const fields = [
  { key: 'id', label: 'Id', _style: { width: '5%' } },
  { key: 'name', label: 'Tên sản phẩm', _style: { width: '22%' } },
  { key: 'img_url', label: 'Ảnh', _style: { width: '10%' } },
  { key: 'category', label: 'Danh mục', _style: { width: '15%' } },
  { key: 'brand', label: 'Thương hiệu', _style: { width: '10%' } },
  { key: 'price', label: 'Giá', _style: { width: '10%' } },
  { key: 'quantity', label: 'Tồn kho', _style: { width: '8%' } },
  { key: 'order_count', label: 'Đã bán', _style: { width: '8%' } },
  { key: 'action', label: 'Action', _style: { width: '10%' } }
]

const BrandsPage = () => {

  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(1);
  const [search, setSearch] = useState("")
  const [brands, setBrands] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);

  useEffect(() => {
    const loadBrands = async () => {
      const response = await http.get(`/brand/get-filter?search=${search}`);
      const data = await response.data;

      setBrands(data);
    }

    loadBrands();
  }, [search])

  const toggle = () => {
    setVisibleModal(prev => !prev);
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12" md="12">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontWeight: "bold" }}>Thương hiệu</h3>
            <CButton className="btn-create btn-brand mr-1 mb-1" onClick={toggle}><CIcon name="cil-plus" /><span className="mfs-2">Thêm thương hiệu</span></CButton>
          </div>
        </CCol>
        <CCol xs="12" sm="12" md="12">
          <CCard>
            <CCardHeader >
              <CFormGroup row style={{ marginTop: 10, marginBottom: 10 }}>
                <CCol xs="12" sm="4">
                  <CInput style={{ padding: 10, height: 'auto' }} size="normal" id="searchBrand" name="searchBrand" placeholder="Tìm kiếm thương hiệu..." value={search} onChange={handleSearch} />
                </CCol>
              </CFormGroup>
            </CCardHeader>
            <CCardBody>
              <CFormGroup row>
                {
                  brands.map((v, i) => (
                    <CCol xs="12" sm="6" md="4" lg="3" xl="2" >
                      <CardBrandComponent name={v.name} img_url={v.icon} amount={`${v.countProduct} sản phẩm`} />
                    </CCol>
                  ))
                }
              </CFormGroup>
            </CCardBody>
            <CCardFooter style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>Tổng: {brands.length}</div>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}
export default BrandsPage