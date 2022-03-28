import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap'
import filter from 'lodash/filter'
import get from 'lodash/get'
import { confirmAlert } from 'react-confirm-alert'
import { DateObject } from 'react-multi-date-picker'
import 'react-confirm-alert/src/react-confirm-alert.css'

import AsyncSearchableSelect from 'src/components/UIKit/AsyncSearchableSelect/AsyncSearchableSelect'
import Notification from 'src/components/Notification'
import useAuth from 'src/hooks/useAuth'
import useCandidateInfo from 'src/hooks/useCandidateInfo'
import { useSettings } from 'src/contexts/settings'

import { postCandidateInterviewSlotAct } from 'src/redux/candidates/actions'
import { getCandidateTimeSlots } from 'src/services/candidatesSvc'
import './ApplicantInterview.css'

const schema = yup.object().shape({
  chosenInterviewTimeSlotId: yup.string().required(),
  googleMapsLink: yup.string().required(),
  locationName: yup.string().required(),
})

export default function ApplicantInterview() {
  const { t } = useTranslation()
  const { push, goBack, replace } = useHistory()
  const dispatch = useDispatch()
  const [timeSlotOptions, setTimeSlotOptions] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(undefined)
  const settings = useSettings()

  const {
    userProfile: { candidateId },
  } = useAuth()
  const { data, loading, refetch } = useCandidateInfo()

  const handleFormSubmit = async (values) => {
    const payload = {
      chosenInterviewTimeSlotId: values?.chosenInterviewTimeSlotId,
    }

    try {
      const resp = await dispatch(
        postCandidateInterviewSlotAct({ candidateId, payload }),
      )

      if (resp?.meta?.requestStatus === 'fulfilled') {
        toast.success(t('applicantInterview.successMessage'))
      } else {
        toast.error(t('common.errorMessage'))
      }
    } catch (error) {
      toast.error(t('common.errorMessage'))
    } finally {
      refetch()
      push('/main')
    }
  }

  const handleConfirm = (values) => {
    return confirmAlert({
      title: t('applicantInterview.submitConfirmationTitle'),
      message: t('applicantInterview.submitConfirmationMessage'),
      buttons: [
        {
          label: t('common.yes'),
          onClick: () => handleFormSubmit(values),
          className: 'btn btn-primary',
        },
        {
          label: t('common.no'),
          className: 'btn btn-secondary',
        },
      ],
    })
  }

  const { handleSubmit, values, touched, errors, setValues } = useFormik({
    initialValues: { chosenInterviewTimeSlotId: undefined },
    validationSchema: schema,
    onSubmit: handleConfirm,
  })

  const handleLoadTimeSlotOptions = async (candidateId) => {
    try {
      const { data: result } = await getCandidateTimeSlots(candidateId)
      return result?.map((it) => {
        const startDateTime = new DateObject(it?.startDateTime)
        const endDateTime = new DateObject(it?.endDateTime)

        return {
          label: t('applicantInterview.interviewSlotLabel', {
            startDate: startDateTime.format('YYYY/MM/DD'),
            startTime: startDateTime.format('HH:mm:ss'),
            endDate: endDateTime.format('YYYY/MM/DD'),
            endTime: endDateTime.format('HH:mm:ss'),
            interpolation: { escapeValue: false },
          }),
          value: it.id,
          googleMapsLink: it?.googleMapsLink,
          locationName: it?.locationName,
        }
      })
    } catch (error) {
      return []
    }
  }

  const loadCandidateTimeSlots = useCallback(async () => {
    const options = await handleLoadTimeSlotOptions(candidateId)
    if (data?.qualifiedSectorId == null) {
      replace('/main')
    }
    setTimeSlotOptions(options)
    if (data?.chosenInterviewTimeSlotId) {
      const selectedOption = get(
        filter(options, {
          value: data?.chosenInterviewTimeSlotId,
        }),
        '0',
        {},
      )
      setSelectedTimeSlot(selectedOption)
      setValues({
        chosenInterviewTimeSlotId: selectedOption?.value,
        googleMapsLink: selectedOption?.googleMapsLink,
        locationName: selectedOption?.locationName,
      })
    }
  }, [candidateId, data?.chosenInterviewTimeSlotId])

  useEffect(() => {
    if (candidateId) {
      loadCandidateTimeSlots()
    }
    return () => {}
  }, [candidateId, data?.chosenInterviewTimeSlotId])

  if (loading) {
    return null
  }

  const isLockPhase2Active = settings?.isActive('lockPhase2')

  return (
    <div>
      <div className="container applicant-interview">
        {timeSlotOptions !== null && timeSlotOptions.length === 0
        ? (
          <Notification
            color="error"
            message={t('applicantInterview.noAvailableSlots')}
          />
        ) : (
          <Notification
            color="info"
            message={
              data?.qualifiedSectorId && data?.submittedInterViewTimeSlotAt
                ? t('applicantInterview.submittedInterviewTimeSlotMessage', {
                    interviewDate: selectedTimeSlot?.label,
                    googleMapsLink: selectedTimeSlot?.googleMapsLink,
                    locationName: selectedTimeSlot?.locationName,
                    interpolation: { escapeValue: false },
                  })
                : t('applicantInterview.infoMessage')
            }
          />
        )}

        <div className="applicant-interview-details">
          <Container>
            <Row>
              <Form className="w-100">
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">
                    {t('applicantInterview.interviewDateAndTime')}
                  </Form.Label>
                  <Col sm="10">
                    <AsyncSearchableSelect
                      isDisabled={
                        data?.submittedInterViewTimeSlotAt || isLockPhase2Active
                      }
                      defaultValue={selectedTimeSlot}
                      name="chosenInterviewTimeSlotId"
                      defaultOptions={timeSlotOptions}
                      handleLoadOptions={handleLoadTimeSlotOptions}
                      placeholder={t('common.pleaseChoose')}
                      onChange={({
                        value,
                        label,
                        googleMapsLink,
                        locationName,
                      }) => {
                        setSelectedTimeSlot({ value, label })
                        setValues({
                          chosenInterviewTimeSlotId: value,
                          googleMapsLink: googleMapsLink,
                          locationName: locationName,
                        })
                      }}
                    />

                    {touched?.roles && errors?.roles && (
                      <div
                        className="invalid-feedback"
                        style={{ display: 'block' }}
                      >
                        {errors?.roles}
                      </div>
                    )}
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">
                    {t('applicantInterview.interviewSite')}
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="text"
                      id="interview-location"
                      defaultValue={values?.locationName}
                      readOnly
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">
                    {t('applicantInterview.googleAddress')}
                  </Form.Label>
                  <Col sm="10">
                    <InputGroup>
                      <Form.Control
                        type="text"
                        id="Google-interview"
                        defaultValue={values?.googleMapsLink}
                        readOnly
                      />
                      {values?.googleMapsLink && (
                        <InputGroup.Append>
                          <a
                            className="btn btn-primary px-3"
                            href={values?.googleMapsLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {t('common.view')}
                          </a>
                        </InputGroup.Append>
                      )}
                    </InputGroup>
                  </Col>
                </Form.Group>
              </Form>
            </Row>
          </Container>
        </div>
        <div className="applicant-interview-footer">
          {!isLockPhase2Active && !data?.submittedInterViewTimeSlotAt && (
            <Button
              variant="primary"
              disabled={!selectedTimeSlot}
              type="button"
              onClick={handleSubmit}
            >
              {t('applicantInterview.bookAppointment')}
            </Button>
          )}
          <Button variant="secondary" onClick={() => goBack()}>
            {t('common.back')}
          </Button>
        </div>
      </div>
    </div>
  )
}
