// import React from 'react';

// import './Modal.css';

import CIcon from "@coreui/icons-react";
import { CButton } from "@coreui/react";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import "./Modal.css";

// const modal = props => (
//   <div className="modal">
//     <header className="modal__header">
//       <h1>{props.title}</h1>
//     </header>
//     <section className="modal__content">{props.children}</section>
//     <section className="modal__actions">
//       {props.canCancel && (
//         <button className="btn" onClick={props.onCancel}>
//           Cancel
//         </button>
//       )}
//       {props.canConfirm && (
//         <button className="btn" onClick={props.onConfirm}>
//           {props.confirmText}
//         </button>
//       )}
//     </section>
//   </div>
// );

// export default modal;

const Modal = props => {
  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, []);

  return ReactDOM.createPortal(
    <CSSTransition
      in={props.show}
      unmountOnExit
      timeout={{ enter: 0, exit: 300 }}
    >
      <div className="modal" onClick={props.onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h4 className="modal-title">{props.title}</h4>
            <CIcon name="cil-x" onClick={props.onClose}/>
          </div>
          <div className="modal-body">{props.children}</div>
          <div className="modal-footer">
          <CButton onClick={props.onClose} variant="outline" color="dark">Đóng</CButton>
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
};

export default Modal;