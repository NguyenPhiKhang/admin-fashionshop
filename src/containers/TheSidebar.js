import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

// sidebar nav config
import navigation from './_nav'

const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        {/* <CIcon
          className="c-sidebar-brand-full"
          name="logo-negative"
          // src={"logo/FASHION2K.png"}
          height={35}
        /> */}

        <div className="c-sidebar-brand-full" style={{ display: "flex", alignItems: 'center' }}>
          <img src={'logo/logo.png'} className="c-sidebar-brand-full" style={{ height: 35, width: 54 }} alt="icon-logo"/>
          <img src={'logo/FASHION2K.png'} className="c-sidebar-brand-full" style={{ height: 45}} alt="text-logo"/>
        </div>

        <CIcon
          className="c-sidebar-brand-minimized"
          // name="sygnet"
          src={"logo/logo.png"}
          height={35}
        />
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
