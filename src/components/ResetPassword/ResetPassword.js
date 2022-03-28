import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import { useFormik } from 'formik'

import APIS from 'src/constants/api'
import { postApi } from 'src/services/request'

const INITIAL_VALUES = {
  nationalIdNumber: '',
  emailSent: false,
  code: '',
  password: '',
}

const ResetPassword = () => {
  const history = useHistory()
  const { t } = useTranslation()

  const redirectTo = (link) => {
    history.push(`/${link}`)
  }

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
    emailSent: Yup.boolean(),
    code: Yup.string().test(
      'code',
      t('validationMessage.required', {
        name: 'Code',
      }),
      (value, ctx) => {
        if (ctx?.parent?.emailSent && !value) {
          return false
        }

        return true
      },
    ),
    password: Yup.string()
      .test(
        'password',
        t('validationMessage.required', {
          name: 'Password',
        }),
        (value, ctx) => {
          if (ctx?.parent?.emailSent && !value) {
            return false
          }

          return true
        },
      )
      .min(
        8,
        t('validationMessage.min', {
          name: 'Password',
          min: 8,
        }),
      ),
  })

  const handleFormSubmit = async (values) => {
    if (!values?.emailSent) {
      return handleSendEmail()
    } else {
      return handleResetPassword()
    }
  }

  const {
    values,
    setFieldValue,
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    setTouched,
  } = useFormik({
    onSubmit: handleFormSubmit,
    initialValues: INITIAL_VALUES,
    validationSchema: validationSchema,
  })

  const handleSendEmail = async () => {
    try {
      const res = await postApi(APIS.authentication.resetPasswordSendEmail, {
        nationalIdNumber: values?.nationalIdNumber.toString(),
      })
      if (res?.status === 200) {
        toast.success(t('resetPassword.emailSent'))
        setFieldValue('emailSent', true)
        setTouched({
          code: false,
          password: false,
        })
      }
    } catch (err) {
      if (err?.data?.error?.message === 'Invalid national ID') {
        toast.error(t('resetPassword.invalidNationalID'))
      } else if (err?.data?.error?.message === 'Invalid user') {
        toast.error(t('resetPassword.invalidUser'))
      } else {
        toast.error(t('resetPassword.error'))
      }
    }
  }

  const handleResetPassword = async () => {
    try {
      const res = await postApi(APIS.authentication.resetPassword, {
        nationalIdNumber: values?.nationalIdNumber.toString(),
        code: values?.code,
        password: values?.password,
      })

      if (res?.status === 200) {
        redirectTo('')
        toast.success(t('resetPassword.success'))
      }
    } catch (err) {
      if (err?.data?.error?.message === 'Invalid Code') {
        toast.error(t('resetPassword.invalidCode'))
      } else if (err?.data?.error?.message === 'Invalid national ID') {
        toast.error(t('resetPassword.invalidNationalID'))
      } else if (err?.data?.error?.message === 'Invalid user') {
        toast.error(t('resetPassword.invalidUser'))
      } else {
        toast.error(t('resetPassword.error'))
      }
    }
  }

  if (!values?.emailSent)
    return (
      <>
        <div className="login__form-header">
          <div className="login__logo">
            <h5>{t('resetPassword.resetPasswordLabel')}</h5>
          </div>
        </div>
        <div className="login__form">
          <Form onSubmit={handleSubmit}>
            <div id="challenge" />
            <Form.Group size="lg">
              <Form.Label className="label">
                {t('candidateSignUp.nationalId')}
              </Form.Label>
              <Form.Control
                autoFocus
                required
                id="actual-national-id"
                name="actual-national-id"
                type="number"
                value={values?.nationalIdNumber}
                onChange={(event) => {
                  const val = event?.target?.value
                  setFieldValue('nationalIdNumber', val)
                }}
                isInvalid={
                  touched.nationalIdNumber && !!errors.nationalIdNumber
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors?.nationalIdNumber}
              </Form.Control.Feedback>
            </Form.Group>

            <Button block id="send-email" size="lg" type="submit">
              {t(isSubmitting ? 'common.loading' : 'resetPassword.sendEmail')}
            </Button>
          </Form>
        </div>
      </>
    )

  return (
    <>
      <div className="login__form-header">
        <div className="login__logo">
          <h5>{t('resetPassword.resetPasswordLabel')}</h5>
        </div>
      </div>
      <div className="login__form">
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg">
            <Form.Label>
              {t('resetPassword.code')}
              <br />
            </Form.Label>
            <Form.Control
              required
              id="verification-code"
              name="verification-code"
              type="text"
              value={values?.code}
              onChange={(event) => {
                const val = event?.target?.value
                setFieldValue('code', val)
              }}
              isInvalid={touched.code && !!errors.code}
            />
            <Form.Control.Feedback type="invalid">
              {errors?.code}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group size="lg">
            <Form.Label>
              {t('resetPassword.choosePassword')}
              <br />
              <small>{t('resetPassword.passwordRequirements')}</small>
            </Form.Label>
            <Form.Control
              required
              id="actual-new-password"
              name="actual-new-password"
              type="password"
              value={values?.password}
              minLength={8}
              onChange={(event) => {
                const val = event?.target?.value
                setFieldValue('password', val)
              }}
              isValid={touched.password && !errors.password}
              isInvalid={touched.password && !!errors.password}
            />
            <Form.Control.Feedback type="valid">
              {t('validationMessage.lookGood')}
            </Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              {errors?.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            block
            size="lg"
            type="submit"
            disabled={Object.keys(errors).length > 0 || isSubmitting}
          >
            {t(isSubmitting ? 'common.loading' : 'resetPassword.ctaButton')}
          </Button>
        </Form>
      </div>
    </>
  )
}

export default ResetPassword
