import React from 'react'
import { Spinner } from 'react-bootstrap'

import './Loader.css'

const Loader = () => (
  <Spinner className="local-loading" variant="primary" animation="grow" />
)

export default Loader
