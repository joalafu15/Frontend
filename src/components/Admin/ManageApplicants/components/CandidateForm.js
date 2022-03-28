import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import * as dayjs from 'dayjs'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { confirmAlert } from 'react-confirm-alert'
import get from 'lodash/get'
import utf8 from 'utf8'
import 'react-confirm-alert/src/react-confirm-alert.css'
import {
  Container,
  Col,
  Form,
  Row,
  Button,
  ListGroup,
  Badge,
} from 'react-bootstrap'
import DatePicker from 'react-multi-date-picker'
import ArabCalendar from 'react-date-object/calendars/arabic'
import ArabLocaleAR from 'react-date-object/locales/arabic_ar'
import ArabLocaleEN from 'react-date-object/locales/arabic_en'
import { pickBy, identity } from 'lodash'
import Qs from 'querystring'
import { toast } from 'react-toastify'

import AsyncSearchableSelect from 'src/components/UIKit/AsyncSearchableSelect/AsyncSearchableSelect'

import {
  postCandidateFileMatchedAct,
  postContractValidatedAct,
} from 'src/redux/candidates/actions'

import { getJobPositionList } from 'src/services/jobPositionsSvc'
import { getUserList } from 'src/services/usersSvc'
import { downloadCandidateAttachment } from 'src/services/candidatesSvc'
import useAuth from 'src/hooks/useAuth'
import useSector from 'src/hooks/useSector'
import { actionAllowed } from 'src/utils/authUtils'

const INITIAL_VALUES = {
  id: undefined,
  fullName: undefined,
  birthdate: undefined,
  nationalIdNumber: undefined,
  studyType: undefined,
  qualificationClass: undefined,
  specialization: undefined,
  educationalInstitute: undefined,
  gpa: undefined,
  gpaMax: undefined,
  qiyasScore: undefined,
  qiyasSubjectScore: undefined,
  hasTakenQiyas: false,
  graduationDate: undefined,
  city: undefined,
  phoneNumber: undefined,
  email: undefined,
  jobTermsAccepted: undefined,
  jobOfferAccepted: undefined,
  acceptedTermsAt: undefined,
  acceptedOfferAt: undefined,
  submittedInformationAt: undefined,
  submittedAttachmentsAt: undefined,
  submittedSectorPreferencesAt: undefined,
  submittedPhaseOneAt: undefined,
  jobPositionId: undefined,
  userId: undefined,
  administrationId: undefined,
  group: undefined,
  contractUrl: undefined,
}

const schema = yup.object().shape({
  nationalIdNumber: yup.string().required(),
  fullName: yup.string().required(),
  phoneNumber: yup.string().required(),
  email: yup.string().required().email(),
  specialization: yup.string().required(),
})

