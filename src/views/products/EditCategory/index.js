import {
  CCard,
  CCardBody,
  CCol,
  CRow,
} from '@coreui/react'



const EditCategory = () => {
  return (
    <CForm className="form-horizontal" onSubmit={(e) => { onSubmit(e) }}>
      <CRow>
        <CCol xs="12" sm="6" md="7">
          <CCard>
            <CCardBody>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CForm>
  )
}

export default EditCategory