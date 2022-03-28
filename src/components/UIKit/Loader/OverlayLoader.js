import React from 'react'
import { Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'

import './Loader.css'
const OverlayLoader = ({ show }) => (
  <Modal show={show} fullscreen="true" onHide={() => {}} centered>
    <Spinner className="loading" variant="primary" animation="grow" />
  </Modal>
)

OverlayLoader.propTypes = {
  show: PropTypes.bool,
}

OverlayLoader.defaultProps = {
  show: false,
}

export default OverlayLoader
