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
  Button,
} from "@material-ui/core";

import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';

import http from 'src/utils/http-common';
import EditOrder from '../EditOrder';

const fields = [
  { key: 'id', label: 'ID đơn hàng', _style: { width: '10%' } },
  { key: 'name', label: 'Tên khách hàng', _style: { width: '20%' } },
  { key: 'phone', label: 'Số điện thoại', _style: { width: '15%' } },
  { key: 'price', label: 'Tổng tiền', _style: { width: '15%' } },
  { key: 'status', label: 'Trạng thái', _style: { width: '15%' } },
  { key: 'date', label: 'Ngày đặt', _style: { width: '15%' } },
  { key: 'action', label: 'Action', _style: { width: '10%' } },
]

const getBadge = statusId => {
  switch (statusId) {
    case 1: return 'warning'
    case 2: return 'secondary'
    case 3: return 'secondary'
    case 4: return 'success'
    case 5: return 'danger'
    case 6: return 'danger'
    default: return 'primary'
  }
}

const AllOrders = () => {

  const [orders, setOrders] = useState([]);
  const [editModal, setEditModal] = useState({ visible: false, mode: 'detail', id: 0 });
  const [statusSelected, setStatusSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("")


  const loadTotalPage = async () => {
    const response = await http.get(`/orders/0/count-orders-for-admin?status=${statusSelected}&search_user=${search}`);
    const data = await response.data;

    let totalPageNew = Math.ceil(data / pageSize);

    setTotalPage(totalPageNew);
  }

  const loadOrders = async () => {
    setLoading(true);
    const response = await http.get(`orders/0/get-orders-for-admin?status=${statusSelected}&p=${page}&p_size=${pageSize}&search_user=${search}`);
    const data = await response.data;
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    if (page === 1)
      loadOrders();
    else {
      setPage(1);
    }
    loadTotalPage();
  }, [statusSelected, search])


  useEffect(() => {
    loadOrders();
  }, [page]);

  const toggleEdit = (id, mode) => {
    setEditModal(prev => ({ id: id, mode: mode, visible: !prev.visible }));
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

  const handleChangeTitle = title => {
    console.log("change tile")
    if (title === "edit")
      setEditModal(prev => ({ ...prev, mode: title }))
  }

  const handleReloadPage = ()=>{
    // console.log("reload")
    loadOrders();
  }

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12" md="12">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontWeight: "bold" }}>Tất cả đơn hàng</h3>
          </div>
        </CCol>
        <CCol xs="12" sm="12" md="12">
          <CCard>
            <CCardHeader >
              <CFormGroup row style={{ marginTop: 10, marginBottom: 10 }}>
                <CCol xs="12" sm="4">
                  <CInput style={{ padding: 10, height: 'auto' }} size="normal" id="searchOrder" name="searchOrder" placeholder="Tìm kiếm tên khách hàng..." value={search} onChange={handleSearch} />
                </CCol>
                <CCol xs="12" sm="8" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <CCol xs="12" sm="4">
                    <CSelect
                      style={{ padding: 12, height: 'auto' }}
                      name="status-all" id="status-all"
                      value={statusSelected}
                      onChange={handleSelectStatus}
                    >
                      <option value="0" key={0}>Tất cả trạng thái</option>
                      <option value="1" key={1}>Chờ xác nhận</option>
                      <option value="2" key={2}>Đang xử lí</option>
                      <option value="3" key={3}>Đang giao</option>
                      <option value="4" key={4}>Đã giao</option>
                      <option value="5" key={5}>Đã huỷ</option>
                      <option value="6" key={6}>Trả hàng</option>
                    </CSelect>
                  </CCol>
                </CCol>
              </CFormGroup>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                loading={loading}
                items={orders}
                fields={fields}
                // itemsPerPage={5}
                // pagination
                hover
                sorter={false}
                scopedSlots={{
                  'action':
                    (item, i) => (
                      <td style={{ display: 'flex', alignItems: 'center', height: 97, borderTop: i===0?0:'1px solid #d8dbe0'}}>
                        <Button title="Chi tiết" style={{border: '1px solid', borderColor: 'rgba(108, 117, 125, 0.25)', outline: 0 }} onClick={() => { toggleEdit(item.id, "detail")}}>
                          <VisibilityOutlinedIcon style={{ fontSize: 20, color: 'rgba(108, 117, 125, 1)' }}/>
                        </Button>
                      </td>
                    ),
                  'status':
                    (item) => (
                      <td className="td-middle">
                        <CBadge style={{fontSize: 13, padding: 8, borderRadius: 20}} color={getBadge(item.statusOrder.id)}>
                          {item.statusOrder.name}
                        </CBadge>
                      </td>
                    ),
                  'name':
                    (item) => (
                      <td className="td-middle">
                        {item.user.name}
                      </td>
                    ),
                  'id':
                    (item) => (
                      <td className="td-middle">
                        {item.id}
                      </td>
                    ),
                  'phone':
                    (item) => (
                      <td className="td-middle">
                        {item.address.numberPhone}
                      </td>
                    ),
                  'price':
                    (item) => (
                      <td className="td-middle">
                        {item.grandPrice}
                      </td>
                    ),
                  'date':
                    (item) => (
                      <td className="td-middle">
                        {item.createdAt}
                      </td>
                    ),
                }}
              />

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
                  <EditOrder reloadPage={handleReloadPage} orderId={editModal.id} mode={editModal.mode} handleChangeTitle={handleChangeTitle} />
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
export default AllOrders