import React from 'react'
import { connect } from 'react-redux'
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

import PropTypes from 'prop-types';

import CIcon from '@coreui/icons-react'

import { setStateNav } from '../redux/actions/NavAction';

// sidebar nav config
import navigation from './_nav'
import { SET_STATE_NAV } from 'src/redux/const/NavConst'

const TheSidebar = (props) => {
  const show = props.stateNav;

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => props.setStateNav({ type: SET_STATE_NAV, sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">

        <div className="c-sidebar-brand-full" style={{ display: "flex", alignItems: 'center' }}>
          <img src={'logo/logo.png'} className="c-sidebar-brand-full" style={{ height: 35, width: 54 }} alt="icon-logo" />
          <img src={'logo/FASHION2K.png'} className="c-sidebar-brand-full" style={{ height: 45 }} alt="text-logo" />
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

const mapStateToProps = state => ({
  setStateNav: PropTypes.func.isRequired,
  stateNav: state.nav.sidebarShow
});

const mapDispatchToProps = dispatch => {
  return { setStateNav: (data) => dispatch(setStateNav(data)) }
}

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(TheSidebar))
