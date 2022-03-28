import React from 'react'
import './QualificationStages.css'
import { useTranslation } from 'react-i18next'

export default function PrimaryFilter() {
  const { t } = useTranslation()
  return (
    <div className="primary-filter">
      <h6>{t('primaryFilter.stage1')} </h6>
      <div className="primary-filter-form">
        <form>
          <h5 className="mb-4">{t('primaryFilter.filterBasedOn')}</h5>
          <div className="row mb-2 px-2">
            <div className="col p-0 my-2">
              <select className="form-control w-100">
                <option>{t('manageApplicants.age')}</option>
              </select>
            </div>
            <div className="col-sm-3 px-2 my-2">
              <input type="text" className="form-control w-100" value="<" />
            </div>
            <div className="col p-0 my-2">
              <input
                type="text"
                className="form-control w-100"
                value={29}
                placeholder="age"
              />
            </div>
          </div>
          <h5 className="my-2">{t('primaryFilter.second')}</h5>
          <div className="row px-2">
            <div className="col p-0 my-2">
              <select className="form-control w-100">
                <option>{t('manageApplicants.measurement')}</option>
              </select>
            </div>
            <div className="col-sm-3 px-2 my-2">
              <input type="text" className="form-control w-100" value=">" />
            </div>
            <div className="col p-0 my-2">
              <input
                type="text"
                className="form-control w-100"
                value={70}
                placeholder="Qiyas"
              />
            </div>
          </div>
          <h5 className="my-2">{t('primaryFilter.third')}</h5>
          <div className="row px-2">
            <div className="col p-0 my-2">
              <select className="form-control w-100">
                <option>{t('manageApplicants.cumulativeAverage')}</option>
              </select>
            </div>
            <div className="col-sm-3 px-2 my-2">
              <input type="text" className="form-control w-100" value=">" />
            </div>
            <div className="col p-0 my-2">
              <input
                type="text"
                className="form-control w-100"
                value={3}
                placeholder="GPA"
              />
            </div>
          </div>
        </form>
        <button type="button" className="btn btn-primary filter-btn">
          {t('primaryFilter.nominationApproval')}
        </button>
      </div>
      <div className="filter-footer">
        <small>{t('primaryFilter.infoMessage')}</small>
      </div>
    </div>
  )
}
