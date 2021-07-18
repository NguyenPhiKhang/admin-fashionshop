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
  CLabel
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import axios from 'axios';
import {
  IconButton,
  Icon,
  Checkbox,
  FormGroup,
} from "@material-ui/core";

import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';

import http from 'src/utils/http-common';
import AddNewProduct from 'src/views/products/AddNewProduct';
import EditProduct from 'src/views/products/EditProduct';
import swal from 'sweetalert';

const fields = [
  { key: 'checkProduct', label: '', _style: { width: '10%' } },
  { key: 'id', label: 'ID', _style: { width: '5%' } },
  { key: 'name', label: 'Tên sản phẩm', _style: { width: '30%' } },
  { key: 'img_url', label: 'Ảnh', _style: { width: '10%' } },
  { key: 'category', label: 'Danh mục', _style: { width: '15%' } },
  { key: 'price', label: 'Giá', _style: { width: '10%' } },
  { key: 'quantity', label: 'Tồn kho', _style: { width: '10%' } },
  { key: 'order_count', label: 'Đã bán', _style: { width: '10%' } },
]

const AddProductFlashSale = (props) => {

  const [products, setProducts] = useState([]);
  const [categorySelected, setCategorySelected] = useState(0);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("")

  const [discount, setDiscount] = useState({ percent: 0, quantity: 0 });
  const [productsFlashSale, setProductsproductsFlashSale] = useState([]);


  const loadTotalPage = async () => {

    const response = search !== "" ? await http.get(`/products/count-product-filter?category_id=${categorySelected}&status=1&search=${search}`) : await http.get(`/products/count-product-filter?category_id=${categorySelected}&status=1`);
    const data = await response.data;

    let totalPageNew = Math.ceil(data / pageSize);

    setTotalPage(totalPageNew);
  }

  const loadProducts = async () => {
    setLoading(true);
    const response = await http.get(`/products/get-all-filter?p=${page}&p_size=5&category_id=${categorySelected}&status=1&search=${search}`);
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
  }, [categorySelected, search])


  useEffect(() => {
    console.log("useeffect 2")
    loadProducts();

    console.log(productsFlashSale)
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

  // const toggle = () => {
  //   setVisibleModal(prev => !prev);
  // }

  // const toggleEdit = (id, mode) => {
  //   setEditModal(prev => ({ id: id, mode: mode, visible: !prev.visible }));
  // }

  const handleSelectCategory = async (e) => {
    setCategorySelected(e.target.value);
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleChangePage = number => {
    setPage(number);
  };

  // const handleChangeTitle = title => {
  //   console.log("change tile")
  //   if (title === "edit")
  //     setEditModal(prev => ({ ...prev, mode: title }))
  // }

  const handleChangeDiscount = (value) => {
    setDiscount(prev => ({ ...prev, ...value }));
  }

  const handleCheckProduct = (e, id) => {
    if (e.target.checked) {
      setProductsproductsFlashSale(prev => prev.concat(id));
    } else {
      setProductsproductsFlashSale(prev => removeItemOnce(prev, id));
    }
  }


  const handleClickFlashSale = () => {
    console.log(discount)
    console.log(productsFlashSale)

    swal({
      title: "Bạn muốn thêm sản phẩm vào chương flash sale này?",
      // text: "Nếu đồng ý thì mọi thay đổi sẽ biến mất.",
      icon: "info",
      buttons: {
        ok: "Đồng ý",
        cancel: "Huỷ"
      },
      // dangerMode: true,
    }).then(async (value) => {
      if (value === 'ok') {
        // const formData = new FormData();
        // formData.append("percent", discount.percent);
        // formData.append("quantity", discount.quantity);
        // formData.append("listProductId", productsFlashSale);

        const response = await http.post(`/flashsale/${props.flashSaleId}/add-product-flashsale`, {
          percent: discount.percent,
          quantity: discount.quantity,
          listProductId: productsFlashSale
        });
        const data = response.data;

        swal(`${data}`, {
          icon: "success",
        }).then(v=>{
          setDiscount(prev=>({percent: 0, quantity: 0}));
          setProductsproductsFlashSale([]);
          props.handleClose();
        });
      }
    });

  }

  function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  return (
    <>
      <CRow>

        <CCol xs="12" sm="12" md="12">
          <CCard>
            <CCardHeader >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex' }}>
                  <CFormGroup>
                    <CLabel htmlFor="discount">Giảm giá(%)</CLabel>
                    <CInput style={{ width: 200, marginRight: 20 }} type="number" id="discount-flashsale" name="discount-flashsale"
                      max={100} min={0} placeholder="Nhập giảm giá..."
                      value={discount.percent}
                      onChange={(e) => handleChangeDiscount({ percent: e.target.value })}
                    />
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="discount">Nhập số lượng khuyến mãi</CLabel>
                    <CInput style={{ width: 200 }} type="number" id="quantity-flashsale" name="quantity-flashsale"
                      min={0} placeholder="Nhập số lượng..."
                      value={discount.quantity}
                      onChange={(e) => handleChangeDiscount({ quantity: e.target.value })}
                    />
                  </CFormGroup>
                </div>
                <div>
                  <CButton color="primary" className="btn-brand mr-1 mb-1" onClick={handleClickFlashSale}>
                    <CIcon name="cil-plus" /><span className="mfs-2">Thêm vào flashsale</span>
                  </CButton>
                </div>

              </div>
            </CCardHeader>
            <CCardBody>
              <CFormGroup row style={{ marginTop: 10, marginBottom: 10 }}>
                <CCol xs="12" sm="4">
                  <CInput style={{ padding: 10, height: 'auto' }} size="normal" id="searchProduct-flashsale" name="searchProduct-flashsale" placeholder="Tìm kiếm sản phẩm..." value={search} onChange={handleSearch} />
                </CCol>
                <CCol xs="12" sm="8" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <CCol xs="12" sm="4">
                    <CSelect
                      style={{ padding: 12, height: 'auto' }}
                      name="categories-all-flashsale" id="categories-all-flashsale" value={categorySelected}
                      onChange={handleSelectCategory}
                    >
                      <option value="0" key={0}>Tất Cả Danh Mục</option>
                      {
                        categoriesList.map(v => <option value={v.id} key={v.id}>{v.name}</option>)
                      }
                    </CSelect>
                  </CCol>
                </CCol>
              </CFormGroup>
              <CDataTable
                loading={loading}
                items={products}
                fields={fields}
                // itemsPerPage={5}
                // pagination
                hover
                sorter={false}
                scopedSlots={{

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
                        <img src={item.img_url} alt="imgae_product" width='60' className="img-thumbnail-table" />
                      </td>
                    ),
                  'checkProduct':
                    (item) => (
                      <td className="td-middle">
                        <Checkbox
                          checked={productsFlashSale.indexOf(item.id) > -1}
                          color="primary"
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                          onChange={(e) => handleCheckProduct(e, item.id)}
                        />
                      </td>
                    )
                }}
              />
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
export default AddProductFlashSale