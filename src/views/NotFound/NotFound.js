import React from 'react'

import './NotFound.css'

export default function NotFound() {
  return (
    <div className="container middle">
      <div className="row my-5 d-flex">
        <div className="col-md-12">
          <div className="error-template">
            <h1>Oops!</h1>
            <h2>404 Not Found</h2>
            <div className="error-details">
              Sorry, an error has occurred, Requested page not found!
            </div>
            <div className="error-actions">
              <a href="/" className="btn btn-primary btn-lg">
                <span className="glyphicon glyphicon-home"></span>
                Take Me Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
