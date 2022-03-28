import React from 'react'
import './ApplicantSchool.css'

import { useHistory } from 'react-router-dom'

import Notification from '../../Notification'
import SaudiRegions from './SaudiRegions'
import { useTranslation } from 'react-i18next'

export default function ApplicantSchool() {
  const { t } = useTranslation()
  let history = useHistory()

  const redirectTo = (link) => {
    history.push(`/${link}`)
  }

  return (
    <div>
      <div className='container applicant-school'>
        <Notification color='info' message={t('applicantSchool.infoMessage')} />
        <div className='applicant-school-details'>
          <div className='container'>
            <form className='w-100'>
              <div className='form-group row'>
                <label
                  htmlFor='basic-salary'
                  className='col-sm-2 col-form-label'
                >
                  {t('applicantRegion.firstChoice')}
                </label>
                <div className='col-sm-10'>
                  <SaudiRegions />
                </div>
              </div>
              <div className='form-group row'>
                <label
                  htmlFor='basic-salary'
                  className='col-sm-2 col-form-label'
                >
                  {t('applicantRegion.secondChoice')}
                </label>
                <div className='col-sm-10'>
                  <SaudiRegions />
                </div>
              </div>
              <div className='form-group row'>
                <label
                  htmlFor='basic-salary'
                  className='col-sm-2 col-form-label'
                >
                  {t('applicantRegion.thirdChoice')}
                </label>
                <div className='col-sm-10'>
                  <SaudiRegions />
                </div>
              </div>
              <div className='form-group row'>
                <label
                  htmlFor='basic-salary'
                  className='col-sm-2 col-form-label'
                >
                  {t('applicantRegion.fourthChoice')}
                </label>
                <div className='col-sm-10'>
                  <SaudiRegions />
                </div>
              </div>
              <div className='form-group row'>
                <label
                  htmlFor='basic-salary'
                  className='col-sm-2 col-form-label'
                >
                  {t('applicantRegion.fifthChoice')}
                </label>
                <div className='col-sm-10'>
                  <SaudiRegions />
                </div>
              </div>
              <div className='form-group row'>
                <label
                  htmlFor='basic-salary'
                  className='col-sm-2 col-form-label'
                >
                  {t('applicantRegion.sixthChoice')}
                </label>
                <div className='col-sm-10'>
                  <SaudiRegions />
                </div>
              </div>
              <div className='form-group row'>
                <label
                  htmlFor='basic-salary'
                  className='col-sm-2 col-form-label'
                >
                  {t('applicantRegion.seventhChoice')}
                </label>
                <div className='col-sm-10'>
                  <SaudiRegions />
                </div>
              </div>
              <div className='form-group row'>
                <label
                  htmlFor='basic-salary'
                  className='col-sm-2 col-form-label'
                >
                  {t('applicantRegion.eigthChoice')}
                </label>
                <div className='col-sm-10'>
                  <SaudiRegions />
                </div>
              </div>
              <div className='form-group row'>
                <label
                  htmlFor='basic-salary'
                  className='col-sm-2 col-form-label'
                >
                  {t('applicantRegion.ninthChoice')}
                </label>
                <div className='col-sm-10'>
                  <SaudiRegions />
                </div>
              </div>
              <div className='form-group row'>
                <label
                  htmlFor='basic-salary'
                  className='col-sm-2 col-form-label'
                >
                  {t('applicantRegion.tenthChoice')}
                </label>
                <div className='col-sm-10'>
                  <SaudiRegions />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className='applicant-school-footer'>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => redirectTo('main')}
          >
            {t('applicantRegion.send')}
          </button>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={() => redirectTo('main')}
          >
            {t('applicantDocs.back')}
          </button>
        </div>
      </div>
    </div>
  )
}
