import { CButton } from '@coreui/react'
import React from 'react'

/**
* @author
* @function CardUserComponent
**/

const CardUserComponent = (props) => {
  return (
    <div className="card-user-component">
      <div className="card-header-user">
        <img
          className="image-user-component"
          src={props.image_url} alt="User pic" />
      </div>
      <div className="card-body-user">
        <h5 className="card-name-user">{props.name}</h5>
        <div className="card-text-user">
          <p style={{ margin: 0 }}>ID: {props.id_user}</p>
          <p>{props.email}</p>
          <div style={{display: 'flex'}}>
            <CButton block color="light" style={{margin: 3}}>Chi tiết</CButton>
            <CButton block color="danger" style={{margin: 3}}>Khoá</CButton>
          </div>
          {/* <CButton block variant="outline" color="info">Xem chi tiết</CButton> */}
        </div>
      </div>
    </div>
  )

}

export default CardUserComponent