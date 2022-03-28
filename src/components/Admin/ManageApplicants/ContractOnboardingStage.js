import React from 'react'
import './ManageApplicants.css'
import { useTranslation } from 'react-i18next'

export default function ManageApplicants() {
  const { t } = useTranslation()
  return (
    <div>
      <div className='container'>
        <form>
          <div className='row'>
            <div className='col'>
              <select id='filter-1' className='form-control'>
                <option selected>{t('contractOnboardingStage.filter1')}</option>
                <option>{t('contractOnboardingStage.filter2')}</option>
                <option>{t('contractOnboardingStage.filter3')}</option>
                <option>{t('contractOnboardingStage.filter4')}</option>
              </select>
            </div>
            <div className='col'>
              <select id='filter-2' className='form-control'>
                <option>{t('contractOnboardingStage.filter1')}</option>
                <option selected>{t('contractOnboardingStage.filter2')}</option>
                <option>{t('contractOnboardingStage.filter3')}</option>
                <option>{t('contractOnboardingStage.filter4')}</option>
              </select>
            </div>
            <div className='col'>
              <select id='filter-3' className='form-control'>
                <option>{t('contractOnboardingStage.filter1')}</option>
                <option>{t('contractOnboardingStage.filter2')}</option>
                <option selected>{t('contractOnboardingStage.filter3')}</option>
                <option>{t('contractOnboardingStage.filter4')}</option>
              </select>
            </div>
            <div className='col'>
              <select id='filter-4' className='form-control'>
                <option>{t('contractOnboardingStage.filter1')}</option>
                <option>{t('contractOnboardingStage.filter2')}</option>
                <option>{t('contractOnboardingStage.filter3')}</option>
                <option selected>{t('contractOnboardingStage.filter4')}</option>
              </select>
            </div>
            <div className='col'>
              <div className='form-group has-search'>
                <span className='fa fa-search form-control-feedback'></span>
                <input
                  type='text'
                  className='form-control'
                  placeholder={t('manageApplicants.search')}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className='table-responsive'>
        <table className='table table-bordered applicants-table'>
          <thead>
            <tr>
              <th scope='col'>{t('dashboard.name')}</th>
              <th scope='col'>{t('applicationData.idNumber')}</th>
              <th scope='col'>{t('applicationData.mobileNumber')}</th>
              <th scope='col'>{t('applicationData.email')}</th>
              <th scope='col'>{t('manageApplicants.age')}</th>
              <th scope='col'>{t('manageApplicants.measurement')}</th>
              <th scope='col'>{t('manageApplicants.cumulativeAverage')}</th>
              <th scope='col'>{t('contractOnboardingStage.finalOrder')}</th>
              <th scope='col'>{t('contractOnboardingStage.contractStatus')}</th>
              <th scope='col'>{t('contractOnboardingStage.joiningDate')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope='row'>أمل محمد</th>
              <td>10103242221</td>
              <td>0512345123</td>
              <td>amal@domain.com</td>
              <td>27.45</td>
              <td>85</td>
              <td>4.8/5</td>
              <td>نعم</td>
              <td></td>
              <td>01/09/2021</td>
            </tr>
            <tr>
              <th scope='row'>مرام سعيد</th>
              <td>10203022112</td>
              <td>0543214321</td>
              <td>maram@domain.com</td>
              <td>25.88</td>
              <td>90</td>
              <td>4.7/5</td>
              <td>لا</td>
              <td></td>
              <td>لا</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='table-footer-wrapper'>
        <button type='button' className='btn btn-primary'>
          {t('manageApplicants.exportToExcel')}
        </button>
        <div className='table-pagination'>
          <span className='w-100'>Page 2/15</span>
          <select id='table-pagination-select' className='form-control'>
            <option selected>{t('manageApplicants.show1000Pages')}</option>
            <option>{t('contractOnboardingStage.show2000page')}</option>
          </select>
        </div>
      </div>
    </div>
  )
}
