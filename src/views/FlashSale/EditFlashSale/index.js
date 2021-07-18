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
  CTextarea,
  CLabel
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

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AddProductFlashSale from '../Add Product';

const fields = [
  { key: 'product', label: 'Sản phẩm', _style: { width: '40%' } },
  { key: 'price', label: 'Giá gốc', _style: { width: '10%' } },
  { key: 'quantity', label: 'SL hiện tại', _style: { width: '8%' } },
  { key: 'percentDiscount', label: 'Phần trăm khuyến mãi', _style: { width: '12%' } },
  { key: 'quantityDiscount', label: 'SL khuyến mãi', _style: { width: '20%' } },
  { key: 'saled', label: 'Đã bán', _style: { width: '10%' } },
]

const fieldsEdit = [
  { key: 'product', label: 'Sản phẩm', _style: { width: '40%' } },
  { key: 'price', label: 'Giá gốc', _style: { width: '10%' } },
  { key: 'quantity', label: 'SL hiện tại', _style: { width: '8%' } },
  { key: 'percentDiscount', label: 'Phần trăm khuyến mãi', _style: { width: '12%' } },
  { key: 'quantityDiscount', label: 'SL khuyến mãi', _style: { width: '12%' } },
  { key: 'saled', label: 'Đã bán', _style: { width: '8%' } },
  { key: 'action', label: 'Action', _style: { width: '10%' } },
]

const getBadge = statusId => {
  switch (statusId) {
    case 1: return '#5CB466'
    case 2: return '#EEB342'
    case 3: return '#CFD2D7'
    default: return 'primary'
  }
}

