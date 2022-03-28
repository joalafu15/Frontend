import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { useFormik } from 'formik'

import Notification from 'src/components/Notification'

import { postCandidateVerifyInterviewStatus } from 'src/services/candidatesSvc'

const INITIAL_VALUES = {
  nationalIdNumber: '',
}

const CheckInterviewStatus = () => {
  const { t } = useTranslation()
  const [resultMessage, setResultMessage] = useState({})
  const [checkedId, setCheckedId] = useState(null)

  const validationSchema = Yup.object().shape({
    nationalIdNumber: Yup.string()
      .required(
        t('validationMessage.required', {
          name: 'National Id',
        }),
      )
      .min(
        8,
        t('validationMessage.min', {
          name: 'National Id',
          min: 8,
        }),
      ),
  })

  const handleFormSubmit = async (values) => {
    return handleVerifyInterviewStatus()
  }

  const {
    values,
    setFieldValue,
    resetForm,
    errors,
    touched,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    onSubmit: handleFormSubmit,
    initialValues: INITIAL_VALUES,
    validationSchema: validationSchema,
  })

  const handleVerifyInterviewStatus = async () => {
    try {
      const { data, status } = await postCandidateVerifyInterviewStatus({
        nationalIdNumber: values?.nationalIdNumber.toString(),
      })

      if (status === 200) {
        setCheckedId(values?.nationalIdNumber.toString())
        if (data?.passedInterview) {
          // "The candidate {nationalIdNumber} has passed the interview"
          setResultMessage({
            message: 'checkInterviewStatus.passedInterview',
            color: 'success',
          })
        } else if (data?.passedInterview === false) {
          //  "The candidate {nationalIdNumber} hasn't passed the interview"
          setResultMessage({
            message: 'checkInterviewStatus.notPassedInterview',
            color: 'error',
          })
        } else if (
          data?.conductedInterview === null ||
          data?.conductedInterview === false
        ) {
          // "The candidate {nationalIdNumber} hasn't conducted the interview yet."
          setResultMessage({
            message: 'checkInterviewStatus.notConductedInterview',
            color: 'info',
          })
        } else if (data?.conductedInterview && data?.passedInterview === null) {
          //"The candidate {nationalIdNumber} has conducted the interview but there is not a result yet."
          setResultMessage({
            message: 'checkInterviewStatus.conductedNoResult',
            color: 'info',
          })
        } else {
          setResultMessage({
            message: 'checkInterviewStatus.notConductedInterview',
            color: 'info',
          })
        }
        resetForm()
      }
    } catch (error) {
      if (error?.status === 404) {
        toast.error(t('checkInterviewStatus.notFound'))
      } else {
        toast.error(t('checkInterviewStatus.somethingWrong'))
      }
    }
  }

  return (
    <>
      <div className="login__form-header">
        <div className="login__logo">
          <h5>{t('checkInterviewStatus.title')}</h5>
        </div>
      </div>
      <div className="login__form">
        {Object.keys(resultMessage).length > 0 && (
          <Notification
            color={resultMessage?.color}
            message={t(resultMessage?.message, {
              nationalIdNumber: checkedId,
            })}
          />
        )}

        <Form onSubmit={handleSubmit}>
          <div id="challenge" />
          <Form.Group size="lg">
            <Form.Label className="label">
              {t('checkInterviewStatus.nationalIdNumber')}
            </Form.Label>
            <Form.Control
              autoFocus
              required
              type="number"
              name="nationalIdNumber"
              value={values?.nationalIdNumber}
              defaultValue={values?.nationalIdNumber}
              onChange={(event) => {
                const val = event?.target?.value
                setFieldValue('nationalIdNumber', val)
                if (Object.keys(resultMessage).length > 0) {
                  setResultMessage({})
                }
              }}
              isInvalid={touched.nationalIdNumber && !!errors.nationalIdNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.nationalIdNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <Button block id="send-email" size="lg" type="submit">
            {t(isSubmitting ? 'common.loading' : 'checkInterviewStatus.check')}
          </Button>
        </Form>
      </div>
    </>
  )
}

export default CheckInterviewStatus
