import i18next from 'i18next'
import React, { useEffect, useState, useContext } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import ArabCalendar from 'react-date-object/calendars/arabic'
import ArabLocaleAR from 'react-date-object/locales/arabic_ar'
import ArabLocaleEN from 'react-date-object/locales/arabic_en'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-multi-date-picker'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import {
  patchCandidateAct,
  postCandidateSubmitInformationAct,
} from 'src/redux/candidates/actions'

import useCandidateInfo from 'src/hooks/useCandidateInfo'
import Notification from 'src/components/Notification'
import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'
import { SettingsContext } from 'src/contexts/settings'

import { INITIAL_VALUES } from './constants'

import './ApplicantData.css'

// validation schema
const validationSchema = Yup.object().shape({
  id: Yup.string().required(),
  birthdate: Yup.string().required(),
  city: Yup.string().required(),
  hasTakenQiyas: Yup.boolean().required(),
  phoneNumber: Yup.string().required(),
  email: Yup.string().required(),
  graduationDate: Yup.string().required(),
  qiyasScore: Yup.number().test(
    'qiyasScore',
    'Qiyas score is required',
    (value, context) => {
      if (context?.parent?.hasTakenQiyas && !value) {
        return false
      }
      return true
    },
  ),
  qiyasSubjectScore: Yup.number().test(
    'qiyasSubjectScore',
    'Qiyas subject score is required',
    (value, context) => {
      if (context?.parent?.hasTakenQiyas && !value) {
        return false
      }
      return true
    },
  ),
})

