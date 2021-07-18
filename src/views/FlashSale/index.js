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
import BorderColorIcon from '@material-ui/icons/BorderColor';

import http from 'src/utils/http-common';
import EditOrder from '../orders/EditOrder';
import EditFlashSale from './EditFlashSale';

const fields = [
  { key: 'id', label: 'ID', _style: { width: '8%' } },
  { key: 'date', label: 'Ngày', _style: { width: '12%' } },
  { key: 'startTime', label: 'Bắt đầu', _style: { width: '10%' } },
  { key: 'endTime', label: 'Kết thúc', _style: { width: '10%' } },
  { key: 'totalProduct', label: 'Tổng sản phẩm', _style: { width: '15%' } },
  { key: 'totalSale', label: 'Số lượng bán được', _style: { width: '15%' } },
  { key: 'status', label: 'Trạng thái', _style: { width: '20%' } },
  { key: 'action', label: 'Action', _style: { width: '10%' } },
]

const getBadge = statusId => {
  switch (statusId) {
    case 1: return 'success'
    case 2: return 'warning'
    case 3: return 'secondary'
    default: return 'primary'
  }
}

const FlashSale = () => {

  const [flashSales, setFlashSales] = useState([]);
  const [editModal, setEditModal] = useState({ visible: false, mode: 'detail', id: 0, data: {id:0} });
  const [statusSelected, setStatusSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // const [dataFlashSale, setDataFlashSale] = useState([]); 


  const loadTotalPage = async () => {
    const response = await http.get(`/flashsale/count-for-table?status=${statusSelected}`);
    const data = await response.data;

    let totalPageNew = Math.ceil(data / pageSize);

    setTotalPage(totalPageNew);
  }

  const loadFlashSales = async () => {
    setLoading(true);
    const response = await http.get(`/flashsle/get-for-table?p=${page}&p_size=5&status=${statusSelected}`);
    const data = await response.data;
    setFlashSales(data);
    setLoading(false);

    console.log(data)
  };

  useEffect(() => {
    if (page === 1)
      loadFlashSales();
    else {
      setPage(1);
    }
    loadTotalPage();
  }, [statusSelected])


  useEffect(() => {
    loadFlashSales();
  }, [page]);

  const toggleEdit = (id, mode, data) => {
    setEditModal(prev => ({ id: id, mode: mode, data: data, visible: !prev.visible }));
  }

  const handleCloseModal=()=>{
    console.log("on close")
    console.log(editModal.data)
    setEditModal(prev => ({ ...prev, visible: !prev.visible }));
  }

  const handleSelectStatus = (e) => {
    setStatusSelected(e.target.value)
  }

  const handleChangePage = number => {
    setPage(number);
  };

  const handleChangeTitle = title => {
    console.log("change tile")
    if (title === "edit")
      setEditModal(prev => ({ ...prev, mode: title }))
  }

  const handleReloadPage = () => {
    // console.log("reload")
    loadFlashSales();
  }

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12" md="12">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontWeight: "bold" }}>Flash Sale</h3>
          </div>
        </CCol>
        <CCol xs="12" sm="12" md="12">
          <CCard>
            <CCardHeader >
              <CFormGroup row style={{ marginTop: 10, marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
                <CCol xs="12" sm="4" md="4">
                  {/* <FormGroup> */}
                  {/* <CButton size="lg" color="primary" style={{ marginRight: 10 }} className="btn-create"><CIcon name="cil-plus" style={{ paddingRight: 2 }} />Thêm chương trình</CButton> */}
                  {/* </FormGroup> */}
                </CCol>
                <CCol xs="12" sm="4" md="4">
                  <CSelect
                    style={{ padding: 12, height: 'auto' }}
                    name="status-flashsale" id="status-flashsale"
                    value={statusSelected}
                    onChange={handleSelectStatus}
                  >
                    <option value="0" key={0}>Tất cả trạng thái</option>
                    <option value="1" key={1}>Đang diễn ra</option>
                    <option value="2" key={2}>Chưa diễn ra</option>
                    <option value="3" key={3}>Kết thúc</option>
                  </CSelect>
                </CCol>
              </CFormGroup>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                loading={loading}
                items={flashSales}
                fields={fields}
                // itemsPerPage={5}
                // pagination
                hover
                sorter={false}
                scopedSlots={{
                  'action':
                    (item, i) => (
                      <td style={{ display: 'flex', alignItems: 'center', borderTop: i === 0 ? 0 : '1px solid #d8dbe0' }}>
                        <IconButton title="Chi tiết" style={{  outline: 0, marginRight: 3 }} onClick={() => { toggleEdit(item.id, "detail", item) }}>
                          <VisibilityOutlinedIcon style={{ fontSize: 20, color: 'rgba(108, 117, 125, 1)', marginTop: 5, marginBottm: 5 }} />
                        </IconButton>
                        <IconButton title="Sửa" style={{outline: 0, display: item.status === 2 ? "inline" : "none" }} onClick={() => { toggleEdit(item.id, "edit", item) }}>
                          <BorderColorIcon style={{ fontSize: 20, color: 'rgba(66, 135, 245, 1)' }} />
                        </IconButton>
                      </td>
                    ),
                  'status':
                    (item) => (
                      <td className="td-middle">
                        <CBadge style={{ fontSize: 13, padding: 8, borderRadius: 20 }} color={getBadge(item.status)}>
                          {item.status === 1 ? "Đang diễn ra" : item.status == 2 ? "Chưa diễn ra" : "Kết thúc"}
                        </CBadge>
                      </td>
                    ),
                  'date':
                    (item) => (
                      <td className="td-middle">
                        {item.date}
                      </td>
                    ),
                  'id':
                    (item) => (
                      <td className="td-middle">
                        {item.id}
                      </td>
                    ),
                  'startTime':
                    (item) => (
                      <td className="td-middle">
                        {item.startTime}
                      </td>
                    ),
                  'endTime':
                    (item) => (
                      <td className="td-middle">
                        {item.endTime}
                      </td>
                    ),
                  'totalProduct':
                    (item) => (
                      <td className="td-middle">
                        {item.totalProduct}
                      </td>
                    ),
                  'totalSale':
                    (item) => (
                      <td className="td-middle">
                        {item.totalSale}
                      </td>
                    ),
                }}
              />

              <CModal
                scrollable
                show={editModal.visible}
                onClose={handleCloseModal}
                size="xl"
                className="inactive-modal"
              >
                <CModalHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CModalTitle>{editModal.mode === "edit" ? "Sửa Flash Sale" : "Chi tiết flashsale"}</CModalTitle>
                  <CButton onClick={toggleEdit}><CIcon name='cil-x' size="sm" /></CButton>
                </CModalHeader>
                <CModalBody>
                  <EditFlashSale reloadPage={handleReloadPage} dataFlashSale={editModal.data} mode={editModal.mode} handleChangeTitle={handleChangeTitle} />
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={handleCloseModal}>Đóng</CButton>
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
export default FlashSale