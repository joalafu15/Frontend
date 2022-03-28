import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import './UnAuthorized.css'

export default function UnAuthorized() {
  const { t } = useTranslation()
  const { goBack } = useHistory()

  return (
    <div className="container middle">
      <div className="row my-5 d-flex">
        <div className="col-md-12">
          <div className="error-template">
            <h1 className="text-warning">403</h1>
            <h2>{t('common.unAuthorizedTitle')}</h2>
            <div className="error-details">
              {t('common.unAuthorizedMessage')}
            </div>
            <div className="error-actions">
              <button onClick={() => goBack()} className="btn btn-light btn-lg">
                <span className="glyphicon glyphicon-home"></span>
                {t('common.back')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
