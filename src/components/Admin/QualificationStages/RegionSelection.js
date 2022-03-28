import React from 'react'
import './QualificationStages.css'
import { useTranslation } from 'react-i18next'

export default function PrimaryFilter() {
  const { t } = useTranslation()
  return (
    <div className="primary-filter">
      <h6>{t('regionSelection.stage2')}</h6>
      <div className="primary-filter-form">
        <form>
          <h5 className="mb-4">{t('regionSelection.preferenceBasedOn')}</h5>
          <div className="row mb-2 px-2">
            <div className="col p-0 my-2">
              <select className="form-control w-100">
                <option selected>{t('manageApplicants.measurement')}</option>
                <option>{t('manageApplicants.age')}</option>
                <option>{t('manageApplicants.cumulativeAverage')}</option>
              </select>
            </div>
            <div className="col p-0 my-2">
              <select className="form-control w-100">
                <option>{t('regionSelection.higherIsBetter')}</option>
                <option>{t('regionSelection.lowerIsBetter')}</option>
              </select>
            </div>
          </div>
          <h5 className="my-2">{t('regionSelection.and')}</h5>
          <div className="row px-2">
            <div className="col p-0 my-2">
              <select className="form-control w-100">
                <option>{t('regionSelection.region')}</option>
                <option>{t('regionSelection.socialStatus')}</option>
                <option>{t('regionSelection.healthStatus')}</option>
              </select>
            </div>
            <div className="col p-0 my-2">
              <select className="form-control w-100">
                <option>{t('regionSelection.match')}</option>
                <option>{t('regionSelection.notMatch')}</option>
              </select>
            </div>
          </div>
          <h5 className="my-2">{t('regionSelection.and')}</h5>
          <div className="row px-2">
            <div className="col p-0 my-2">
              <select className="form-control w-100">
                <option>{t('manageApplicants.age')}</option>
              </select>
            </div>
            <div className="col p-0 my-2">
              <select className="form-control w-100">
                <option>{t('regionSelection.lowerIsBetter')}</option>
                <option>{t('regionSelection.topIsBetter')}</option>
              </select>
            </div>
          </div>
        </form>
        <button type="button" className="btn btn-primary filter-btn">
          {t('regionSelection.adoptionOfTradeOff')}
        </button>
      </div>
      <div className="filter-footer">
        <small>{t('regionSelection.qualifiedNotification')}</small>
      </div>
    </div>
  )
}
