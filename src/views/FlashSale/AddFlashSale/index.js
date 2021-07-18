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
  CPagination,
  CTextarea
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import axios from 'axios';
import {
  IconButton,
  Icon,
  FormGroup,
  Button,
} from "@material-ui/core";

import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';

import http from 'src/utils/http-common';
import AddNewProduct from 'src/views/products/AddNewProduct';
import EditProduct from 'src/views/products/EditProduct';

import PersonIcon from '@material-ui/icons/Person';
import { LocalShipping, LocationOn, SaveRounded } from '@material-ui/icons';
import swal from 'sweetalert';

const fields = [
  { key: 'product', label: 'Sản phẩm', _style: { width: '40%' } },
  { key: 'price', label: 'Đơn giá', _style: { width: '25%' } },
  { key: 'quantity', label: 'Số lượng', _style: { width: '20%' } },
  { key: 'total', label: 'Tổng tiền', _style: { width: '15%' } },
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

const AddFlashSale = props => {

  const [orders, setOrders] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [editModal, setEditModal] = useState({ visible: false, mode: 'detail', id: 0 });
  const [statusSelected, setStatusSelected] = useState(0);
  const [loading, setLoading] = useState(false);

  const [detailOrder, setDetailOrder] = useState({
    id: 0,
    user: { name: '', imageAvatar: { link: '' } },
    address: { numberPhone: '', name: '', specificAddress: '', province: { name: '' }, ward: { name: '', prefix: '' }, district: { name: '', prefix: '' } },
    shipping: { name: '' },
    listItem: [
      {
        id: 0,
        price: 0,
        quantity: 0,
        name: "",
        color: "",
        size: "",
        imageUrl: ""
      },
    ],
    payment: {
      name: ''
    },
    content: '',
    grandPrice: 0,
    subTotal: 0,
    discount: 0,
    shippingFee: 0,
    statusOrder: {
      id: 0,
      name: ''
    }
  });

  const [modeView, setModeView] = useState("");


  const loadOrderDetail = async () => {
    console.log(props.orderId)
    if (typeof (props.orderId) === "number" && props.orderId !== 0) {
      const response = await http.get(`/order/${props.orderId}/detail-order`);
      const data = await response.data;
      if (data === null || data === '' || typeof (data) === "undefined")
        return;


      setDetailOrder(data);
      setStatusSelected(data.statusOrder.id)
    }
  }

  useEffect(() => {
    loadOrderDetail();

    setModeView(props.mode)

  }, [props.orderId, props.mode])

  const toggle = () => {
    setVisibleModal(prev => !prev);
  }

  const toggleEdit = (id, mode) => {
    setEditModal(prev => ({ id: id, mode: mode, visible: !prev.visible }));
  }

  const handleSelectStatus = (e) => {
    setStatusSelected(prev => e.target.value)
  }

  const handleSaveStatus = async (e) => {
    const response = await http.put(`/order/${detailOrder.id}/update-status?stt=${statusSelected}`);
    const data = await response.data;

    console.log(data);
    swal({
      title: `${data}`,
      // text: "Nếu đồng ý thì mọi thay đổi sẽ biến mất.",
      icon: "success",
      buttons: {
        ok: "Đồng ý",
      },
      // dangerMode: true,
    }).then((value) => {
      if (value === 'ok') {
        loadOrderDetail();
        props.reloadPage();
      }
    });
  }

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12" md="12">
          <CCard>
            <CCardHeader >
              <CFormGroup row style={{ marginTop: 10, marginBottom: 10 }}>
                <CCol xs="12" sm="4">
                  <div>
                    <div style={{ display: 'flex' }}>
                      <CIcon size="xl" name="cil-calendar" />
                      <label style={{ fontWeight: 'bold', marginLeft: 5, fontSize: 18 }}>{detailOrder.createdAt}</label>
                    </div>
                    <label>Mã đơn hàng: {detailOrder.id}</label>
                  </div>
                </CCol>
                <CCol xs="12" sm="8" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <CCol xs="12" sm="5">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <p style={{ marginBottom: 2 }}>Trạng thái đơn hàng</p>
                      <div style={{ display: 'flex' }}>
                        <CSelect
                          style={{ padding: 12, height: 'auto', marginRight: 5 }}
                          name="status-all" id="status-all"
                          value={statusSelected}
                          onChange={handleSelectStatus}
                        >
                          <option value="1" key={1}>Chờ xác nhận</option>
                          <option value="2" key={2}>Đang xử lí</option>
                          <option value="3" key={3}>Đang giao</option>
                          <option value="4" key={4}>Đã giao</option>
                          <option value="5" key={5}>Đã huỷ</option>
                          <option value="6" key={6}>Trả hàng</option>
                        </CSelect>
                        <Button title="Lưu thay đổi" color="primary" style={{ display: statusSelected.toString() !== detailOrder.statusOrder.id.toString() ? "inline" : "none", border: '1px solid rgba(108, 117, 125, 0.2)', outline: 0 }} onClick={handleSaveStatus}>
                          <SaveRounded />
                        </Button>
                      </div>
                    </div>
                  </CCol>
                </CCol>
              </CFormGroup>
            </CCardHeader>
            <CCardBody>
              <CCol xs="12" sm="12" md="12" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
                <FormGroup row>
                  {/* <div className="icon-order-custom"> */}
                  <img src={detailOrder.user.imageAvatar.link} style={{ width: 50, height: 50, borderRadius: 30 }} />
                  {/* </div> */}
                  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
                    <p className="mb-order-custom" style={{ fontWeight: 'bold', fontSize: 17 }}>Khách hàng</p>
                    <p className="mb-order-custom">{detailOrder.address.name}</p>
                    <p className="mb-order-custom">{detailOrder.address.numberPhone}</p>
                  </div>
                </FormGroup>
                <FormGroup row>
                  <div className="icon-order-custom">
                    <LocalShipping style={{ fontSize: 30 }} color="primary" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
                    <p className="mb-order-custom" style={{ fontWeight: 'bold', fontSize: 17 }}>Đơn vị vận chuyển</p>
                    <p className="mb-order-custom">{detailOrder.shipping.name}</p>
                  </div>
                </FormGroup>
                <FormGroup row>
                  <div className="icon-order-custom">
                    <LocationOn style={{ fontSize: 30 }} color="primary" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
                    <p className="mb-order-custom" style={{ fontWeight: 'bold', fontSize: 17 }}>Nơi nhận</p>
                    <p className="mb-order-custom">{detailOrder.address.specificAddress}</p>
                    <p className="mb-order-custom">{detailOrder.address.ward.prefix} {detailOrder.address.ward.name}, {detailOrder.address.district.prefix} {detailOrder.address.district.name}, {detailOrder.address.province.name}</p>
                  </div>
                </FormGroup>
              </CCol>

              <CCol xs="12" sm="12" md="12">
                <FormGroup row>
                  <CCol xs="12" sm="9" md="9">
                    <CDataTable
                      loading={loading}
                      items={detailOrder.listItem}
                      fields={fields}
                      // itemsPerPage={5}
                      // pagination
                      hover
                      sorter={false}
                      scopedSlots={{
                        'product':
                          (item, i) => (
                            <td style={{ display: 'flex', alignItems: 'center', borderTop: i === 0 ? 0 : '1px solid #d8dbe0' }}>
                              <img src={item.imageUrl} style={{ width: 40, height: 50, marginRight: 5 }} />
                              {item.name} {item.color} {item.size}
                            </td>
                          ),
                        'price':
                          (item) => (
                            <td className="td-middle" >
                              {item.price}
                            </td>
                          ),
                        'quantity':
                          (item) => (
                            <td className="td-middle">
                              {item.quantity}
                            </td>
                          ),
                        'total':
                          (item) => (
                            <td className="td-middle">
                              {item.price * item.quantity}
                            </td>
                          )
                      }}
                    />
                    <div>
                      <div className="box-grandTotal">
                        <div style={{ marginRight: 40 }}>
                          <p className="mb-order-custom">Tiền sản phẩm:</p>
                          <p className="mb-order-custom">Tiền vận chuyển:</p>
                          <p className="mb-order-custom">Tiền giảm giá:</p>
                          <h4 className="mb-order-custom">Tổng tiền đơn hàng:</h4>
                        </div>
                        <div>
                          <p className="mb-order-custom">{detailOrder.subTotal}</p>
                          <p className="mb-order-custom">{detailOrder.shippingFee}</p>
                          <p className="mb-order-custom">{detailOrder.discount}</p>
                          <h4 className="mb-order-custom">{detailOrder.grandPrice}</h4>
                        </div>

                      </div>
                    </div>
                  </CCol>
                  <CCol xs="12" sm="3" md="3">
                    <div>
                      <div className="box-payment">
                        <h6 className="mb-order-custom" style={{ fontWeight: 'bold' }}>Phương thức thanh toán</h6>
                        <p className="mb-order-custom">{detailOrder.payment.name}</p>
                      </div>

                      <div style={{ marginTop: 25 }}>
                        <p style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 3 }}>Lưu ý</p>
                        <CTextarea
                          disabled
                          className="disable-detail"
                          name="note-order"
                          id="note-order"
                          rows="2"
                          value={detailOrder.content}
                        />
                      </div>
                    </div>
                  </CCol>
                </FormGroup>


                {/* <CModal
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
                    <EditOrder productId={editModal.id} mode={editModal.mode} handleChangeTitle={handleChangeTitle} />
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={toggleEdit}>Đóng</CButton>
                  </CModalFooter>
                </CModal> */}
              </CCol>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

AddFlashSale.defaultProps = {
  orderId: 0
}

export default AddFlashSale
