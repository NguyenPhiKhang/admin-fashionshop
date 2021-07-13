import React from 'react'

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { MoreVertOutlined } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

/**
* @author
* @function CardBrandComponent
**/

const CardBrandComponent = (props) => {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <div className='card-brand-custom' style={{ height: 220, marginBottom: 20 }}>
      <div style={{ height: 105, borderBottom: '1px solid rgba(222,226,230,.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
        <img style={{ height: 100, maxWidth: '100%' }} src={props.img_url} class="img-fluid" alt="Logo" />
      </div>
      <div style={{textAlign: 'center', paddingTop: 10 }}>
        <h4 style={{ fontWeight: 'bold' }}>{props.name}</h4>
        <h6>{props.amount}</h6>
        <IconButton className="remove-ouline-focus" onClick={handleClick}>
          <MoreVertOutlined style={{fontSize: 18}}/>
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Xem chi tiết</MenuItem>
          <MenuItem onClick={handleClose}>Sửa</MenuItem>
        </Menu>
      </div>
    </div>
  )
}

export default CardBrandComponent