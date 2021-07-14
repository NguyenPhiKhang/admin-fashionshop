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
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import http from 'src/utils/http-common';
import EditOrder from '../orders/EditOrder';
import CardUserComponent from 'src/components/CardUser';

const fields = [
  { key: 'id', label: 'ID', _style: { width: '10%' } },
  { key: 'name', label: 'Tên người dùng', _style: { width: '20%' } },
  { key: 'image', label: 'Ảnh đại diện', _style: { width: '10%' } },
  // { key: 'phone', label: 'Số điện thoại', _style: { width: '15%' } },
  { key: 'email', label: 'Email', _style: { width: '18%' } },
  { key: 'date', label: 'Ngày đăng ký', _style: { width: '15%' } },
  { key: 'status', label: 'Trạng thái', _style: { width: '15%' } },
  { key: 'action', label: 'Action', _style: { width: '12%' } },
]

const getBadge = status => {
  switch (status) {
    case true: return 'success'
    case false: return 'danger'
    default: return 'primary'
  }
}

const UserPage = () => {

  const [users, setUsers] = useState([]);
  const [editModal, setEditModal] = useState({ visible: false, mode: 'detail', id: 0 });
  const [statusSelected, setStatusSelected] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [search, setSearch] = useState("")


  const loadTotalPage = async () => {
    const response = await http.get(`/users/count-users-filter?status=${statusSelected}&search=${search}`);
    const data = await response.data;

    let totalPageNew = Math.ceil(data / pageSize);

    setTotalPage(totalPageNew);
  }

  const loadUsers = async () => {
    setLoading(true);
    const response = await http.get(`/users/get-users-filter?status=${statusSelected}&p=${page}&p_size=${pageSize}&search=${search}`);
    const data = await response.data;
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (page === 1)
      loadUsers();
    else {
      setPage(1);
    }
    loadTotalPage();
  }, [statusSelected, search])


  useEffect(() => {
    loadUsers();
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

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12" md="12">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontWeight: "bold" }}>Tất cả người dùng</h3>
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
                      <option value="-1" key={-1}>Tất cả trạng thái</option>
                      <option value="1" key={1}>Đang hoạt động</option>
                      <option value="0" key={0}>Không hoạt động</option>
                    </CSelect>
                  </CCol>
                </CCol>
              </CFormGroup>
            </CCardHeader>
            <CCardBody>
              {/* <CDataTable
                loading={loading}
                items={users}
                fields={fields}
                // itemsPerPage={5}
                // pagination
                hover
                sorter={false}
                scopedSlots={{
                  'action':
                    (item, i) => (
                      <td style={{ display: 'flex', alignItems: 'center', height: 97, borderTop: i === 0 ? 0 : '1px solid #d8dbe0' }}>
                        <Button title="Chi tiết" style={{ border: '1px solid', borderColor: 'rgba(108, 117, 125, 0.25)', outline: 0, height: 40, marginRight: 5 }} onClick={() => { toggleEdit(item.id, "detail") }}>
                          <VisibilityOutlinedIcon style={{ fontSize: 20, color: 'rgba(108, 117, 125, 1)' }} />
                        </Button>
                        <Button title="Vô hiệu hoá người dùng" style={{ border: '1px solid', borderColor: 'red', outline: 0, height: 40 }} onClick={() => { toggleEdit(item.id, "detail") }}>
                          <HighlightOffIcon style={{ fontSize: 20, color: 'red' }} />
                        </Button>
                      </td>
                    ),
                  'status':
                    (item) => (
                      <td className="td-middle">
                        <CBadge style={{ fontSize: 13, padding: 8, borderRadius: 20 }} color={getBadge(item.active)}>
                          {item.active ? "Đang hoạt động" : "Không hoạt động"}
                        </CBadge>
                      </td>
                    ),
                  'name':
                    (item) => (
                      <td className="td-middle">
                        {item.name}
                      </td>
                    ),
                  'email':
                    (item) => (
                      <td className="td-middle">
                        {item.email}
                      </td>
                    ),
                  'id':
                    (item) => (
                      <td className="td-middle">
                        {item.id}
                      </td>
                    ),
                  'date':
                    (item) => (
                      <td className="td-middle">
                        {item.timeCreated}
                      </td>
                    ),
                  'image':
                    (item) => (
                      <td className="td-middle">
                        <img src={item.image_url} alt="imgae_product" style={{ width: 50, height: 50 }} className="img-thumbnail-table" />
                      </td>
                    )
                }}
              /> */}
              <CFormGroup row>
                {
                  users.map((u, idx) => (
                    <CCol xs="6" sm="4" lg="4" xl="3">
                      <CardUserComponent id_user={u.id} name={u.name} image_url={u.image_url} email={u.email} />
                    </CCol>
                  ))
                }
              </CFormGroup>

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
                  <EditOrder orderId={editModal.id} mode={editModal.mode} handleChangeTitle={handleChangeTitle} />
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
export default UserPage