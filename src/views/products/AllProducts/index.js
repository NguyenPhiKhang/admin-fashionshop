import React, { useEffect, useState } from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow
} from '@coreui/react'

import usersData from '../../users/UsersData'
import CIcon from '@coreui/icons-react'
import axios from 'axios';
import {
  IconButton,
  Icon,
} from "@material-ui/core";

import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}
const fields = [
  { key: 'id', label: 'Id', _style: { width: '5%' }},
  { key: 'name', label: 'Tên sản phẩm', _style: { width: '28%' } },
  { key: 'category', label: 'Danh mục', _style: { width: '20%' }},
  { key: 'img_url', label: 'Ảnh' , _style: { width: '10%' }},
  { key: 'price', label: 'Giá', _style: { width: '10%' }},
  { key: 'quantity', label: 'Tồn kho', _style: { width: '8%' }},
  { key: 'order_count', label: 'Đã bán', _style: { width: '8%' } },
  { key: 'action', label: 'Action', _style: { width: '10%' }}
]

const AllProducts = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadAllProduct = async () => {
      const response = await axios.get("http://localhost:8080/api/v1/cat/259/products?filter=new&p=1");
      const data = await response.data;
      setProducts(data);
    };

    loadAllProduct();
  }, [])

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Tất cả sản phẩm</h3>
                <CButton className="btn-create btn-brand mr-1 mb-1"><CIcon name="cil-plus" /><span className="mfs-2">Nhập hàng</span></CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={products}
                fields={fields}
                itemsPerPage={5}
                pagination
                sorter = {false}
                scopedSlots={{
                  'action':
                    (item) => (
                      <td style={{display: 'flex', alignItems: 'center', height: 97}}>
                        <IconButton style={{outline: 'none'}} title="Xem chi tiết">
                          <VisibilityOutlinedIcon style={{fontSize: 20}}/>
                        </IconButton>
                        <IconButton style={{outline: 'none'}} title="Sửa">
                          <CreateOutlinedIcon style={{fontSize: 20, color: 'rgb(13, 93, 241)'}}/>
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
                        <img src={item.img_url} alt="imgae_product" width='50'/>
                      </td>
                    ),
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default AllProducts