const CandidateForm = ({ handleSubmit: handleOnSubmit, entity }) => {
  const { t } = useTranslation()
  const { goBack } = useHistory()
  const { candidateId } = useParams()
  const dispatch = useDispatch()
  const [jobPositionOptions, setJobPositionOptions] = useState([])
  const [selectedJobPosition, setSelectedJobPosition] = useState({})
  const [usersOptions, setUsersOptions] = useState([])
  const [selectedUser, setSelectedUser] = useState({})
  const { search } = useLocation()
  const { loading, userAcls } = useAuth()
  const objectQueries = Qs.parse(search.substring(1))
  const {
    options: optionSectors,
    search: searchSector,
    loading: loadingSector,
  } = useSector()

  const isArabic = i18next.language === 'ar'

  const handleFormSubmit = async (values) => {
    const {
      id,
      jobPosition,
      sectorPreferences,
      attachments,
      canAcceptOffer,
      canAcceptTerms,
      canEditInformation,
      canUploadDocument,
      hasTakenQiyas,
      qualifiedSector,
      ...otherFields
    } = values

    const normalizePayload = pickBy(otherFields, identity)

    const payload = {
      ...normalizePayload,
      hasTakenQiyas: JSON.parse(hasTakenQiyas),
      birthdate:
        typeof normalizePayload?.birthdate === 'string'
          ? normalizePayload?.birthdate
          : dayjs(normalizePayload?.birthdate).format('YYYY/MM/DD'),
      graduationDate:
        typeof normalizePayload?.graduationDate === 'string'
          ? normalizePayload?.graduationDate
          : dayjs(normalizePayload?.graduationDate).format('YYYY/MM/DD'),
      qualifiedSectorId: qualifiedSector?.value,
    }

    return handleOnSubmit(payload)
  }

  const {
    handleSubmit,
    handleChange,
    values,
    touched,
    errors,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      ...INITIAL_VALUES,
    },
    onSubmit: handleFormSubmit,
    validationSchema: schema,
  })

  const getJopPositionOptions = async (val) => {
    try {
      const { data: result } = await getJobPositionList({
        filters: { title: val },
      })
      return result?.map((it) => ({
        label: it.title,
        value: it.id,
      }))
    } catch (error) {
      return []
    }
  }

  const loadJobPositionOptions = useCallback(async () => {
    const options = await getJopPositionOptions()
    setJobPositionOptions(options)
  }, [])

  const getUserOptions = async (where) => {
    try {
      const { data: result } = await getUserList({
        where: { ...where },
      })
      return result?.map((it) => ({
        label: it.name,
        value: it.id,
      }))
    } catch (error) {
      return []
    }
  }

  const loadUserOptions = useCallback(
    async (val) => {
      const options = await getUserOptions(val)
      if (objectQueries?.userId || entity?.userId || candidateId) {
        if (candidateId) {
          setSelectedUser(
            options.filter((it) => it.value === entity?.userId)[0],
          )
        } else {
          setSelectedUser(
            options.filter((it) => it.value === objectQueries?.userId)[0],
          )
        }
      }
      setUsersOptions(options)
    },
    [candidateId, entity?.userId, objectQueries?.userId],
  )

  const downloadAttachment = (event, attachment) => {
    event.preventDefault()
    downloadCandidateAttachment(attachment)
  }

  const handleMatchedFiles = (filesMatched) => {
    confirmAlert({
      title: t('manageApplicants.submitFileMatchedConfirmationTitle'),
      message: t('manageApplicants.submitFileMatchedConfirmationMessage'),
      buttons: [
        {
          label: t('common.yes'),
          onClick: () => {
            const payload = {
              candidateId,
              payload: {
                filesMatched,
              },
            }
            return dispatch(postCandidateFileMatchedAct(payload))
              .then((res) => {
                if (res?.meta?.requestStatus === 'fulfilled') {
                  toast.success(t('manageApplicants.fileMatchedSuccessfully'))
                } else if (res?.meta?.requestStatus === 'rejected') {
                  toast.success(t('manageApplicants.fileMatchedFailed'))
                }
              })
              .catch((err) => {
                if (err?.meta?.requestStatus === 'rejected') {
                  toast.success(t('manageApplicants.fileMatchedFailed'))
                }
                toast.success(t('common.errorMessage'))
              })
          },
          className: 'btn btn-primary',
        },
        {
          label: t('common.no'),
          className: 'btn btn-secondary',
        },
      ],
    })
  }

  const handleContractValidated = (contractValidated) => {
    confirmAlert({
      title: t('manageApplicants.submitConfirmationTitle'),
      message: t('manageApplicants.submitConfirmationMessage'),
      buttons: [
        {
          label: t('common.yes'),
          onClick: () => {
            const payload = {
              candidateId,
              payload: {
                contractValidated,
              },
            }
            return dispatch(postContractValidatedAct(payload))
              .then((res) => {
                if (res?.meta?.requestStatus === 'fulfilled') {
                  toast.success(
                    t('manageApplicants.contractValidatedSuccessfully'),
                  )
                } else if (res?.meta?.requestStatus === 'rejected') {
                  toast.success(t('manageApplicants.contractValidatedFailed'))
                }
              })
              .catch((err) => {
                if (err?.meta?.requestStatus === 'rejected') {
                  toast.success(t('manageApplicants.contractValidatedFailed'))
                }
                toast.success(t('common.errorMessage'))
              })
          },
          className: 'btn btn-primary',
        },
        {
          label: t('common.no'),
          className: 'btn btn-secondary',
        },
      ],
    })
  }

  useEffect(() => {
    if (entity?.id) {
      const { sector, ...otherData } = entity
      setValues({
        ...otherData,
        qualifiedSector: {
          value: sector?.id,
          label: sector ? sector[isArabic ? 'name' : 'name_en'] : '',
        },
      })
      setSelectedJobPosition({
        value: entity?.jobPosition?.id,
        label: entity?.jobPosition?.title,
      })
    } else {
      // Load job position options for create
      loadJobPositionOptions()
    }

    // Load user options
    if (objectQueries?.userId) {
      // Load option: redirected once create new user
      loadUserOptions({ userId: objectQueries?.userId })
      setFieldValue('userId', objectQueries?.userId)
    } else {
      if (entity?.userId) {
        // Load option for edit and if userId available
        loadUserOptions({ userId: entity?.userId })
      } else {
        // Load option for create
        loadUserOptions()
      }
    }
  }, [entity, entity?.userId, objectQueries?.userId])

  if (candidateId && !values?.id) {
    return null
  }

  const writeAllowed =
    actionAllowed('applicants_create', userAcls) ||
    actionAllowed('applicants_update', userAcls)

  const allowWriteContractUrl =
    actionAllowed('read_contract_url', userAcls) &&
    (actionAllowed('create_contract_url', userAcls) ||
      actionAllowed('update_contract_url', userAcls))

  return (
    <div className="mb-5">
      <Row sm="12">
        <Col>
          <Container
            className="bg-white rounded-lg shadow py-4 px-4"
            sm="12"
            style={{ borderRadius: '12px' }}
          >
            <Form onSubmit={handleSubmit} sm="12">
              <Form.Row>
                {values?.id && (
                  <Form.Group as={Col} sm="6" className="mb-3">
                    <Form.Label column sm="12">
                      {t('manageApplicants.candidateId')}
                    </Form.Label>
                    <Col sm="12">
                      <Form.Control
                        name="id"
                        type="text"
                        id="candidate-id"
                        defaultValue={values?.id}
                        readOnly={!!values?.id || !writeAllowed}
                      />
                    </Col>
                  </Form.Group>
                )}
                <Form.Group as={Col} sm={values?.id ? 6 : 12} className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.group')}
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="text"
                      id="candidate-group"
                      name="group"
                      defaultValue={values?.group}
                      onChange={handleChange}
                      isInvalid={touched.group && !!errors.group}
                      readOnly={!writeAllowed}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.fullName}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.fullName')}
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="text"
                      id="candidate-fullName"
                      name="fullName"
                      defaultValue={values?.fullName}
                      onChange={handleChange}
                      isInvalid={touched.fullName && !!errors.fullName}
                      readOnly={!writeAllowed}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.fullName}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.user')}
                  </Form.Label>
                  <Col sm="12">
                    <AsyncSearchableSelect
                      handleLoadOptions={(value) =>
                        getUserOptions({ name: value })
                      }
                      defaultOptions={usersOptions}
                      isDisabled={!!objectQueries?.userId || !writeAllowed}
                      defaultValue={selectedUser}
                      value={selectedUser}
                      onChange={({ label, value }) => {
                        setSelectedUser({ label, value })
                        setFieldValue('userId', value)
                      }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.birthdate')}
                  </Form.Label>
                  <Col sm="12">
                    <DatePicker
                      id="candidate-birthdate"
                      name="birthdate"
                      value={values?.birthdate}
                      onChange={(val) =>
                        setFieldValue('birthdate', Number(val))
                      }
                      readOnly={
                        !!values.submittedInformationAt || !writeAllowed
                      }
                      disabled={
                        !!values.submittedInformationAt || !writeAllowed
                      }
                      calendar={ArabCalendar}
                      locale={
                        i18next.language === 'ar' ? ArabLocaleAR : ArabLocaleEN
                      }
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.nationalIdNumber')}
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="text"
                      name="nationalIdNumber"
                      id="candidate-nationalIdNumber"
                      defaultValue={values?.nationalIdNumber}
                      onChange={handleChange}
                      isInvalid={
                        touched.nationalIdNumber && !!errors.nationalIdNumber
                      }
                      readOnly={!writeAllowed}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.nationalIdNumber}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.qualifiedSector')}
                  </Form.Label>

                  <Col sm="12">
                    <AsyncSearchableSelect
                      handleLoadOptions={(value) =>
                        searchSector(
                          {
                            filter: {
                              limit: 10,
                              where: {
                                [isArabic ? 'name' : 'name_en']: {
                                  like: `%${utf8.encode(value)}%`,
                                },
                              },
                            },
                          },
                          true,
                        )
                      }
                      isLoading={loadingSector}
                      defaultOptions={optionSectors}
                      isDisabled={!writeAllowed}
                      defaultValue={values?.qualifiedSector}
                      value={values?.qualifiedSector}
                      onChange={(value) => {
                        setFieldValue('qualifiedSector', value)
                      }}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.studyType')}
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="text"
                      name="studyType"
                      id="candidate-studyType"
                      defaultValue={values?.studyType}
                      onChange={handleChange}
                      readOnly={!writeAllowed}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.qualificationClass')}
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="text"
                      name="qualificationClass"
                      id="contract-qualificationClass"
                      defaultValue={values?.qualificationClass}
                      onChange={handleChange}
                      readOnly={!writeAllowed}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.specialization')}
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="text"
                      name="specialization"
                      id="candidate-specialization"
                      defaultValue={values?.specialization}
                      onChange={handleChange}
                      isInvalid={
                        touched.specialization && !!errors.specialization
                      }
                      readOnly={!writeAllowed}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.specialization}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.educationalInstitute')}
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="text"
                      name="educationalInstitute"
                      id="candidate-educationalInstitute"
                      defaultValue={values?.educationalInstitute}
                      onChange={handleChange}
                      readOnly={!writeAllowed}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.gpa')}
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="number"
                      name="gpa"
                      id="candidate-gpa"
                      defaultValue={values?.gpa}
                      onChange={handleChange}
                      readOnly={!writeAllowed}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.gpaMax')}
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="number"
                      name="gpaMax"
                      id="candidate-gpaMax"
                      defaultValue={values?.gpaMax}
                      onChange={handleChange}
                      readOnly={!writeAllowed}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.qiyasScore')}
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="number"
                      id="candidate-qiyasScore"
                      name="qiyasScore"
                      defaultValue={values?.qiyasScore}
                      onChange={handleChange}
                      readOnly={!writeAllowed}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.qiyasSubjectScore')}
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="number"
                      name="qiyasSubjectScore"
                      id="candidate-qiyasSubjectScore"
                      defaultValue={values?.qiyasSubjectScore}
                      onChange={handleChange}
                      readOnly={!writeAllowed}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.hasTakenQiyas')}
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      as="select"
                      name="hasTakenQiyas"
                      id="candidate-hasTakenQiyas"
                      defaultValue={values?.hasTakenQiyas}
                      onChange={handleChange}
                      readOnly={!writeAllowed}
                    >
                      <option value={true}>{t('common.yes')}</option>
                      <option value={false}>{t('common.no')}</option>
                    </Form.Control>
                  </Col>
                </Form.Group>
                {/* TODO: Use hijri datepicker */}
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.graduationDate')}
                  </Form.Label>
                  <Col sm="12">
                    <DatePicker
                      name="graduationDate"
                      id="candidate-graduationDate"
                      value={values?.graduationDate}
                      onChange={(val) => {
                        setFieldValue('graduationDate', Number(val))
                      }}
                      calendar={ArabCalendar}
                      locale={
                        i18next.language === 'ar' ? ArabLocaleAR : ArabLocaleEN
                      }
                      readOnly={!writeAllowed}
                      disabled={!writeAllowed}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.city')}
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="text"
                      name="city"
                      id="candidate-city"
                      defaultValue={values?.city}
                      onChange={handleChange}
                      readOnly={!writeAllowed}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.phoneNumber')}
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      id="contract-phoneNumber"
                      defaultValue={values?.phoneNumber}
                      onChange={handleChange}
                      isInvalid={touched.phoneNumber && !!errors.phoneNumber}
                      readOnly={!writeAllowed}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.phoneNumber}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.email')}
                  </Form.Label>
                  <Col sm="12">
                    <Form.Control
                      type="text"
                      name="email"
                      id="candidate-email"
                      defaultValue={values?.email}
                      onChange={handleChange}
                      isInvalid={touched.email && !!errors.email}
                      readOnly={!writeAllowed}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.email}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
                {allowWriteContractUrl && (
                  <Form.Group as={Col} sm="6" className="mb-3">
                    <Form.Label column sm="12">
                      {t('manageApplicants.contractUrl')}
                    </Form.Label>
                    <Col sm="12">
                      <Form.Control
                        type="text"
                        name="contractUrl"
                        id="candidate-contractUrl"
                        defaultValue={values?.contractUrl}
                        onChange={handleChange}
                        isInvalid={touched.contractUrl && !!errors.contractUrl}
                        readOnly={!writeAllowed}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors?.contractUrl}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                )}

                {!!candidateId && (
                  <>
                    <Form.Group as={Col} sm="6" className="mb-3">
                      <Form.Label column sm="12">
                        {t('manageApplicants.jobTermsAccepted')}
                      </Form.Label>
                      <Col sm="12">
                        <Form.Control
                          as="select"
                          name="jobTermsAccepted"
                          id="candidate-jobTermsAccepted"
                          defaultValue={values?.jobTermsAccepted}
                          onChange={handleChange}
                          readOnly={!!values?.id || !writeAllowed}
                          disabled={!!values?.id}
                        >
                          <option value={true}>{t('common.yes')}</option>
                          <option value={false}>{t('common.no')}</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Col} sm="6" className="mb-3">
                      <Form.Label column sm="12">
                        {t('manageApplicants.jobOfferAccepted')}
                      </Form.Label>
                      <Col sm="12">
                        <Form.Control
                          as="select"
                          name="jobOfferAccepted"
                          id="candidate-jobOfferAccepted"
                          defaultValue={values?.jobOfferAccepted}
                          readOnly={!!values?.id || !writeAllowed}
                          disabled={!!values?.id}
                        >
                          <option value={true}>{t('common.yes')}</option>
                          <option value={false}>{t('common.no')}</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Col} sm="6" className="mb-3">
                      <Form.Label column sm="12">
                        {t('manageApplicants.acceptedTermsAt')}
                      </Form.Label>
                      <Col sm="12">
                        <Form.Control
                          type="text"
                          name="acceptedTermsAt"
                          id="candidate-acceptedTermsAt"
                          defaultValue={values?.acceptedTermsAt}
                          onChange={handleChange}
                          readOnly={!!values?.id || !writeAllowed}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Col} sm="6" className="mb-3">
                      <Form.Label column sm="12">
                        {t('manageApplicants.acceptedOfferAt')}
                      </Form.Label>
                      <Col sm="12">
                        <Form.Control
                          type="text"
                          name="acceptedOfferAt"
                          id="candidate-acceptedOfferAt"
                          defaultValue={values?.acceptedOfferAt}
                          onChange={handleChange}
                          readOnly={!!values?.id || !writeAllowed}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Col} sm="6" className="mb-3">
                      <Form.Label column sm="12">
                        {t('manageApplicants.submittedInformationAt')}
                      </Form.Label>
                      <Col sm="12">
                        <Form.Control
                          type="text"
                          name="submittedInformationAt"
                          id="candidate-submittedInformationAt"
                          defaultValue={values?.submittedInformationAt}
                          onChange={handleChange}
                          readOnly={!!values?.id || !writeAllowed}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Col} sm="6" className="mb-3">
                      <Form.Label column sm="12">
                        {t('manageApplicants.submittedAttachmentsAt')}
                      </Form.Label>
                      <Col sm="12">
                        <Form.Control
                          type="text"
                          name="submittedAttachmentsAt"
                          id="candidate-submittedAttachmentsAt"
                          defaultValue={values?.submittedAttachmentsAt}
                          onChange={handleChange}
                          readOnly={!!values?.id || !writeAllowed}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Col} sm="6" className="mb-3">
                      <Form.Label column sm="12">
                        {t('manageApplicants.submittedSectorPreferencesAt')}
                      </Form.Label>
                      <Col sm="12">
                        <Form.Control
                          type="text"
                          name="submittedSectorPreferencesAt"
                          id="candidate-submittedSectorPreferencesAt"
                          defaultValue={values?.submittedSectorPreferencesAt}
                          onChange={handleChange}
                          readOnly={!!values?.id || !writeAllowed}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Col} sm="6" className="mb-3">
                      <Form.Label column sm="12">
                        {t('manageApplicants.submittedPhaseOneAt')}
                      </Form.Label>
                      <Col sm="12">
                        <Form.Control
                          type="text"
                          name="submittedPhaseOneAt"
                          id="candidate-submittedPhaseOneAt"
                          defaultValue={values?.submittedPhaseOneAt}
                          onChange={handleChange}
                          readOnly
                          disabled
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Col} sm="6" className="mb-3">
                      <Form.Label column sm="12">
                        {t('manageApplicants.createdAt')}
                      </Form.Label>
                      <Col sm="12">
                        <Form.Control
                          type="text"
                          name="createdAt"
                          id="candidate-createdAt"
                          defaultValue={values?.createdAt}
                          onChange={handleChange}
                          readOnly
                          disabled
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Col} sm="6" className="mb-3">
                      <Form.Label column sm="12">
                        {t('manageApplicants.updatedAt')}
                      </Form.Label>
                      <Col sm="12">
                        <Form.Control
                          type="text"
                          name="updatedAt"
                          id="candidate-updatedAt"
                          defaultValue={values?.updatedAt}
                          onChange={handleChange}
                          readOnly
                          disabled
                        />
                      </Col>
                    </Form.Group>
                  </>
                )}
                <Form.Group as={Col} sm="6" className="mb-3">
                  <Form.Label column sm="12">
                    {t('manageApplicants.jobPositionId')}
                  </Form.Label>
                  <Col sm="12">
                    <AsyncSearchableSelect
                      handleLoadOptions={getJopPositionOptions}
                      defaultOptions={jobPositionOptions}
                      defaultValue={selectedJobPosition}
                      value={selectedJobPosition}
                      isDisabled={!writeAllowed}
                      onChange={({ label, value }) => {
                        setSelectedJobPosition({ label, value })
                        setFieldValue('jobPositionId', value)
                      }}
                    />
                  </Col>
                </Form.Group>
              </Form.Row>

              <Row sm="12" className="d-flex justify-content-start my-5">
                {/* TODO: show list of attachment */}
                {!!candidateId && (
                  <Form.Group as={Col} sm="6" className="mb-3">
                    <Form.Label column sm="12">
                      {t('manageApplicants.attachments')}
                    </Form.Label>
                    <Col sm="12">
                      {values?.attachments ? (
                        values?.attachments?.map((it) => (
                          <ListGroup.Item
                            key={it.id}
                            action
                            onClick={(e) => downloadAttachment(e, it)}
                          >
                            {t('manageApplicants.fileType')}
                            &nbsp;
                            <Badge pill variant="light">
                              {it?.type}
                            </Badge>
                            <br />
                            {t('manageApplicants.fileName')}
                            &nbsp;
                            <Badge pill variant="warning">
                              {it?.filename}
                            </Badge>
                          </ListGroup.Item>
                        ))
                      ) : (
                        <ListGroup.Item>
                          {t('manageApplicants.noHaveAttachmentFile')}
                        </ListGroup.Item>
                      )}
                    </Col>
                    {get(values, 'attachments', []).length > 0 && (
                      <Row
                        sm="12"
                        className="d-flex justify-content-end my-4 px-3"
                      >
                        <Col
                          sm={8}
                          className="d-flex justify-content-end align-items-center"
                        >
                          <div className="d-flex justify-content-end align-items-center">
                            {t('manageApplicants.attachmentsMatchQuestion')}
                          </div>
                        </Col>
                        <Col
                          sm={3}
                          className="d-flex justify-content-end align-items-center"
                        >
                          {values?.filesMatched === null &&
                            !values?.filesMatchedAt && (
                              <>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="mx-1 d-flex justify-content-end align-items-center"
                                  onClick={() => handleMatchedFiles(true)}
                                >
                                  {t('common.yes')}
                                </Button>
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="mx-1 d-flex justify-content-end align-items-center"
                                  onClick={() => handleMatchedFiles(false)}
                                >
                                  {t('common.no')}
                                </Button>
                              </>
                            )}
                          {values?.filesMatched === true && t('common.yes')}
                          {values?.filesMatched === false && t('common.no')}
                        </Col>
                      </Row>
                    )}
                    {get(values, 'attachments', []).filter(
                      (a) => a.type === 'contract',
                    ).length > 0 && (
                      <Row
                        sm="12"
                        className="d-flex justify-content-end my-4 px-3"
                      >
                        <Col
                          sm={8}
                          className="d-flex justify-content-end align-items-center"
                        >
                          <div className="d-flex justify-content-end align-items-center">
                            {t('manageApplicants.validateContractQuestion')}
                          </div>
                        </Col>
                        <Col
                          sm={3}
                          className="d-flex justify-content-end align-items-center"
                        >
                          <Button
                            variant={
                              values?.contractValidated === true
                                ? 'success'
                                : 'light'
                            }
                            size="sm"
                            className={`mx-1 d-flex justify-content-end align-items-center ${
                              values?.contractValidated === true &&
                              'font-weight-bold'
                            }`}
                            onClick={() => handleContractValidated(true)}
                          >
                            {t('common.yes')}
                          </Button>
                          <Button
                            variant={
                              values?.contractValidated === false
                                ? 'danger'
                                : 'light'
                            }
                            size="sm"
                            className={`mx-1 d-flex justify-content-end align-items-center ${
                              values?.contractValidated === false &&
                              'font-weight-bold'
                            }`}
                            onClick={() => handleContractValidated(false)}
                          >
                            {t('common.no')}
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </Form.Group>
                )}

                {/* TODO: show list of sector preferences */}
                {!!candidateId && (
                  <Form.Group as={Col} sm="6" className="mb-3">
                    <Form.Label column sm="12">
                      {t('manageApplicants.sectorPreferences')}
                    </Form.Label>

                    <Col sm="12">
                      {values?.sectorPreferences ? (
                        values?.sectorPreferences?.map((it) => (
                          <ListGroup.Item
                            key={it.id}
                            style={{ display: 'flex' }}
                          >
                            <div style={{ marginRight: '5px' }}>
                              {it?.choice}.
                            </div>
                            <div>{it?.sector?.name}</div>
                          </ListGroup.Item>
                        ))
                      ) : (
                        <ListGroup.Item>
                          {t('manageApplicants.noSelectedPreferences')}
                        </ListGroup.Item>
                      )}
                    </Col>
                  </Form.Group>
                )}
              </Row>
              {writeAllowed && (
                <Row sm="12" className="d-flex justify-content-center my-5">
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    className="mx-2"
                  >
                    {t('common.save')}
                  </Button>
                  <Button
                    variant="light"
                    size="lg"
                    className="mx-2"
                    onClick={() => goBack()}
                  >
                    {t('common.back')}
                  </Button>
                </Row>
              )}
            </Form>
          </Container>
        </Col>
      </Row>
    </div>
  )
}

CandidateForm.propTypes = {
  handleSubmit: PropTypes.func,
  entity: PropTypes.any,
}

export default CandidateForm