export default function ApplicantData() {
  const [hasTakenQiyas, setHasTakenQiyas] = useState(false)
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const { loading, data } = useCandidateInfo()

  const settings = useContext(SettingsContext);

  const redirectTo = (link) => {
    history.push(`/${link}`)
  }

  const { values, setFieldValue, setValues, errors, touched, handleSubmit } =
    useFormik({
      initialValues: INITIAL_VALUES,
      onSubmit: (values) => submitConfirmation(values),
      validationSchema,
    })

  const submitConfirmation = () => {
    // reusable method
    const confirmation = () => {
      confirmAlert({
        title: t('applicationData.submitConfirmationTitle'),
        message: t('applicationData.submitConfirmationMessage'),
        buttons: [
          {
            label: t('common.yes'),
            onClick: handleUpdateData,
            className: 'btn btn-primary',
          },
          {
            label: t('common.no'),
            className: 'btn btn-secondary',
          },
        ],
      })
    }

    // Show an additional pre-confirmation if the candidate hasn't taken qiyas
    if (values?.hasTakenQiyas === false) {
      confirmAlert({
        title: t('applicationData.proceedWithoutQiyasTitle'),
        message: t('applicationData.proceedWithoutQiyasMessage'),
        buttons: [
          {
            label: t('common.yes'),
            onClick: () => setTimeout(confirmation, 100),
            className: 'btn btn-primary',
          },
          {
            label: t('common.no'),
            className: 'btn btn-secondary',
          },
        ],
      })
    } else confirmation()
  }

  const getAllowedDateFormat = (date) => {
    const isArabic = i18next.language === 'ar'
    if (isArabic) {
      return date.convert(ArabCalendar, ArabLocaleEN).format('YYYY/MM/DD')
    }
    return date?.format('YYYY/MM/DD')
  }

  const handleUpdateData = async () => {
    // Candidates that already sent, can't send it again
    if (!!values?.submittedInformationAt) return

    try {
      // Build payload with allowed values only
      const payload = {
        id: values.id,
        city: values.city,
        hasTakenQiyas: values.hasTakenQiyas,
        phoneNumber: values.phoneNumber,
        email: values.email,
        birthdate:
          typeof values.birthdate === 'string'
            ? values.birthdate
            : getAllowedDateFormat(values.birthdate),
        graduationDate:
          typeof values.graduationDate === 'string'
            ? values.graduationDate
            : getAllowedDateFormat(values.graduationDate),
        ...(values.hasTakenQiyas && {
          qiyasScore: values.qiyasScore,
          qiyasSubjectScore: values.qiyasSubjectScore,
        }),
      }

      const data = await dispatch(patchCandidateAct(payload))
      if (data?.error) {
        return toast.error(t('applicantData.somethingWrong'))
      }

      const submitInfo = await dispatch(
        postCandidateSubmitInformationAct(payload.id),
      )
      if (submitInfo?.error) {
        return toast.error(t('applicantData.somethingWrong'))
      }
      redirectTo('main')
      return toast.success(t('applicantData.successMsg'))
    } catch (error) {
      console.warn(error)
      return toast.error(t('applicantData.somethingWrong'))
    }
  }

  useEffect(() => {
    if (!loading && !!data) {
      setHasTakenQiyas(data.hasTakenQiyas)
      setValues({ ...data })
    }
  }, [data, data?.hasTakenQiyas])

  return (
    <div>
      <div className="container applicant-data">
        {!values.submittedInformationAt && (
          <Notification
            color="info"
            message={t('applicationData.infoMessage')}
          />
        )}
        <div className="applicant-data-details">
          <div className="container">
            <form className="w-100">
              <div className="form-group row">
                <label htmlFor="full-name" className="col-sm-2 col-form-label">
                  {t('applicationData.fullName')}
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="full-name"
                    value={values?.fullName}
                    name="fullName"
                    disabled
                    readOnly
                  />
                  {touched?.fullName && errors?.fullName && (
                    <div
                      className="invalid-feedback"
                      style={{ display: 'block' }}
                    >
                      {errors?.fullName}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label">
                  {t('applicationData.idNumber')}
                </label>
                <div className="col-sm-10">
                  <input
                    type="number"
                    className="form-control"
                    value={values?.nationalIdNumber || 0}
                    name="nationalIdNumber"
                    disabled
                    readOnly
                  />
                  {touched?.nationalIdNumber && errors?.nationalIdNumber && (
                    <div
                      className="invalid-feedback"
                      style={{ display: 'block' }}
                    >
                      {errors?.nationalIdNumber}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="birthdate" className="col-sm-2 col-form-label">
                  {t('applicationData.birthdate')}
                </label>
                <div className="col-sm-10">
                  <DatePicker
                    id="birthdate"
                    name="birthdate"
                    value={values?.birthdate}
                    onChange={(val) => {
                      setFieldValue('birthdate', val)
                    }}
                    editable={false}
                    readOnly={settings.isActive('lockPhase1') || !!values.submittedInformationAt}
                    calendar={ArabCalendar}
                    locale={
                      i18next.language == 'ar' ? ArabLocaleAR : ArabLocaleEN
                    }
                    required
                  />
                  {touched?.birthdate && errors?.birthdate && (
                    <div
                      className="invalid-feedback"
                      style={{ display: 'block' }}
                    >
                      {errors?.birthdate}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="mobile-number"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicationData.mobileNumber')}
                </label>
                <div className="col-sm-10">
                  <input
                    type="tel"
                    className="form-control"
                    id="mobile-number"
                    placeholder="0543214321"
                    value={values?.phoneNumber}
                    name="phoneNumber"
                    onChange={(event) => {
                      const val = event?.target?.value
                      setFieldValue('phoneNumber', val)
                    }}
                    readOnly={settings.isActive('lockPhase1') || !!values.submittedInformationAt}
                    required
                  />
                  {touched?.phoneNumber && errors?.phoneNumber && (
                    <div
                      className="invalid-feedback"
                      style={{ display: 'block' }}
                    >
                      {errors?.phoneNumber}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="email-address"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicationData.email')}
                </label>
                <div className="col-sm-10">
                  <input
                    type="email"
                    className="form-control"
                    id="email-address"
                    placeholder="example@mail.com"
                    value={values?.email}
                    name="email"
                    onChange={(event) => {
                      const val = event?.target?.value
                      setFieldValue('email', val)
                    }}
                    readOnly={settings.isActive('lockPhase1') || !!values.submittedInformationAt}
                    required
                  />
                  {touched?.email && errors?.email && (
                    <div
                      className="invalid-feedback"
                      style={{ display: 'block' }}
                    >
                      {errors?.email}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="city" className="col-sm-2 col-form-label">
                  {t('applicationData.city')}
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    value={values?.city}
                    name="city"
                    onChange={(event) => {
                      const val = event?.target?.value
                      setFieldValue('city', val)
                    }}
                    readOnly={settings.isActive('lockPhase1') || !!values.submittedInformationAt}
                    required
                  />
                  {touched?.city && errors?.city && (
                    <div
                      className="invalid-feedback"
                      style={{ display: 'block' }}
                    >
                      {errors?.city}
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="form-group row">
                <label htmlFor="study-type" className="col-sm-2 col-form-label">
                  {t('applicationData.studyType')}
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="study-type"
                    value={values?.studyType}
                    name="studyType"
                    disabled
                    readOnly
                  />
                </div>
              </div> */}
              <div className="form-group row">
                <label
                  htmlFor="qualificationClass"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicationData.qualificationClass')}
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="qualificationClass"
                    value={values?.qualificationClass}
                    name="qualificationClass"
                    disabled
                    readOnly
                  />
                  {touched?.qualificationClass && errors?.qualificationClass && (
                    <div
                      className="invalid-feedback"
                      style={{ display: 'block' }}
                    >
                      {errors?.qualificationClass}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="specialization"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicationData.specialization')}
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="specialization"
                    value={values?.specialization}
                    name="specialization"
                    disabled
                    readOnly
                  />
                  {touched?.specialization && errors?.specialization && (
                    <div
                      className="invalid-feedback"
                      style={{ display: 'block' }}
                    >
                      {errors?.specialization}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="educationalInstitute"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicationData.educationalInstitute')}
                </label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    id="educationalInstitute"
                    value={values?.educationalInstitute}
                    name="educationalInstitute"
                    onChange={(event) => {
                      const val = event?.target?.value
                      setFieldValue('educationalInstitute', val)
                    }}
                    disabled
                    readOnly
                  />
                  {touched?.educationalInstitute &&
                    errors?.educationalInstitute && (
                      <div
                        className="invalid-feedback"
                        style={{ display: 'block' }}
                      >
                        {errors?.educationalInstitute}
                      </div>
                    )}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="gpa" className="col-sm-2 col-form-label">
                  {t('applicationData.gpa')}
                </label>
                <div className="col-sm-10">
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    className="form-control"
                    id="gpa"
                    value={values?.gpa || 0}
                    name="gpa"
                    disabled
                    readOnly
                  />
                  {touched?.gpa && errors?.gpa && (
                    <div
                      className="invalid-feedback"
                      style={{ display: 'block' }}
                    >
                      {errors?.gpa}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="gpaMax" className="col-sm-2 col-form-label">
                  {t('applicationData.gpaMax')}
                </label>
                <div className="col-sm-10">
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    className="form-control"
                    id="gpaMax"
                    value={values?.gpaMax || 0}
                    name="gpaMax"
                    disabled
                    readOnly
                  />
                  {touched?.gpaMax && errors?.gpaMax && (
                    <div
                      className="invalid-feedback"
                      style={{ display: 'block' }}
                    >
                      {errors?.gpaMax}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="hasTakenQiyas"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicationData.hasTakenQiyas')}
                </label>
                <div className="col-sm-10">
                  <select
                    id="hasTakenQiyas"
                    className="form-control"
                    value={values?.hasTakenQiyas}
                    name="hasTakenQiyas"
                    onChange={(event) => {
                      const val = JSON.parse(event?.target?.value)
                      setFieldValue('hasTakenQiyas', val)
                    }}
                    readOnly={settings.isActive('lockPhase1') || !!values.submittedInformationAt}
                    disabled={settings.isActive('lockPhase1') || !!values.submittedInformationAt || hasTakenQiyas}
                    required
                  >
                    <option selected disabled>
                      {t('common.pleaseChoose')}
                    </option>
                    <option value="true">{t('common.yes')}</option>
                    <option value="false">{t('common.no')}</option>
                  </select>
                  {touched?.hasTakenQiyas && errors?.hasTakenQiyas && (
                    <div
                      className="invalid-feedback"
                      style={{ display: 'block' }}
                    >
                      {errors?.hasTakenQiyas}
                    </div>
                  )}
                </div>
              </div>
              {values.hasTakenQiyas && (
                <>
                  <div className="form-group row">
                    <label
                      htmlFor="qiyasScore"
                      className="col-sm-2 col-form-label"
                    >
                      {t('applicationData.qiyasScore')}
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        className="form-control"
                        id="qiyasScore"
                        value={values?.qiyasScore || 0}
                        name="qiyasScore"
                        onChange={(event) => {
                          const val = event?.target?.value
                          setFieldValue('qiyasScore', parseFloat(val) || 0)
                        }}
                        readOnly={
                          settings.isActive('lockPhase1') ||
                          !!values.submittedInformationAt || hasTakenQiyas
                        }
                        required
                      />
                      {touched?.qiyasScore && errors?.qiyasScore && (
                        <div
                          className="invalid-feedback"
                          style={{ display: 'block' }}
                        >
                          {errors?.qiyasScore}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <label
                      htmlFor="qiyasSubjectScore"
                      className="col-sm-2 col-form-label"
                    >
                      {t('applicationData.qiyasSubjectScore')}
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        className="form-control"
                        id="qiyasSubjectScore"
                        value={values?.qiyasSubjectScore || 0}
                        name="qiyasSubjectScore"
                        onChange={(event) => {
                          const val = event?.target?.value
                          setFieldValue(
                            'qiyasSubjectScore',
                            parseFloat(val) || 0,
                          )
                        }}
                        readOnly={
                          settings.isActive('lockPhase1') ||
                          !!values.submittedInformationAt || hasTakenQiyas
                        }
                        required
                      />
                      {touched?.qiyasSubjectScore && errors?.qiyasSubjectScore && (
                        <div
                          className="invalid-feedback"
                          style={{ display: 'block' }}
                        >
                          {errors?.qiyasSubjectScore}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              <div className="form-group row">
                <label
                  htmlFor="graduationDate"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicationData.graduationDate')}
                </label>
                <div className="col-sm-10">
                  <DatePicker
                    id="graduationDate"
                    value={values?.graduationDate}
                    onChange={(val) => {
                      setFieldValue('graduationDate', val)
                    }}
                    calendar={ArabCalendar}
                    locale={
                      i18next.language == 'ar' ? ArabLocaleAR : ArabLocaleEN
                    }
                    editable={false}
                    required
                    disabled={settings.isActive('lockPhase1') || !!values.submittedInformationAt}
                  />
                  {touched?.graduationDate && errors?.graduationDate && (
                    <div
                      className="invalid-feedback"
                      style={{ display: 'block' }}
                    >
                      {errors?.graduationDate}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="applicant-data-footer">
          {!settings.isActive('lockPhase1') && !values?.submittedInformationAt && (
            <button
              type="button"
              className="btn btn-primary"
              disabled={Object.keys(errors).length > 0}
              onClick={handleSubmit}
            >
              {t('common.save')}
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => redirectTo('main')}
          >
            {t('common.back')}
          </button>
        </div>
      </div>
      <OverlayLoader show={loading} />
    </div>
  )
}