const EditFlashSale = props => {

  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [addProductModal, setAddProductModal] = useState({visible: false});

  const [flashSale, setFlashSale] = useState({ id: 0, startTime: '', endTime: '' });
  const [dataProductFlashSale, setDataProductFlashSale] = useState(
    [{
      id: 0,
      percentDiscount: 0,
      quantity: 0,
      saleAmount: 0,
      product_item: {
        name: "",
        price: {
          price_max: 0,
          price_min: 0
        },
        id: 0,
        img_url: "",
        quantity: 0
      }
    }]
  );
  const [page, setPage] = useState(1);
  // const [totalPage, setTotalPage] = useState(1);

  const [modeView, setModeView] = useState("");

  const [search, setSearch] = useState("");

  const loadProductFlashSales = async () => {
    // if (typeof (props.dataFlashSale.id) !== "undefined") {
    // const response = await http.get(`/flashsale/${props.dataFlashSale.id}/products-mobile?p=${page}&p_size=5`);
    const response = await http.get(`/flashsale/${props.dataFlashSale.id}/products-fs-admin?p=${page}&p_size=${pageSize}&s=${search}`);
    const data = await response.data;

    setDataProductFlashSale(data);
  }

  const loadTotalPage = async () => {
    const response = await http.get(`/flashsale/${props.dataFlashSale.id}/count-product-fs-admin?s=${search}`);
    const data = await response.data;

    console.log("total page")
    console.log(data)

    // let totalPageNew = Math.ceil(data / pageSize);

    setTotalPage(data);
  }

  useEffect(() => {
    setModeView(props.mode)
    console.log("change data flashsale")
    console.log(props.dataFlashSale)
    setFlashSale(props.dataFlashSale);
    if (page === 1)
      loadProductFlashSales();
    else setPage(1)
    loadTotalPage();
  }, [props.dataFlashSale, props.mode])


  useEffect(() => {
    loadProductFlashSales();
  }, [page]);

  useEffect(() => {

    if (page === 1)
      loadProductFlashSales();
    else {
      setPage(1);
    }
    loadTotalPage();

  }, [search])

  const handleSaveStatus = async (e) => {
    // const response = await http.put(`/order/${detailOrder.id}/update-status?stt=${statusSelected}`);
    // const data = await response.data;

    // console.log(data);
    // swal({
    //   title: `${data}`,
    //   // text: "Nếu đồng ý thì mọi thay đổi sẽ biến mất.",
    //   icon: "success",
    //   buttons: {
    //     ok: "Đồng ý",
    //   },
    //   // dangerMode: true,
    // }).then((value) => {
    //   if (value === 'ok') {
    //     loadOrderDetail();
    //     props.reloadPage();
    //   }
    // });
  }

  const handleChangeAttrFlashSale = (attr) => {
    setFlashSale(prev => ({ ...prev, ...attr }))
  }

  const handleChangePage = number => {
    setPage(number);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleOnCloseModalAdd = (e)=>{
    setAddProductModal(prev=>({...prev, visible: !prev.visible}));
  }

  const handleDeleteProduct = async (item) => {
    swal({
      title: `Bạn muốn xoá sản phẩm này khỏi chương trình Flash Sale?`,
      // text: "Nếu đồng ý thì mọi thay đổi sẽ biến mất.",
      icon: "warning",
      buttons: {
        ok: "Đồng ý",
      },
      // dangerMode: true,
    }).then(async (value) => {
      if (value === 'ok') {
        const response =await http.delete(`/flashsale/${item.id}/remove-product-flashsale`)
        const data = await response.data;

        swal({
          title: `${data}`,
          icon: 'success',
          button: "Đóng"
        }).then((v)=>{
          loadProductFlashSales();
          loadTotalPage();
        })

      }
    });
  }

  const handleCLickAddProduct = ()=>{
    setAddProductModal(prev=>({...prev, visible: !prev.visible}))
  }

  return (
    <>
      <CRow>
        <CCol xs="12" sm="12" md="12">
          <CCard>
            <CCardHeader >
              <CFormGroup row style={{ marginTop: 0, marginBottom: 10 }}>
                <CCol xs="12" sm="12">
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                      <label style={{ fontSize: 23, fontWeight: 'bold', marginBottom: 5 }}>#ID: {flashSale.id}</label>
                      <div style={{
                        height: 30, width: 'auto', marginLeft: 10,
                        backgroundColor: getBadge(flashSale.status), fontSize: 14,
                        padding: 5, textAlign: 'center', borderRadius: 10, fontWeight: 'bold'
                      }}>
                        {flashSale.status === 1 ? "Đang diễn ra" : flashSale.status == 2 ? "Chưa diễn ra" : "Kết thúc"}
                      </div>
                    </div>
                    <CButton className="btn-create btn-brand mr-1 mb-1" style={{ display: modeView === "edit" ? "inline" : "none" }} onClick={handleCLickAddProduct}>
                      <CIcon name="cil-plus" /><span className="mfs-2">Thêm sản phẩm</span>
                    </CButton>
                  </div>

                </CCol>
                <CCol xs="12" sm="12">
                  <CFormGroup row>
                    <CCol xs="12" md="4">
                      <CCol md="12">
                        <CLabel htmlFor="name">Ngày chương trình</CLabel>
                      </CCol>
                      <CCol xs="12" md="12">
                        <CInput disabled={modeView === "edit" ? false : true} className="disable-detail" style={{ padding: 10, height: 'auto' }} type="date" id="date-flashsale" value={flashSale.date} onChange={(e) => handleChangeAttrFlashSale({ date: e.target.value })} />
                      </CCol>
                    </CCol>
                    <CCol xs="12" md="4">
                      <CCol md="12">
                        <CLabel htmlFor="name">Thời gian bắt đầu</CLabel>
                      </CCol>
                      <CCol xs="12" md="12">
                        <CInput disabled={modeView === "edit" ? false : true} className="disable-detail" style={{ padding: 10, height: 'auto' }} type="time" id="time-flashsale-start" value={flashSale.startTime} onChange={(e) => handleChangeAttrFlashSale({ startTime: e.target.value })} />
                      </CCol>
                    </CCol>
                    <CCol xs="12" md="4">
                      <CCol md="12">
                        <CLabel htmlFor="name">Thời gian kết thúc</CLabel>
                      </CCol>
                      <CCol xs="12" md="12">
                        <CInput disabled={modeView === "edit" ? false : true} className="disable-detail" style={{ padding: 10, height: 'auto' }} type="time" id="time-flashsale-end" value={flashSale.endTime} onChange={(e) => handleChangeAttrFlashSale({ endTime: e.target.value })} />
                      </CCol>
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CFormGroup>
            </CCardHeader>
            <CCardBody>
              <CCol xs="12" sm="12" md="12">
                <FormGroup row>
                  <CCol xs="12" sm="12" md="12">
                    <CInput style={{ padding: 10, marginBottom: 20, height: 'auto' }} size="normal" id="searchCategory" name="searchCategory" placeholder="Tìm kiếm sản phẩm flash sale..." value={search} onChange={handleSearch} />
                    <CDataTable
                      loading={loading}
                      items={dataProductFlashSale}
                      fields={modeView === "edit" ? fieldsEdit : fields}
                      // itemsPerPage={5}
                      // pagination
                      hover
                      sorter={false}
                      scopedSlots={{
                        'product':
                          (item, i) => (
                            <td style={{ display: 'flex', alignItems: 'center', borderTop: i === 0 ? 0 : '1px solid #d8dbe0' }}>
                              <img src={item.product_item.img_url} style={{ width: 40, height: 50, marginRight: 5 }} />
                              {item.product_item.name}
                            </td>
                          ),
                        'price':
                          (item) => (
                            <td className="td-middle" >
                              {item.product_item.price.price_max}
                            </td>
                          ),
                        'quantity':
                          (item) => (
                            <td className="td-middle">
                              {item.product_item.quantity}
                            </td>
                          ),
                        'percentDiscount':
                          (item) => (
                            <td className="td-middle">
                              {item.percentDiscount}
                            </td>
                          ),
                        'quantityDiscount':
                          (item) => (
                            <td className="td-middle">
                              {item.quantity}
                            </td>
                          ),
                        'saled':
                          (item) => (
                            <td className="td-middle">
                              {item.saleAmount}
                            </td>
                          ),
                        'action':
                          (item, i) => (
                            <td style={{ borderTop: i === 0 ? 0 : '1px solid #d8dbe0', padding: 15, paddingTop: 20 }}>
                              {/* <IconButton title="Chi tiết" style={{ outline: 0}}>
                                <DeleteOutlineIcon style={{ color: 'rgba(108, 117, 125, 1)', marginTop: 5, marginBottm: 5 }} />
                              </IconButton> */}

                              <CButton
                                size="sm" className="btn-pinterest btn-brand mr-1 mb-1"
                                onClick={() => handleDeleteProduct(item)}>
                                <CIcon size="sm" name="cil-trash" /></CButton>
                            </td>
                          ),
                      }}
                    />
                    <div>
                      <div className="box-grandTotal">
                        <div style={{ marginRight: 40 }}>
                          <p className="mb-order-custom">Tồng sản phẩm:</p>
                          <p className="mb-order-custom">Tổng bán:</p>
                        </div>
                        <div>
                          <p className="mb-order-custom">{flashSale.totalProduct}</p>
                          <p className="mb-order-custom">{flashSale.totalSale}</p>
                        </div>
                      </div>
                    </div>
                  </CCol>
                </FormGroup>


                <CModal
                  scrollable
                  show={addProductModal.visible}
                  onClose={handleOnCloseModalAdd}
                  size="xl"
                  className="inactive-modal"
                >
                  <CModalHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <CModalTitle>Thêm sản phẩm flashsale</CModalTitle>
                    <CButton onClick={handleOnCloseModalAdd}><CIcon name='cil-x' size="sm" /></CButton>
                  </CModalHeader>
                  <CModalBody>
                    <AddProductFlashSale flashSaleId={flashSale.id} handleClose={handleOnCloseModalAdd}/>
                    {/* // productId={editModal.id} mode={editModal.mode} handleChangeTitle={handleChangeTitle}  */}
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="secondary" onClick={handleOnCloseModalAdd}>Đóng</CButton>
                  </CModalFooter>
                </CModal>
              </CCol>
            </CCardBody>
            <CCardFooter style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>Trang: {page} / {Math.ceil(totalPage / pageSize)}</div>
              <CPagination
                align="end"
                activePage={page}
                pages={Math.ceil(totalPage / pageSize)}
                onActivePageChange={n => handleChangePage(n)}
              />
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

EditFlashSale.defaultProps = {
  dataFlashSale: { id: 0, startTime: '', endTime: '' },
  mode: 'detail'
}

export default EditFlashSale
