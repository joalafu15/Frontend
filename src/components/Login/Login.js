import React, { useState, useRef, useContext } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useTranslation } from 'react-i18next'
import { Formik } from 'formik'
import * as yup from 'yup'

import Notification from 'src/components/Notification'
import firebase from 'src/services/firebase'
import useAuth from 'src/hooks/useAuth'
import { isValidEmail } from 'src/utils/stringUtils'
import { SettingsContext } from 'src/contexts/settings'

import logo from 'src/img/enterprise-logo.svg'
import albiladLogo from 'src/img/albilad-logo.png'
import './Login.css'

const schema = yup.object().shape({
  username: yup
    .string()
    .required()
    .test(
      'username',
      'Please fill this field with the valid email or national id',
      (val) => {
        if (isNaN(val)) {
          return isValidEmail(val)
        }

        if (!isNaN(val)) {
          return val.toString().length >= 6
        }

        return true
      },
    ),
  password: yup.string().required(),
})

export default function Login() {
  const { t } = useTranslation()
  const { login } = useAuth()

  const form = useRef(null)

  const [errorCode, setErrorCode] = useState(0)
  const [recaptchaInit, setRecaptchaInit] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const redirectTo = (link) => window?.location?.replace(`/${link}`)

  const settings = useContext(SettingsContext)

  const configureCaptcha = () => {
    if (recaptchaInit) {
      window.recaptchaVerifier.reset()
      return
    }
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'challenge',
      {
        size: 'invisible',
      },
    )
    window.recaptchaVerifier.render()
    setRecaptchaInit(true)
  }

  const handleFormSubmit = async function (values) {
    window.sessionStorage.clear()
    setSubmitLoading(true)
    try {
      configureCaptcha()
      await window.recaptchaVerifier.verify()
    } catch (err) {
      setErrorCode('captcha')
    }

    /**
     * Use either email or username to login
     */
    const { username, password } = values
    const payload = { password }
    if (isValidEmail(username)) {
      payload.email = username
    } else {
      payload.username = username
    }

    login(payload)
      .then((response) => {
        if (response?.status === 200 && response?.data) {
          if (response?.data?.roles?.includes('admin')) {
            redirectTo('admin')
          } else if (
            response?.data?.roles?.includes('operations') ||
            response?.data?.roles?.includes('committee')
          ) {
            redirectTo('admin/candidates')
          } else {
            redirectTo('main')
          }
        } else {
          setErrorCode(response?.status)
        }
      })
      .catch((error) => {
        setErrorCode(error?.response?.status)
      })
      .finally(() => setSubmitLoading(false))
  }

  const renderErrorCode = () => {
    if (!errorCode) return
    switch (errorCode) {
      case 401:
      case 422:
        return (
          <Notification color="error" message={t('login.invalidCredentials')} />
        )

      case 'captcha':
        return <Notification color="error" message={t('login.errorCaptcha')} />

      default:
        return <Notification color="error" message={t('login.errorMessage')} />
    }
  }

  return (
    <>
      <div className="login__form-header">
        <img
          src={albiladLogo}
          className="albilad-logo"
          alt={t('copyright.albilad')}
        />
        <div className="login__logo">
          <img src={logo} alt={t('copyright.poweredByCloudtoday')} />
          <h5>{t('login.cardTitle')}</h5>
        </div>
        <div className="page-card-head login__form-text">
          <span className="indicator">{t('login.signIn')}</span>
        </div>
      </div>
      <div className="login__form">
        {renderErrorCode()}
        <div id="challenge" />
        <Formik
          innerRef={form}
          validationSchema={schema}
          onSubmit={handleFormSubmit}
          initialValues={{
            username: '',
            password: '',
          }}
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group size="lg" controlId="username">
                <Form.Label className="label">{t('login.username')}</Form.Label>
                <Form.Control
                  autoFocus
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  isInvalid={touched.username && !!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group size="lg" controlId="password">
                <Form.Label>{t('login.password')}</Form.Label>
                <Form.Control
                  type="password"
                  value={values.password}
                  name="password"
                  onChange={handleChange}
                  isInvalid={touched.password && !!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="login__form-footer">
                <a
                  href="/sign-up"
                  onClick={(e) => {
                    e.preventDefault()
                    redirectTo('sign-up')
                  }}
                  className="login-footer-link"
                >
                  {t('login.signUp')}
                </a>
                <a
                  href="/reset-password"
                  onClick={(e) => {
                    e.preventDefault()
                    redirectTo('reset-password')
                  }}
                  className="login-footer-link"
                >
                  {t('login.resetPassword')}
                </a>
              </div>
              <Button block size="lg" type="submit" disabled={submitLoading}>
                {t(submitLoading ? 'common.loading' : 'login.signIn')}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}
